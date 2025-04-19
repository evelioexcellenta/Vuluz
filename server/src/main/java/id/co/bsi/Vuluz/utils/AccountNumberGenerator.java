package id.co.bsi.Vuluz.utils;

import org.springframework.stereotype.Component;

@Component
public class AccountNumberGenerator {
    public String generate() {
        long number = (long) (Math.random() * 1_000_000_0000L);
        return String.format("%010d", number);
    }
}

