package br.alex.es2.vacinacao.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PaisTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Pais getPaisSample1() {
        return new Pais().id(1L).nome("nome1").sigla("sigla1");
    }

    public static Pais getPaisSample2() {
        return new Pais().id(2L).nome("nome2").sigla("sigla2");
    }

    public static Pais getPaisRandomSampleGenerator() {
        return new Pais().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString()).sigla(UUID.randomUUID().toString());
    }
}
