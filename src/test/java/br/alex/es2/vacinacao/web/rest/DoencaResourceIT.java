package br.alex.es2.vacinacao.web.rest;

import static br.alex.es2.vacinacao.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.alex.es2.vacinacao.IntegrationTest;
import br.alex.es2.vacinacao.domain.Doenca;
import br.alex.es2.vacinacao.repository.DoencaRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DoencaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DoencaResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CRIADO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CRIADO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final LocalDate DEFAULT_DATA_PRIMEIRO_CASO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_PRIMEIRO_CASO = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_LOCAL_PRIMEIRO_CASO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_LOCAL_PRIMEIRO_CASO = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/doencas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DoencaRepository doencaRepository;

    @Mock
    private DoencaRepository doencaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDoencaMockMvc;

    private Doenca doenca;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Doenca createEntity(EntityManager em) {
        Doenca doenca = new Doenca()
            .nome(DEFAULT_NOME)
            .criado(DEFAULT_CRIADO)
            .dataPrimeiroCaso(DEFAULT_DATA_PRIMEIRO_CASO)
            .localPrimeiroCaso(DEFAULT_LOCAL_PRIMEIRO_CASO);
        return doenca;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Doenca createUpdatedEntity(EntityManager em) {
        Doenca doenca = new Doenca()
            .nome(UPDATED_NOME)
            .criado(UPDATED_CRIADO)
            .dataPrimeiroCaso(UPDATED_DATA_PRIMEIRO_CASO)
            .localPrimeiroCaso(UPDATED_LOCAL_PRIMEIRO_CASO);
        return doenca;
    }

    @BeforeEach
    public void initTest() {
        doenca = createEntity(em);
    }

    @Test
    @Transactional
    void createDoenca() throws Exception {
        int databaseSizeBeforeCreate = doencaRepository.findAll().size();
        // Create the Doenca
        restDoencaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(doenca)))
            .andExpect(status().isCreated());

        // Validate the Doenca in the database
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeCreate + 1);
        Doenca testDoenca = doencaList.get(doencaList.size() - 1);
        assertThat(testDoenca.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testDoenca.getCriado()).isEqualTo(DEFAULT_CRIADO);
        assertThat(testDoenca.getDataPrimeiroCaso()).isEqualTo(DEFAULT_DATA_PRIMEIRO_CASO);
        assertThat(testDoenca.getLocalPrimeiroCaso()).isEqualTo(DEFAULT_LOCAL_PRIMEIRO_CASO);
    }

    @Test
    @Transactional
    void createDoencaWithExistingId() throws Exception {
        // Create the Doenca with an existing ID
        doenca.setId(1L);

        int databaseSizeBeforeCreate = doencaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDoencaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(doenca)))
            .andExpect(status().isBadRequest());

        // Validate the Doenca in the database
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDoencas() throws Exception {
        // Initialize the database
        doencaRepository.saveAndFlush(doenca);

        // Get all the doencaList
        restDoencaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(doenca.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].criado").value(hasItem(sameInstant(DEFAULT_CRIADO))))
            .andExpect(jsonPath("$.[*].dataPrimeiroCaso").value(hasItem(DEFAULT_DATA_PRIMEIRO_CASO.toString())))
            .andExpect(jsonPath("$.[*].localPrimeiroCaso").value(hasItem(DEFAULT_LOCAL_PRIMEIRO_CASO.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDoencasWithEagerRelationshipsIsEnabled() throws Exception {
        when(doencaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDoencaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(doencaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDoencasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(doencaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDoencaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(doencaRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getDoenca() throws Exception {
        // Initialize the database
        doencaRepository.saveAndFlush(doenca);

        // Get the doenca
        restDoencaMockMvc
            .perform(get(ENTITY_API_URL_ID, doenca.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(doenca.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.criado").value(sameInstant(DEFAULT_CRIADO)))
            .andExpect(jsonPath("$.dataPrimeiroCaso").value(DEFAULT_DATA_PRIMEIRO_CASO.toString()))
            .andExpect(jsonPath("$.localPrimeiroCaso").value(DEFAULT_LOCAL_PRIMEIRO_CASO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDoenca() throws Exception {
        // Get the doenca
        restDoencaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDoenca() throws Exception {
        // Initialize the database
        doencaRepository.saveAndFlush(doenca);

        int databaseSizeBeforeUpdate = doencaRepository.findAll().size();

        // Update the doenca
        Doenca updatedDoenca = doencaRepository.findById(doenca.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDoenca are not directly saved in db
        em.detach(updatedDoenca);
        updatedDoenca
            .nome(UPDATED_NOME)
            .criado(UPDATED_CRIADO)
            .dataPrimeiroCaso(UPDATED_DATA_PRIMEIRO_CASO)
            .localPrimeiroCaso(UPDATED_LOCAL_PRIMEIRO_CASO);

        restDoencaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDoenca.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDoenca))
            )
            .andExpect(status().isOk());

        // Validate the Doenca in the database
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeUpdate);
        Doenca testDoenca = doencaList.get(doencaList.size() - 1);
        assertThat(testDoenca.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testDoenca.getCriado()).isEqualTo(UPDATED_CRIADO);
        assertThat(testDoenca.getDataPrimeiroCaso()).isEqualTo(UPDATED_DATA_PRIMEIRO_CASO);
        assertThat(testDoenca.getLocalPrimeiroCaso()).isEqualTo(UPDATED_LOCAL_PRIMEIRO_CASO);
    }

    @Test
    @Transactional
    void putNonExistingDoenca() throws Exception {
        int databaseSizeBeforeUpdate = doencaRepository.findAll().size();
        doenca.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDoencaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, doenca.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doenca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Doenca in the database
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDoenca() throws Exception {
        int databaseSizeBeforeUpdate = doencaRepository.findAll().size();
        doenca.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDoencaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(doenca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Doenca in the database
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDoenca() throws Exception {
        int databaseSizeBeforeUpdate = doencaRepository.findAll().size();
        doenca.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDoencaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(doenca)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Doenca in the database
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDoencaWithPatch() throws Exception {
        // Initialize the database
        doencaRepository.saveAndFlush(doenca);

        int databaseSizeBeforeUpdate = doencaRepository.findAll().size();

        // Update the doenca using partial update
        Doenca partialUpdatedDoenca = new Doenca();
        partialUpdatedDoenca.setId(doenca.getId());

        partialUpdatedDoenca.nome(UPDATED_NOME).criado(UPDATED_CRIADO);

        restDoencaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDoenca.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDoenca))
            )
            .andExpect(status().isOk());

        // Validate the Doenca in the database
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeUpdate);
        Doenca testDoenca = doencaList.get(doencaList.size() - 1);
        assertThat(testDoenca.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testDoenca.getCriado()).isEqualTo(UPDATED_CRIADO);
        assertThat(testDoenca.getDataPrimeiroCaso()).isEqualTo(DEFAULT_DATA_PRIMEIRO_CASO);
        assertThat(testDoenca.getLocalPrimeiroCaso()).isEqualTo(DEFAULT_LOCAL_PRIMEIRO_CASO);
    }

    @Test
    @Transactional
    void fullUpdateDoencaWithPatch() throws Exception {
        // Initialize the database
        doencaRepository.saveAndFlush(doenca);

        int databaseSizeBeforeUpdate = doencaRepository.findAll().size();

        // Update the doenca using partial update
        Doenca partialUpdatedDoenca = new Doenca();
        partialUpdatedDoenca.setId(doenca.getId());

        partialUpdatedDoenca
            .nome(UPDATED_NOME)
            .criado(UPDATED_CRIADO)
            .dataPrimeiroCaso(UPDATED_DATA_PRIMEIRO_CASO)
            .localPrimeiroCaso(UPDATED_LOCAL_PRIMEIRO_CASO);

        restDoencaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDoenca.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDoenca))
            )
            .andExpect(status().isOk());

        // Validate the Doenca in the database
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeUpdate);
        Doenca testDoenca = doencaList.get(doencaList.size() - 1);
        assertThat(testDoenca.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testDoenca.getCriado()).isEqualTo(UPDATED_CRIADO);
        assertThat(testDoenca.getDataPrimeiroCaso()).isEqualTo(UPDATED_DATA_PRIMEIRO_CASO);
        assertThat(testDoenca.getLocalPrimeiroCaso()).isEqualTo(UPDATED_LOCAL_PRIMEIRO_CASO);
    }

    @Test
    @Transactional
    void patchNonExistingDoenca() throws Exception {
        int databaseSizeBeforeUpdate = doencaRepository.findAll().size();
        doenca.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDoencaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, doenca.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(doenca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Doenca in the database
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDoenca() throws Exception {
        int databaseSizeBeforeUpdate = doencaRepository.findAll().size();
        doenca.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDoencaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(doenca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Doenca in the database
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDoenca() throws Exception {
        int databaseSizeBeforeUpdate = doencaRepository.findAll().size();
        doenca.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDoencaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(doenca)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Doenca in the database
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDoenca() throws Exception {
        // Initialize the database
        doencaRepository.saveAndFlush(doenca);

        int databaseSizeBeforeDelete = doencaRepository.findAll().size();

        // Delete the doenca
        restDoencaMockMvc
            .perform(delete(ENTITY_API_URL_ID, doenca.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Doenca> doencaList = doencaRepository.findAll();
        assertThat(doencaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
