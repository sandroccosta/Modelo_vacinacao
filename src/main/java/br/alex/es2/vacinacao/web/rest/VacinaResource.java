package br.alex.es2.vacinacao.web.rest;

import br.alex.es2.vacinacao.domain.Vacina;
import br.alex.es2.vacinacao.repository.VacinaRepository;
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
 * REST controller for managing {@link br.alex.es2.vacinacao.domain.Vacina}.
 */
@RestController
@RequestMapping("/api/vacinas")
@Transactional
public class VacinaResource {

    private final Logger log = LoggerFactory.getLogger(VacinaResource.class);

    private static final String ENTITY_NAME = "vacina";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VacinaRepository vacinaRepository;

    public VacinaResource(VacinaRepository vacinaRepository) {
        this.vacinaRepository = vacinaRepository;
    }

    /**
     * {@code POST  /vacinas} : Create a new vacina.
     *
     * @param vacina the vacina to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vacina, or with status {@code 400 (Bad Request)} if the vacina has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Vacina> createVacina(@RequestBody Vacina vacina) throws URISyntaxException {
        log.debug("REST request to save Vacina : {}", vacina);
        if (vacina.getId() != null) {
            throw new BadRequestAlertException("A new vacina cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vacina result = vacinaRepository.save(vacina);
        return ResponseEntity
            .created(new URI("/api/vacinas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vacinas/:id} : Updates an existing vacina.
     *
     * @param id the id of the vacina to save.
     * @param vacina the vacina to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacina,
     * or with status {@code 400 (Bad Request)} if the vacina is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vacina couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Vacina> updateVacina(@PathVariable(value = "id", required = false) final Long id, @RequestBody Vacina vacina)
        throws URISyntaxException {
        log.debug("REST request to update Vacina : {}, {}", id, vacina);
        if (vacina.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacina.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacinaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vacina result = vacinaRepository.save(vacina);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vacina.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vacinas/:id} : Partial updates given fields of an existing vacina, field will ignore if it is null
     *
     * @param id the id of the vacina to save.
     * @param vacina the vacina to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacina,
     * or with status {@code 400 (Bad Request)} if the vacina is not valid,
     * or with status {@code 404 (Not Found)} if the vacina is not found,
     * or with status {@code 500 (Internal Server Error)} if the vacina couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Vacina> partialUpdateVacina(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Vacina vacina
    ) throws URISyntaxException {
        log.debug("REST request to partial update Vacina partially : {}, {}", id, vacina);
        if (vacina.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacina.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacinaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Vacina> result = vacinaRepository
            .findById(vacina.getId())
            .map(existingVacina -> {
                if (vacina.getNome() != null) {
                    existingVacina.setNome(vacina.getNome());
                }
                if (vacina.getCriado() != null) {
                    existingVacina.setCriado(vacina.getCriado());
                }

                return existingVacina;
            })
            .map(vacinaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vacina.getId().toString())
        );
    }

    /**
     * {@code GET  /vacinas} : get all the vacinas.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vacinas in body.
     */
    @GetMapping("")
    public List<Vacina> getAllVacinas(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        log.debug("REST request to get all Vacinas");
        if (eagerload) {
            return vacinaRepository.findAllWithEagerRelationships();
        } else {
            return vacinaRepository.findAll();
        }
    }

    /**
     * {@code GET  /vacinas/:id} : get the "id" vacina.
     *
     * @param id the id of the vacina to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vacina, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Vacina> getVacina(@PathVariable("id") Long id) {
        log.debug("REST request to get Vacina : {}", id);
        Optional<Vacina> vacina = vacinaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(vacina);
    }

    /**
     * {@code DELETE  /vacinas/:id} : delete the "id" vacina.
     *
     * @param id the id of the vacina to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVacina(@PathVariable("id") Long id) {
        log.debug("REST request to delete Vacina : {}", id);
        vacinaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
