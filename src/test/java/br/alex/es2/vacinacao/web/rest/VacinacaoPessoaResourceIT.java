package br.alex.es2.vacinacao.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.alex.es2.vacinacao.IntegrationTest;
import br.alex.es2.vacinacao.domain.VacinacaoPessoa;
import br.alex.es2.vacinacao.repository.VacinacaoPessoaRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link VacinacaoPessoaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class VacinacaoPessoaResourceIT {

    private static final LocalDate DEFAULT_QUANDO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_QUANDO = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_CNS = "AAAAAAAAAA";
    private static final String UPDATED_CNS = "BBBBBBBBBB";

    private static final String DEFAULT_CODIGO_PROFISSINAL = "AAAAAAAAAA";
    private static final String UPDATED_CODIGO_PROFISSINAL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/vacinacao-pessoas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VacinacaoPessoaRepository vacinacaoPessoaRepository;

    @Mock
    private VacinacaoPessoaRepository vacinacaoPessoaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVacinacaoPessoaMockMvc;

    private VacinacaoPessoa vacinacaoPessoa;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VacinacaoPessoa createEntity(EntityManager em) {
        VacinacaoPessoa vacinacaoPessoa = new VacinacaoPessoa()
            .quando(DEFAULT_QUANDO)
            .cns(DEFAULT_CNS)
            .codigoProfissinal(DEFAULT_CODIGO_PROFISSINAL);
        return vacinacaoPessoa;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VacinacaoPessoa createUpdatedEntity(EntityManager em) {
        VacinacaoPessoa vacinacaoPessoa = new VacinacaoPessoa()
            .quando(UPDATED_QUANDO)
            .cns(UPDATED_CNS)
            .codigoProfissinal(UPDATED_CODIGO_PROFISSINAL);
        return vacinacaoPessoa;
    }

    @BeforeEach
    public void initTest() {
        vacinacaoPessoa = createEntity(em);
    }

    @Test
    @Transactional
    void createVacinacaoPessoa() throws Exception {
        int databaseSizeBeforeCreate = vacinacaoPessoaRepository.findAll().size();
        // Create the VacinacaoPessoa
        restVacinacaoPessoaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacinacaoPessoa))
            )
            .andExpect(status().isCreated());

        // Validate the VacinacaoPessoa in the database
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeCreate + 1);
        VacinacaoPessoa testVacinacaoPessoa = vacinacaoPessoaList.get(vacinacaoPessoaList.size() - 1);
        assertThat(testVacinacaoPessoa.getQuando()).isEqualTo(DEFAULT_QUANDO);
        assertThat(testVacinacaoPessoa.getCns()).isEqualTo(DEFAULT_CNS);
        assertThat(testVacinacaoPessoa.getCodigoProfissinal()).isEqualTo(DEFAULT_CODIGO_PROFISSINAL);
    }

    @Test
    @Transactional
    void createVacinacaoPessoaWithExistingId() throws Exception {
        // Create the VacinacaoPessoa with an existing ID
        vacinacaoPessoa.setId(1L);

        int databaseSizeBeforeCreate = vacinacaoPessoaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVacinacaoPessoaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacinacaoPessoa))
            )
            .andExpect(status().isBadRequest());

        // Validate the VacinacaoPessoa in the database
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVacinacaoPessoas() throws Exception {
        // Initialize the database
        vacinacaoPessoaRepository.saveAndFlush(vacinacaoPessoa);

        // Get all the vacinacaoPessoaList
        restVacinacaoPessoaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vacinacaoPessoa.getId().intValue())))
            .andExpect(jsonPath("$.[*].quando").value(hasItem(DEFAULT_QUANDO.toString())))
            .andExpect(jsonPath("$.[*].cns").value(hasItem(DEFAULT_CNS)))
            .andExpect(jsonPath("$.[*].codigoProfissinal").value(hasItem(DEFAULT_CODIGO_PROFISSINAL)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVacinacaoPessoasWithEagerRelationshipsIsEnabled() throws Exception {
        when(vacinacaoPessoaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVacinacaoPessoaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(vacinacaoPessoaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVacinacaoPessoasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(vacinacaoPessoaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVacinacaoPessoaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(vacinacaoPessoaRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getVacinacaoPessoa() throws Exception {
        // Initialize the database
        vacinacaoPessoaRepository.saveAndFlush(vacinacaoPessoa);

        // Get the vacinacaoPessoa
        restVacinacaoPessoaMockMvc
            .perform(get(ENTITY_API_URL_ID, vacinacaoPessoa.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vacinacaoPessoa.getId().intValue()))
            .andExpect(jsonPath("$.quando").value(DEFAULT_QUANDO.toString()))
            .andExpect(jsonPath("$.cns").value(DEFAULT_CNS))
            .andExpect(jsonPath("$.codigoProfissinal").value(DEFAULT_CODIGO_PROFISSINAL));
    }

    @Test
    @Transactional
    void getNonExistingVacinacaoPessoa() throws Exception {
        // Get the vacinacaoPessoa
        restVacinacaoPessoaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVacinacaoPessoa() throws Exception {
        // Initialize the database
        vacinacaoPessoaRepository.saveAndFlush(vacinacaoPessoa);

        int databaseSizeBeforeUpdate = vacinacaoPessoaRepository.findAll().size();

        // Update the vacinacaoPessoa
        VacinacaoPessoa updatedVacinacaoPessoa = vacinacaoPessoaRepository.findById(vacinacaoPessoa.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedVacinacaoPessoa are not directly saved in db
        em.detach(updatedVacinacaoPessoa);
        updatedVacinacaoPessoa.quando(UPDATED_QUANDO).cns(UPDATED_CNS).codigoProfissinal(UPDATED_CODIGO_PROFISSINAL);

        restVacinacaoPessoaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVacinacaoPessoa.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVacinacaoPessoa))
            )
            .andExpect(status().isOk());

        // Validate the VacinacaoPessoa in the database
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeUpdate);
        VacinacaoPessoa testVacinacaoPessoa = vacinacaoPessoaList.get(vacinacaoPessoaList.size() - 1);
        assertThat(testVacinacaoPessoa.getQuando()).isEqualTo(UPDATED_QUANDO);
        assertThat(testVacinacaoPessoa.getCns()).isEqualTo(UPDATED_CNS);
        assertThat(testVacinacaoPessoa.getCodigoProfissinal()).isEqualTo(UPDATED_CODIGO_PROFISSINAL);
    }

    @Test
    @Transactional
    void putNonExistingVacinacaoPessoa() throws Exception {
        int databaseSizeBeforeUpdate = vacinacaoPessoaRepository.findAll().size();
        vacinacaoPessoa.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacinacaoPessoaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vacinacaoPessoa.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacinacaoPessoa))
            )
            .andExpect(status().isBadRequest());

        // Validate the VacinacaoPessoa in the database
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVacinacaoPessoa() throws Exception {
        int databaseSizeBeforeUpdate = vacinacaoPessoaRepository.findAll().size();
        vacinacaoPessoa.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacinacaoPessoaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vacinacaoPessoa))
            )
            .andExpect(status().isBadRequest());

        // Validate the VacinacaoPessoa in the database
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVacinacaoPessoa() throws Exception {
        int databaseSizeBeforeUpdate = vacinacaoPessoaRepository.findAll().size();
        vacinacaoPessoa.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacinacaoPessoaMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vacinacaoPessoa))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VacinacaoPessoa in the database
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVacinacaoPessoaWithPatch() throws Exception {
        // Initialize the database
        vacinacaoPessoaRepository.saveAndFlush(vacinacaoPessoa);

        int databaseSizeBeforeUpdate = vacinacaoPessoaRepository.findAll().size();

        // Update the vacinacaoPessoa using partial update
        VacinacaoPessoa partialUpdatedVacinacaoPessoa = new VacinacaoPessoa();
        partialUpdatedVacinacaoPessoa.setId(vacinacaoPessoa.getId());

        partialUpdatedVacinacaoPessoa.quando(UPDATED_QUANDO).cns(UPDATED_CNS);

        restVacinacaoPessoaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacinacaoPessoa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVacinacaoPessoa))
            )
            .andExpect(status().isOk());

        // Validate the VacinacaoPessoa in the database
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeUpdate);
        VacinacaoPessoa testVacinacaoPessoa = vacinacaoPessoaList.get(vacinacaoPessoaList.size() - 1);
        assertThat(testVacinacaoPessoa.getQuando()).isEqualTo(UPDATED_QUANDO);
        assertThat(testVacinacaoPessoa.getCns()).isEqualTo(UPDATED_CNS);
        assertThat(testVacinacaoPessoa.getCodigoProfissinal()).isEqualTo(DEFAULT_CODIGO_PROFISSINAL);
    }

    @Test
    @Transactional
    void fullUpdateVacinacaoPessoaWithPatch() throws Exception {
        // Initialize the database
        vacinacaoPessoaRepository.saveAndFlush(vacinacaoPessoa);

        int databaseSizeBeforeUpdate = vacinacaoPessoaRepository.findAll().size();

        // Update the vacinacaoPessoa using partial update
        VacinacaoPessoa partialUpdatedVacinacaoPessoa = new VacinacaoPessoa();
        partialUpdatedVacinacaoPessoa.setId(vacinacaoPessoa.getId());

        partialUpdatedVacinacaoPessoa.quando(UPDATED_QUANDO).cns(UPDATED_CNS).codigoProfissinal(UPDATED_CODIGO_PROFISSINAL);

        restVacinacaoPessoaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacinacaoPessoa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVacinacaoPessoa))
            )
            .andExpect(status().isOk());

        // Validate the VacinacaoPessoa in the database
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeUpdate);
        VacinacaoPessoa testVacinacaoPessoa = vacinacaoPessoaList.get(vacinacaoPessoaList.size() - 1);
        assertThat(testVacinacaoPessoa.getQuando()).isEqualTo(UPDATED_QUANDO);
        assertThat(testVacinacaoPessoa.getCns()).isEqualTo(UPDATED_CNS);
        assertThat(testVacinacaoPessoa.getCodigoProfissinal()).isEqualTo(UPDATED_CODIGO_PROFISSINAL);
    }

    @Test
    @Transactional
    void patchNonExistingVacinacaoPessoa() throws Exception {
        int databaseSizeBeforeUpdate = vacinacaoPessoaRepository.findAll().size();
        vacinacaoPessoa.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacinacaoPessoaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vacinacaoPessoa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacinacaoPessoa))
            )
            .andExpect(status().isBadRequest());

        // Validate the VacinacaoPessoa in the database
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVacinacaoPessoa() throws Exception {
        int databaseSizeBeforeUpdate = vacinacaoPessoaRepository.findAll().size();
        vacinacaoPessoa.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacinacaoPessoaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacinacaoPessoa))
            )
            .andExpect(status().isBadRequest());

        // Validate the VacinacaoPessoa in the database
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVacinacaoPessoa() throws Exception {
        int databaseSizeBeforeUpdate = vacinacaoPessoaRepository.findAll().size();
        vacinacaoPessoa.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacinacaoPessoaMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vacinacaoPessoa))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VacinacaoPessoa in the database
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVacinacaoPessoa() throws Exception {
        // Initialize the database
        vacinacaoPessoaRepository.saveAndFlush(vacinacaoPessoa);

        int databaseSizeBeforeDelete = vacinacaoPessoaRepository.findAll().size();

        // Delete the vacinacaoPessoa
        restVacinacaoPessoaMockMvc
            .perform(delete(ENTITY_API_URL_ID, vacinacaoPessoa.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VacinacaoPessoa> vacinacaoPessoaList = vacinacaoPessoaRepository.findAll();
        assertThat(vacinacaoPessoaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
