package br.alex.es2.vacinacao.repository;

import br.alex.es2.vacinacao.domain.Fabricante;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface FabricanteRepositoryWithBagRelationships {
    Optional<Fabricante> fetchBagRelationships(Optional<Fabricante> fabricante);

    List<Fabricante> fetchBagRelationships(List<Fabricante> fabricantes);

    Page<Fabricante> fetchBagRelationships(Page<Fabricante> fabricantes);
}
