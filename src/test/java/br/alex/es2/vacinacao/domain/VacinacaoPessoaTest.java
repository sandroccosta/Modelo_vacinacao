package br.alex.es2.vacinacao.domain;

import static br.alex.es2.vacinacao.domain.FabricanteTestSamples.*;
import static br.alex.es2.vacinacao.domain.PessoaTestSamples.*;
import static br.alex.es2.vacinacao.domain.VacinaTestSamples.*;
import static br.alex.es2.vacinacao.domain.VacinacaoPessoaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.alex.es2.vacinacao.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VacinacaoPessoaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VacinacaoPessoa.class);
        VacinacaoPessoa vacinacaoPessoa1 = getVacinacaoPessoaSample1();
        VacinacaoPessoa vacinacaoPessoa2 = new VacinacaoPessoa();
        assertThat(vacinacaoPessoa1).isNotEqualTo(vacinacaoPessoa2);

        vacinacaoPessoa2.setId(vacinacaoPessoa1.getId());
        assertThat(vacinacaoPessoa1).isEqualTo(vacinacaoPessoa2);

        vacinacaoPessoa2 = getVacinacaoPessoaSample2();
        assertThat(vacinacaoPessoa1).isNotEqualTo(vacinacaoPessoa2);
    }

    @Test
    void pessoaTest() throws Exception {
        VacinacaoPessoa vacinacaoPessoa = getVacinacaoPessoaRandomSampleGenerator();
        Pessoa pessoaBack = getPessoaRandomSampleGenerator();

        vacinacaoPessoa.setPessoa(pessoaBack);
        assertThat(vacinacaoPessoa.getPessoa()).isEqualTo(pessoaBack);

        vacinacaoPessoa.pessoa(null);
        assertThat(vacinacaoPessoa.getPessoa()).isNull();
    }

    @Test
    void vacinaTest() throws Exception {
        VacinacaoPessoa vacinacaoPessoa = getVacinacaoPessoaRandomSampleGenerator();
        Vacina vacinaBack = getVacinaRandomSampleGenerator();

        vacinacaoPessoa.setVacina(vacinaBack);
        assertThat(vacinacaoPessoa.getVacina()).isEqualTo(vacinaBack);

        vacinacaoPessoa.vacina(null);
        assertThat(vacinacaoPessoa.getVacina()).isNull();
    }

    @Test
    void fabricanteTest() throws Exception {
        VacinacaoPessoa vacinacaoPessoa = getVacinacaoPessoaRandomSampleGenerator();
        Fabricante fabricanteBack = getFabricanteRandomSampleGenerator();

        vacinacaoPessoa.setFabricante(fabricanteBack);
        assertThat(vacinacaoPessoa.getFabricante()).isEqualTo(fabricanteBack);

        vacinacaoPessoa.fabricante(null);
        assertThat(vacinacaoPessoa.getFabricante()).isNull();
    }
}
