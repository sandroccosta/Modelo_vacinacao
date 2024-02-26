package br.alex.es2.vacinacao.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DoencaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Doenca getDoencaSample1() {
        return new Doenca().id(1L).nome("nome1");
    }

    public static Doenca getDoencaSample2() {
        return new Doenca().id(2L).nome("nome2");
    }

    public static Doenca getDoencaRandomSampleGenerator() {
        return new Doenca().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString());
    }
}
