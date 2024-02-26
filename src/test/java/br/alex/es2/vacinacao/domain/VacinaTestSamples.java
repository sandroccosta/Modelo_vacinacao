package br.alex.es2.vacinacao.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class VacinaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Vacina getVacinaSample1() {
        return new Vacina().id(1L).nome("nome1");
    }

    public static Vacina getVacinaSample2() {
        return new Vacina().id(2L).nome("nome2");
    }

    public static Vacina getVacinaRandomSampleGenerator() {
        return new Vacina().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString());
    }
}
