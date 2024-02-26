package br.alex.es2.vacinacao.repository;

import br.alex.es2.vacinacao.domain.Fabricante;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class FabricanteRepositoryWithBagRelationshipsImpl implements FabricanteRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Fabricante> fetchBagRelationships(Optional<Fabricante> fabricante) {
        return fabricante.map(this::fetchVacinas);
    }

    @Override
    public Page<Fabricante> fetchBagRelationships(Page<Fabricante> fabricantes) {
        return new PageImpl<>(fetchBagRelationships(fabricantes.getContent()), fabricantes.getPageable(), fabricantes.getTotalElements());
    }

    @Override
    public List<Fabricante> fetchBagRelationships(List<Fabricante> fabricantes) {
        return Optional.of(fabricantes).map(this::fetchVacinas).orElse(Collections.emptyList());
    }

    Fabricante fetchVacinas(Fabricante result) {
        return entityManager
            .createQuery(
                "select fabricante from Fabricante fabricante left join fetch fabricante.vacinas where fabricante.id = :id",
                Fabricante.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Fabricante> fetchVacinas(List<Fabricante> fabricantes) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, fabricantes.size()).forEach(index -> order.put(fabricantes.get(index).getId(), index));
        List<Fabricante> result = entityManager
            .createQuery(
                "select fabricante from Fabricante fabricante left join fetch fabricante.vacinas where fabricante in :fabricantes",
                Fabricante.class
            )
            .setParameter("fabricantes", fabricantes)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
