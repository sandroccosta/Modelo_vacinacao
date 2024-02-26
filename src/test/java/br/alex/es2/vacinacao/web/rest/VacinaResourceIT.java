package br.alex.es2.vacinacao.web.rest;

import static br.alex.es2.vacinacao.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.alex.es2.vacinacao.IntegrationTest;
import br.alex.es2.vacinacao.domain.Vacina;
import br.alex.es2.vacinacao.repository.VacinaRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
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
 * Integration tests for the {@link VacinaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class VacinaResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CRIADO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CRIADO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/vacinas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VacinaRepository vacinaRepository;

    @Mock
    private VacinaRepository vacinaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVacinaMockMvc;

    private Vacina vacina;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vacina createEntity(EntityManager em) {
        Vacina vacina = new Vacina().nome(DEFAULT_NOME).criado(DEFAULT_CRIADO);
        return vacina;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vacina createUpdatedEntity(EntityManager em) {
        Vacina vacina = new Vacina().nome(UPDATED_NOME).criado(UPDATED_CRIADO);
        return vacina;
    }

    @BeforeEach
    public void initTest() {
        vacina = createEntity(em);
    }

    @Test
    @Transactional
    void createVacina() throws Exception {
        int databaseSizeBeforeCreate = vacinaRepository.findAll().size();
        // Create the Vacina
        restVacinaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacina)))
            .andExpect(status().isCreated());

        // Validate the Vacina in the database
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeCreate + 1);
        Vacina testVacina = vacinaList.get(vacinaList.size() - 1);
        assertThat(testVacina.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testVacina.getCriado()).isEqualTo(DEFAULT_CRIADO);
    }

    @Test
    @Transactional
    void createVacinaWithExistingId() throws Exception {
        // Create the Vacina with an existing ID
        vacina.setId(1L);

        int databaseSizeBeforeCreate = vacinaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVacinaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacina)))
            .andExpect(status().isBadRequest());

        // Validate the Vacina in the database
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVacinas() throws Exception {
        // Initialize the database
        vacinaRepository.saveAndFlush(vacina);

        // Get all the vacinaList
        restVacinaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vacina.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].criado").value(hasItem(sameInstant(DEFAULT_CRIADO))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVacinasWithEagerRelationshipsIsEnabled() throws Exception {
        when(vacinaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVacinaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(vacinaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVacinasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(vacinaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVacinaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(vacinaRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getVacina() throws Exception {
        // Initialize the database
        vacinaRepository.saveAndFlush(vacina);

        // Get the vacina
        restVacinaMockMvc
            .perform(get(ENTITY_API_URL_ID, vacina.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vacina.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.criado").value(sameInstant(DEFAULT_CRIADO)));
    }

    @Test
    @Transactional
    void getNonExistingVacina() throws Exception {
        // Get the vacina
        restVacinaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVacina() throws Exception {
        // Initialize the database
        vacinaRepository.saveAndFlush(vacina);

        int databaseSizeBeforeUpdate = vacinaRepository.findAll().size();

        // Update the vacina
        Vacina updatedVacina = vacinaRepository.findById(vacina.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedVacina are not directly saved in db
        em.detach(updatedVacina);
        updatedVacina.nome(UPDATED_NOME).criado(UPDATED_CRIADO);

        restVacinaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVacina.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVacina))
            )
            .andExpect(status().isOk());

        // Validate the Vacina in the database
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeUpdate);
        Vacina testVacina = vacinaList.get(vacinaList.size() - 1);
        assertThat(testVacina.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testVacina.getCriado()).isEqualTo(UPDATED_CRIADO);
    }

    @Test
    @Transactional
    void putNonExistingVacina() throws Exception {
        int databaseSizeBeforeUpdate = vacinaRepository.findAll().size();
        vacina.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacinaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vacina.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacina))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacina in the database
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVacina() throws Exception {
        int databaseSizeBeforeUpdate = vacinaRepository.findAll().size();
        vacina.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacinaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacina))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacina in the database
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVacina() throws Exception {
        int databaseSizeBeforeUpdate = vacinaRepository.findAll().size();
        vacina.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacinaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacina)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vacina in the database
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVacinaWithPatch() throws Exception {
        // Initialize the database
        vacinaRepository.saveAndFlush(vacina);

        int databaseSizeBeforeUpdate = vacinaRepository.findAll().size();

        // Update the vacina using partial update
        Vacina partialUpdatedVacina = new Vacina();
        partialUpdatedVacina.setId(vacina.getId());

        partialUpdatedVacina.nome(UPDATED_NOME);

        restVacinaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacina.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVacina))
            )
            .andExpect(status().isOk());

        // Validate the Vacina in the database
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeUpdate);
        Vacina testVacina = vacinaList.get(vacinaList.size() - 1);
        assertThat(testVacina.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testVacina.getCriado()).isEqualTo(DEFAULT_CRIADO);
    }

    @Test
    @Transactional
    void fullUpdateVacinaWithPatch() throws Exception {
        // Initialize the database
        vacinaRepository.saveAndFlush(vacina);

        int databaseSizeBeforeUpdate = vacinaRepository.findAll().size();

        // Update the vacina using partial update
        Vacina partialUpdatedVacina = new Vacina();
        partialUpdatedVacina.setId(vacina.getId());

        partialUpdatedVacina.nome(UPDATED_NOME).criado(UPDATED_CRIADO);

        restVacinaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacina.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVacina))
            )
            .andExpect(status().isOk());

        // Validate the Vacina in the database
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeUpdate);
        Vacina testVacina = vacinaList.get(vacinaList.size() - 1);
        assertThat(testVacina.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testVacina.getCriado()).isEqualTo(UPDATED_CRIADO);
    }

    @Test
    @Transactional
    void patchNonExistingVacina() throws Exception {
        int databaseSizeBeforeUpdate = vacinaRepository.findAll().size();
        vacina.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacinaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vacina.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacina))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacina in the database
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVacina() throws Exception {
        int databaseSizeBeforeUpdate = vacinaRepository.findAll().size();
        vacina.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacinaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacina))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vacina in the database
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVacina() throws Exception {
        int databaseSizeBeforeUpdate = vacinaRepository.findAll().size();
        vacina.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacinaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(vacina)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vacina in the database
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVacina() throws Exception {
        // Initialize the database
        vacinaRepository.saveAndFlush(vacina);

        int databaseSizeBeforeDelete = vacinaRepository.findAll().size();

        // Delete the vacina
        restVacinaMockMvc
            .perform(delete(ENTITY_API_URL_ID, vacina.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vacina> vacinaList = vacinaRepository.findAll();
        assertThat(vacinaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
