package br.alex.es2.vacinacao.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PessoaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Pessoa getPessoaSample1() {
        return new Pessoa().id(1L).nome("nome1");
    }

    public static Pessoa getPessoaSample2() {
        return new Pessoa().id(2L).nome("nome2");
    }

    public static Pessoa getPessoaRandomSampleGenerator() {
        return new Pessoa().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString());
    }
}
