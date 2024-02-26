package br.alex.es2.vacinacao.repository;

import br.alex.es2.vacinacao.domain.Doenca;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Doenca entity.
 */
@Repository
public interface DoencaRepository extends JpaRepository<Doenca, Long> {
    default Optional<Doenca> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Doenca> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Doenca> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select doenca from Doenca doenca left join fetch doenca.paisPrimeiroCaso",
        countQuery = "select count(doenca) from Doenca doenca"
    )
    Page<Doenca> findAllWithToOneRelationships(Pageable pageable);

    @Query("select doenca from Doenca doenca left join fetch doenca.paisPrimeiroCaso")
    List<Doenca> findAllWithToOneRelationships();

    @Query("select doenca from Doenca doenca left join fetch doenca.paisPrimeiroCaso where doenca.id =:id")
    Optional<Doenca> findOneWithToOneRelationships(@Param("id") Long id);
}
