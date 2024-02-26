package br.alex.es2.vacinacao.domain;

import static br.alex.es2.vacinacao.domain.DoencaTestSamples.*;
import static br.alex.es2.vacinacao.domain.PaisTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.alex.es2.vacinacao.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DoencaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Doenca.class);
        Doenca doenca1 = getDoencaSample1();
        Doenca doenca2 = new Doenca();
        assertThat(doenca1).isNotEqualTo(doenca2);

        doenca2.setId(doenca1.getId());
        assertThat(doenca1).isEqualTo(doenca2);

        doenca2 = getDoencaSample2();
        assertThat(doenca1).isNotEqualTo(doenca2);
    }

    @Test
    void paisPrimeiroCasoTest() throws Exception {
        Doenca doenca = getDoencaRandomSampleGenerator();
        Pais paisBack = getPaisRandomSampleGenerator();

        doenca.setPaisPrimeiroCaso(paisBack);
        assertThat(doenca.getPaisPrimeiroCaso()).isEqualTo(paisBack);

        doenca.paisPrimeiroCaso(null);
        assertThat(doenca.getPaisPrimeiroCaso()).isNull();
    }
}
