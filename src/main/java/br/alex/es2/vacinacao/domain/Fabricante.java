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
 * A Fabricante.
 */
@Entity
@Table(name = "fabricante")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Fabricante implements Serializable {

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
    private Pais pais;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_fabricante__vacinas",
        joinColumns = @JoinColumn(name = "fabricante_id"),
        inverseJoinColumns = @JoinColumn(name = "vacinas_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "doenca", "fabricantes" }, allowSetters = true)
    private Set<Vacina> vacinas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Fabricante id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Fabricante nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public ZonedDateTime getCriado() {
        return this.criado;
    }

    public Fabricante criado(ZonedDateTime criado) {
        this.setCriado(criado);
        return this;
    }

    public void setCriado(ZonedDateTime criado) {
        this.criado = criado;
    }

    public Pais getPais() {
        return this.pais;
    }

    public void setPais(Pais pais) {
        this.pais = pais;
    }

    public Fabricante pais(Pais pais) {
        this.setPais(pais);
        return this;
    }

    public Set<Vacina> getVacinas() {
        return this.vacinas;
    }

    public void setVacinas(Set<Vacina> vacinas) {
        this.vacinas = vacinas;
    }

    public Fabricante vacinas(Set<Vacina> vacinas) {
        this.setVacinas(vacinas);
        return this;
    }

    public Fabricante addVacinas(Vacina vacina) {
        this.vacinas.add(vacina);
        return this;
    }

    public Fabricante removeVacinas(Vacina vacina) {
        this.vacinas.remove(vacina);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Fabricante)) {
            return false;
        }
        return getId() != null && getId().equals(((Fabricante) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Fabricante{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", criado='" + getCriado() + "'" +
            "}";
    }
}
