package br.alex.es2.vacinacao.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Vacina.
 */
@Entity
@Table(name = "vacina")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Vacina implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "criado")
    private ZonedDateTime criado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "paisPrimeiroCaso" }, allowSetters = true)
    private Doenca doenca;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "vacinas")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pais", "vacinas" }, allowSetters = true)
    private Set<Fabricante> fabricantes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Vacina id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Vacina nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public ZonedDateTime getCriado() {
        return this.criado;
    }

    public Vacina criado(ZonedDateTime criado) {
        this.setCriado(criado);
        return this;
    }

    public void setCriado(ZonedDateTime criado) {
        this.criado = criado;
    }

    public Doenca getDoenca() {
        return this.doenca;
    }

    public void setDoenca(Doenca doenca) {
        this.doenca = doenca;
    }

    public Vacina doenca(Doenca doenca) {
        this.setDoenca(doenca);
        return this;
    }

    public Set<Fabricante> getFabricantes() {
        return this.fabricantes;
    }

    public void setFabricantes(Set<Fabricante> fabricantes) {
        if (this.fabricantes != null) {
            this.fabricantes.forEach(i -> i.removeVacinas(this));
        }
        if (fabricantes != null) {
            fabricantes.forEach(i -> i.addVacinas(this));
        }
        this.fabricantes = fabricantes;
    }

    public Vacina fabricantes(Set<Fabricante> fabricantes) {
        this.setFabricantes(fabricantes);
        return this;
    }

    public Vacina addFabricantes(Fabricante fabricante) {
        this.fabricantes.add(fabricante);
        fabricante.getVacinas().add(this);
        return this;
    }

    public Vacina removeFabricantes(Fabricante fabricante) {
        this.fabricantes.remove(fabricante);
        fabricante.getVacinas().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vacina)) {
            return false;
        }
        return getId() != null && getId().equals(((Vacina) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vacina{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", criado='" + getCriado() + "'" +
            "}";
    }
}
