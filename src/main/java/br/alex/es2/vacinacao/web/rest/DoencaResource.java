package br.alex.es2.vacinacao.web.rest;

import br.alex.es2.vacinacao.domain.Doenca;
import br.alex.es2.vacinacao.repository.DoencaRepository;
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
 * REST controller for managing {@link br.alex.es2.vacinacao.domain.Doenca}.
 */
@RestController
@RequestMapping("/api/doencas")
@Transactional
public class DoencaResource {

    private final Logger log = LoggerFactory.getLogger(DoencaResource.class);

    private static final String ENTITY_NAME = "doenca";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DoencaRepository doencaRepository;

    public DoencaResource(DoencaRepository doencaRepository) {
        this.doencaRepository = doencaRepository;
    }

    /**
     * {@code POST  /doencas} : Create a new doenca.
     *
     * @param doenca the doenca to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new doenca, or with status {@code 400 (Bad Request)} if the doenca has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Doenca> createDoenca(@RequestBody Doenca doenca) throws URISyntaxException {
        log.debug("REST request to save Doenca : {}", doenca);
        if (doenca.getId() != null) {
            throw new BadRequestAlertException("A new doenca cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Doenca result = doencaRepository.save(doenca);
        return ResponseEntity
            .created(new URI("/api/doencas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /doencas/:id} : Updates an existing doenca.
     *
     * @param id the id of the doenca to save.
     * @param doenca the doenca to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated doenca,
     * or with status {@code 400 (Bad Request)} if the doenca is not valid,
     * or with status {@code 500 (Internal Server Error)} if the doenca couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Doenca> updateDoenca(@PathVariable(value = "id", required = false) final Long id, @RequestBody Doenca doenca)
        throws URISyntaxException {
        log.debug("REST request to update Doenca : {}, {}", id, doenca);
        if (doenca.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, doenca.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!doencaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Doenca result = doencaRepository.save(doenca);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, doenca.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /doencas/:id} : Partial updates given fields of an existing doenca, field will ignore if it is null
     *
     * @param id the id of the doenca to save.
     * @param doenca the doenca to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated doenca,
     * or with status {@code 400 (Bad Request)} if the doenca is not valid,
     * or with status {@code 404 (Not Found)} if the doenca is not found,
     * or with status {@code 500 (Internal Server Error)} if the doenca couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Doenca> partialUpdateDoenca(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Doenca doenca
    ) throws URISyntaxException {
        log.debug("REST request to partial update Doenca partially : {}, {}", id, doenca);
        if (doenca.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, doenca.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!doencaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Doenca> result = doencaRepository
            .findById(doenca.getId())
            .map(existingDoenca -> {
                if (doenca.getNome() != null) {
                    existingDoenca.setNome(doenca.getNome());
                }
                if (doenca.getCriado() != null) {
                    existingDoenca.setCriado(doenca.getCriado());
                }
                if (doenca.getDataPrimeiroCaso() != null) {
                    existingDoenca.setDataPrimeiroCaso(doenca.getDataPrimeiroCaso());
                }
                if (doenca.getLocalPrimeiroCaso() != null) {
                    existingDoenca.setLocalPrimeiroCaso(doenca.getLocalPrimeiroCaso());
                }

                return existingDoenca;
            })
            .map(doencaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, doenca.getId().toString())
        );
    }

    /**
     * {@code GET  /doencas} : get all the doencas.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of doencas in body.
     */
    @GetMapping("")
    public List<Doenca> getAllDoencas(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        log.debug("REST request to get all Doencas");
        if (eagerload) {
            return doencaRepository.findAllWithEagerRelationships();
        } else {
            return doencaRepository.findAll();
        }
    }

    /**
     * {@code GET  /doencas/:id} : get the "id" doenca.
     *
     * @param id the id of the doenca to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the doenca, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Doenca> getDoenca(@PathVariable("id") Long id) {
        log.debug("REST request to get Doenca : {}", id);
        Optional<Doenca> doenca = doencaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(doenca);
    }

    /**
     * {@code DELETE  /doencas/:id} : delete the "id" doenca.
     *
     * @param id the id of the doenca to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoenca(@PathVariable("id") Long id) {
        log.debug("REST request to delete Doenca : {}", id);
        doencaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
