package br.alex.es2.vacinacao.domain;

import static br.alex.es2.vacinacao.domain.PaisTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.alex.es2.vacinacao.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PaisTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pais.class);
        Pais pais1 = getPaisSample1();
        Pais pais2 = new Pais();
        assertThat(pais1).isNotEqualTo(pais2);

        pais2.setId(pais1.getId());
        assertThat(pais1).isEqualTo(pais2);

        pais2 = getPaisSample2();
        assertThat(pais1).isNotEqualTo(pais2);
    }
}
