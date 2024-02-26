package br.alex.es2.vacinacao.repository;

import br.alex.es2.vacinacao.domain.Vacina;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Vacina entity.
 */
@Repository
public interface VacinaRepository extends JpaRepository<Vacina, Long> {
    default Optional<Vacina> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Vacina> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Vacina> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select vacina from Vacina vacina left join fetch vacina.doenca", countQuery = "select count(vacina) from Vacina vacina")
    Page<Vacina> findAllWithToOneRelationships(Pageable pageable);

    @Query("select vacina from Vacina vacina left join fetch vacina.doenca")
    List<Vacina> findAllWithToOneRelationships();

    @Query("select vacina from Vacina vacina left join fetch vacina.doenca where vacina.id =:id")
    Optional<Vacina> findOneWithToOneRelationships(@Param("id") Long id);
}
