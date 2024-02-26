package br.alex.es2.vacinacao.domain;

import static br.alex.es2.vacinacao.domain.DoencaTestSamples.*;
import static br.alex.es2.vacinacao.domain.FabricanteTestSamples.*;
import static br.alex.es2.vacinacao.domain.VacinaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.alex.es2.vacinacao.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class VacinaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vacina.class);
        Vacina vacina1 = getVacinaSample1();
        Vacina vacina2 = new Vacina();
        assertThat(vacina1).isNotEqualTo(vacina2);

        vacina2.setId(vacina1.getId());
        assertThat(vacina1).isEqualTo(vacina2);

        vacina2 = getVacinaSample2();
        assertThat(vacina1).isNotEqualTo(vacina2);
    }

    @Test
    void doencaTest() throws Exception {
        Vacina vacina = getVacinaRandomSampleGenerator();
        Doenca doencaBack = getDoencaRandomSampleGenerator();

        vacina.setDoenca(doencaBack);
        assertThat(vacina.getDoenca()).isEqualTo(doencaBack);

        vacina.doenca(null);
        assertThat(vacina.getDoenca()).isNull();
    }

    @Test
    void fabricantesTest() throws Exception {
        Vacina vacina = getVacinaRandomSampleGenerator();
        Fabricante fabricanteBack = getFabricanteRandomSampleGenerator();

        vacina.addFabricantes(fabricanteBack);
        assertThat(vacina.getFabricantes()).containsOnly(fabricanteBack);
        assertThat(fabricanteBack.getVacinas()).containsOnly(vacina);

        vacina.removeFabricantes(fabricanteBack);
        assertThat(vacina.getFabricantes()).doesNotContain(fabricanteBack);
        assertThat(fabricanteBack.getVacinas()).doesNotContain(vacina);

        vacina.fabricantes(new HashSet<>(Set.of(fabricanteBack)));
        assertThat(vacina.getFabricantes()).containsOnly(fabricanteBack);
        assertThat(fabricanteBack.getVacinas()).containsOnly(vacina);

        vacina.setFabricantes(new HashSet<>());
        assertThat(vacina.getFabricantes()).doesNotContain(fabricanteBack);
        assertThat(fabricanteBack.getVacinas()).doesNotContain(vacina);
    }
}
