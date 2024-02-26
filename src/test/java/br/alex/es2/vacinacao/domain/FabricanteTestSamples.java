package br.alex.es2.vacinacao.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class FabricanteTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Fabricante getFabricanteSample1() {
        return new Fabricante().id(1L).nome("nome1");
    }

    public static Fabricante getFabricanteSample2() {
        return new Fabricante().id(2L).nome("nome2");
    }

    public static Fabricante getFabricanteRandomSampleGenerator() {
        return new Fabricante().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString());
    }
}
