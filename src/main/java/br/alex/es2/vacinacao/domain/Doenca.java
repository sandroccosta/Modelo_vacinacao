package br.alex.es2.vacinacao.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Doenca.
 */
@Entity
@Table(name = "doenca")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Doenca implements Serializable {

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

    @Column(name = "data_primeiro_caso")
    private LocalDate dataPrimeiroCaso;

    @Column(name = "local_primeiro_caso")
    private LocalDate localPrimeiroCaso;

    @ManyToOne(fetch = FetchType.LAZY)
    private Pais paisPrimeiroCaso;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Doenca id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Doenca nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public ZonedDateTime getCriado() {
        return this.criado;
    }

    public Doenca criado(ZonedDateTime criado) {
        this.setCriado(criado);
        return this;
    }

    public void setCriado(ZonedDateTime criado) {
        this.criado = criado;
    }

    public LocalDate getDataPrimeiroCaso() {
        return this.dataPrimeiroCaso;
    }

    public Doenca dataPrimeiroCaso(LocalDate dataPrimeiroCaso) {
        this.setDataPrimeiroCaso(dataPrimeiroCaso);
        return this;
    }

    public void setDataPrimeiroCaso(LocalDate dataPrimeiroCaso) {
        this.dataPrimeiroCaso = dataPrimeiroCaso;
    }

    public LocalDate getLocalPrimeiroCaso() {
        return this.localPrimeiroCaso;
    }

    public Doenca localPrimeiroCaso(LocalDate localPrimeiroCaso) {
        this.setLocalPrimeiroCaso(localPrimeiroCaso);
        return this;
    }

    public void setLocalPrimeiroCaso(LocalDate localPrimeiroCaso) {
        this.localPrimeiroCaso = localPrimeiroCaso;
    }

    public Pais getPaisPrimeiroCaso() {
        return this.paisPrimeiroCaso;
    }

    public void setPaisPrimeiroCaso(Pais pais) {
        this.paisPrimeiroCaso = pais;
    }

    public Doenca paisPrimeiroCaso(Pais pais) {
        this.setPaisPrimeiroCaso(pais);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Doenca)) {
            return false;
        }
        return getId() != null && getId().equals(((Doenca) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Doenca{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", criado='" + getCriado() + "'" +
            ", dataPrimeiroCaso='" + getDataPrimeiroCaso() + "'" +
            ", localPrimeiroCaso='" + getLocalPrimeiroCaso() + "'" +
            "}";
    }
}
