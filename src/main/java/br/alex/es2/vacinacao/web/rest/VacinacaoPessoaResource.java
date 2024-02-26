package br.alex.es2.vacinacao.web.rest;

import br.alex.es2.vacinacao.domain.VacinacaoPessoa;
import br.alex.es2.vacinacao.repository.VacinacaoPessoaRepository;
import br.alex.es2.vacinacao.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.alex.es2.vacinacao.domain.VacinacaoPessoa}.
 */
@RestController
@RequestMapping("/api/vacinacao-pessoas")
@Transactional
public class VacinacaoPessoaResource {

    private final Logger log = LoggerFactory.getLogger(VacinacaoPessoaResource.class);

    private static final String ENTITY_NAME = "vacinacaoPessoa";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VacinacaoPessoaRepository vacinacaoPessoaRepository;

    public VacinacaoPessoaResource(VacinacaoPessoaRepository vacinacaoPessoaRepository) {
        this.vacinacaoPessoaRepository = vacinacaoPessoaRepository;
    }

    /**
     * {@code POST  /vacinacao-pessoas} : Create a new vacinacaoPessoa.
     *
     * @param vacinacaoPessoa the vacinacaoPessoa to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vacinacaoPessoa, or with status {@code 400 (Bad Request)} if the vacinacaoPessoa has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<VacinacaoPessoa> createVacinacaoPessoa(@RequestBody VacinacaoPessoa vacinacaoPessoa) throws URISyntaxException {
        log.debug("REST request to save VacinacaoPessoa : {}", vacinacaoPessoa);
        if (vacinacaoPessoa.getId() != null) {
            throw new BadRequestAlertException("A new vacinacaoPessoa cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VacinacaoPessoa result = vacinacaoPessoaRepository.save(vacinacaoPessoa);
        return ResponseEntity
            .created(new URI("/api/vacinacao-pessoas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vacinacao-pessoas/:id} : Updates an existing vacinacaoPessoa.
     *
     * @param id the id of the vacinacaoPessoa to save.
     * @param vacinacaoPessoa the vacinacaoPessoa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacinacaoPessoa,
     * or with status {@code 400 (Bad Request)} if the vacinacaoPessoa is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vacinacaoPessoa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<VacinacaoPessoa> updateVacinacaoPessoa(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VacinacaoPessoa vacinacaoPessoa
    ) throws URISyntaxException {
        log.debug("REST request to update VacinacaoPessoa : {}, {}", id, vacinacaoPessoa);
        if (vacinacaoPessoa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacinacaoPessoa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacinacaoPessoaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VacinacaoPessoa result = vacinacaoPessoaRepository.save(vacinacaoPessoa);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, vacinacaoPessoa.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vacinacao-pessoas/:id} : Partial updates given fields of an existing vacinacaoPessoa, field will ignore if it is null
     *
     * @param id the id of the vacinacaoPessoa to save.
     * @param vacinacaoPessoa the vacinacaoPessoa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacinacaoPessoa,
     * or with status {@code 400 (Bad Request)} if the vacinacaoPessoa is not valid,
     * or with status {@code 404 (Not Found)} if the vacinacaoPessoa is not found,
     * or with status {@code 500 (Internal Server Error)} if the vacinacaoPessoa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VacinacaoPessoa> partialUpdateVacinacaoPessoa(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VacinacaoPessoa vacinacaoPessoa
    ) throws URISyntaxException {
        log.debug("REST request to partial update VacinacaoPessoa partially : {}, {}", id, vacinacaoPessoa);
        if (vacinacaoPessoa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacinacaoPessoa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacinacaoPessoaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VacinacaoPessoa> result = vacinacaoPessoaRepository
            .findById(vacinacaoPessoa.getId())
            .map(existingVacinacaoPessoa -> {
                if (vacinacaoPessoa.getQuando() != null) {
                    existingVacinacaoPessoa.setQuando(vacinacaoPessoa.getQuando());
                }
                if (vacinacaoPessoa.getCns() != null) {
                    existingVacinacaoPessoa.setCns(vacinacaoPessoa.getCns());
                }
                if (vacinacaoPessoa.getCodigoProfissinal() != null) {
                    existingVacinacaoPessoa.setCodigoProfissinal(vacinacaoPessoa.getCodigoProfissinal());
                }

                return existingVacinacaoPessoa;
            })
            .map(vacinacaoPessoaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, vacinacaoPessoa.getId().toString())
        );
    }

    /**
     * {@code GET  /vacinacao-pessoas} : get all the vacinacaoPessoas.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vacinacaoPessoas in body.
     */
    @GetMapping("")
    public List<VacinacaoPessoa> getAllVacinacaoPessoas(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get all VacinacaoPessoas");
        if (eagerload) {
            return vacinacaoPessoaRepository.findAllWithEagerRelationships();
        } else {
            return vacinacaoPessoaRepository.findAll();
        }
    }

    /**
     * {@code GET  /vacinacao-pessoas/:id} : get the "id" vacinacaoPessoa.
     *
     * @param id the id of the vacinacaoPessoa to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vacinacaoPessoa, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<VacinacaoPessoa> getVacinacaoPessoa(@PathVariable("id") Long id) {
        log.debug("REST request to get VacinacaoPessoa : {}", id);
        Optional<VacinacaoPessoa> vacinacaoPessoa = vacinacaoPessoaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(vacinacaoPessoa);
    }

    /**
     * {@code DELETE  /vacinacao-pessoas/:id} : delete the "id" vacinacaoPessoa.
     *
     * @param id the id of the vacinacaoPessoa to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVacinacaoPessoa(@PathVariable("id") Long id) {
        log.debug("REST request to delete VacinacaoPessoa : {}", id);
        vacinacaoPessoaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
