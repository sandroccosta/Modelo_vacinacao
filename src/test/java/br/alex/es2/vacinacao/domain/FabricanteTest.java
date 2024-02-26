package br.alex.es2.vacinacao.domain;

import static br.alex.es2.vacinacao.domain.FabricanteTestSamples.*;
import static br.alex.es2.vacinacao.domain.PaisTestSamples.*;
import static br.alex.es2.vacinacao.domain.VacinaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.alex.es2.vacinacao.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class FabricanteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Fabricante.class);
        Fabricante fabricante1 = getFabricanteSample1();
        Fabricante fabricante2 = new Fabricante();
        assertThat(fabricante1).isNotEqualTo(fabricante2);

        fabricante2.setId(fabricante1.getId());
        assertThat(fabricante1).isEqualTo(fabricante2);

        fabricante2 = getFabricanteSample2();
        assertThat(fabricante1).isNotEqualTo(fabricante2);
    }

    @Test
    void paisTest() throws Exception {
        Fabricante fabricante = getFabricanteRandomSampleGenerator();
        Pais paisBack = getPaisRandomSampleGenerator();

        fabricante.setPais(paisBack);
        assertThat(fabricante.getPais()).isEqualTo(paisBack);

        fabricante.pais(null);
        assertThat(fabricante.getPais()).isNull();
    }

    @Test
    void vacinasTest() throws Exception {
        Fabricante fabricante = getFabricanteRandomSampleGenerator();
        Vacina vacinaBack = getVacinaRandomSampleGenerator();

        fabricante.addVacinas(vacinaBack);
        assertThat(fabricante.getVacinas()).containsOnly(vacinaBack);

        fabricante.removeVacinas(vacinaBack);
        assertThat(fabricante.getVacinas()).doesNotContain(vacinaBack);

        fabricante.vacinas(new HashSet<>(Set.of(vacinaBack)));
        assertThat(fabricante.getVacinas()).containsOnly(vacinaBack);

        fabricante.setVacinas(new HashSet<>());
        assertThat(fabricante.getVacinas()).doesNotContain(vacinaBack);
    }
}
