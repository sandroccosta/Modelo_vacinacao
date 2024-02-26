package br.alex.es2.vacinacao.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * A VacinacaoPessoa.
 */
@Entity
@Table(name = "vacinacao_pessoa")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VacinacaoPessoa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "quando")
    private LocalDate quando;

    @Column(name = "cns")
    private String cns;

    @Column(name = "codigo_profissinal")
    private String codigoProfissinal;

    @ManyToOne(fetch = FetchType.LAZY)
    private Pessoa pessoa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "doenca", "fabricantes" }, allowSetters = true)
    private Vacina vacina;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "pais", "vacinas" }, allowSetters = true)
    private Fabricante fabricante;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VacinacaoPessoa id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getQuando() {
        return this.quando;
    }

    public VacinacaoPessoa quando(LocalDate quando) {
        this.setQuando(quando);
        return this;
    }

    public void setQuando(LocalDate quando) {
        this.quando = quando;
    }

    public String getCns() {
        return this.cns;
    }

    public VacinacaoPessoa cns(String cns) {
        this.setCns(cns);
        return this;
    }

    public void setCns(String cns) {
        this.cns = cns;
    }

    public String getCodigoProfissinal() {
        return this.codigoProfissinal;
    }

    public VacinacaoPessoa codigoProfissinal(String codigoProfissinal) {
        this.setCodigoProfissinal(codigoProfissinal);
        return this;
    }

    public void setCodigoProfissinal(String codigoProfissinal) {
        this.codigoProfissinal = codigoProfissinal;
    }

    public Pessoa getPessoa() {
        return this.pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public VacinacaoPessoa pessoa(Pessoa pessoa) {
        this.setPessoa(pessoa);
        return this;
    }

    public Vacina getVacina() {
        return this.vacina;
    }

    public void setVacina(Vacina vacina) {
        this.vacina = vacina;
    }

    public VacinacaoPessoa vacina(Vacina vacina) {
        this.setVacina(vacina);
        return this;
    }

    public Fabricante getFabricante() {
        return this.fabricante;
    }

    public void setFabricante(Fabricante fabricante) {
        this.fabricante = fabricante;
    }

    public VacinacaoPessoa fabricante(Fabricante fabricante) {
        this.setFabricante(fabricante);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VacinacaoPessoa)) {
            return false;
        }
        return getId() != null && getId().equals(((VacinacaoPessoa) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VacinacaoPessoa{" +
            "id=" + getId() +
            ", quando='" + getQuando() + "'" +
            ", cns='" + getCns() + "'" +
            ", codigoProfissinal='" + getCodigoProfissinal() + "'" +
            "}";
    }
}
