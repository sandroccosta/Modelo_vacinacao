package br.alex.es2.vacinacao.repository;

import br.alex.es2.vacinacao.domain.Fabricante;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Fabricante entity.
 *
 * When extending this class, extend FabricanteRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface FabricanteRepository extends FabricanteRepositoryWithBagRelationships, JpaRepository<Fabricante, Long> {
    default Optional<Fabricante> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Fabricante> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Fabricante> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select fabricante from Fabricante fabricante left join fetch fabricante.pais",
        countQuery = "select count(fabricante) from Fabricante fabricante"
    )
    Page<Fabricante> findAllWithToOneRelationships(Pageable pageable);

    @Query("select fabricante from Fabricante fabricante left join fetch fabricante.pais")
    List<Fabricante> findAllWithToOneRelationships();

    @Query("select fabricante from Fabricante fabricante left join fetch fabricante.pais where fabricante.id =:id")
    Optional<Fabricante> findOneWithToOneRelationships(@Param("id") Long id);
}
