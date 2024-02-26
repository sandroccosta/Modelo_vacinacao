package br.alex.es2.vacinacao.repository;

import br.alex.es2.vacinacao.domain.VacinacaoPessoa;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the VacinacaoPessoa entity.
 */
@Repository
public interface VacinacaoPessoaRepository extends JpaRepository<VacinacaoPessoa, Long> {
    default Optional<VacinacaoPessoa> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<VacinacaoPessoa> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<VacinacaoPessoa> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select vacinacaoPessoa from VacinacaoPessoa vacinacaoPessoa left join fetch vacinacaoPessoa.pessoa left join fetch vacinacaoPessoa.vacina left join fetch vacinacaoPessoa.fabricante",
        countQuery = "select count(vacinacaoPessoa) from VacinacaoPessoa vacinacaoPessoa"
    )
    Page<VacinacaoPessoa> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select vacinacaoPessoa from VacinacaoPessoa vacinacaoPessoa left join fetch vacinacaoPessoa.pessoa left join fetch vacinacaoPessoa.vacina left join fetch vacinacaoPessoa.fabricante"
    )
    List<VacinacaoPessoa> findAllWithToOneRelationships();

    @Query(
        "select vacinacaoPessoa from VacinacaoPessoa vacinacaoPessoa left join fetch vacinacaoPessoa.pessoa left join fetch vacinacaoPessoa.vacina left join fetch vacinacaoPessoa.fabricante where vacinacaoPessoa.id =:id"
    )
    Optional<VacinacaoPessoa> findOneWithToOneRelationships(@Param("id") Long id);
}
