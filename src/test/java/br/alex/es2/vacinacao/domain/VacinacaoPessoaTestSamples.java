package br.alex.es2.vacinacao.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class VacinacaoPessoaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static VacinacaoPessoa getVacinacaoPessoaSample1() {
        return new VacinacaoPessoa().id(1L).cns("cns1").codigoProfissinal("codigoProfissinal1");
    }

    public static VacinacaoPessoa getVacinacaoPessoaSample2() {
        return new VacinacaoPessoa().id(2L).cns("cns2").codigoProfissinal("codigoProfissinal2");
    }

    public static VacinacaoPessoa getVacinacaoPessoaRandomSampleGenerator() {
        return new VacinacaoPessoa()
            .id(longCount.incrementAndGet())
            .cns(UUID.randomUUID().toString())
            .codigoProfissinal(UUID.randomUUID().toString());
    }
}
