package id.co.bsi.Vuluz.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;

@Component
public class JWTTokenUtils {

    @Value("${jwt.key}")
    private String jwtKey;

    public String generateToken(String username) {
        HashMap<String, Object> additionalInformation = new HashMap<>();
        additionalInformation.put("data1", "abc");

        return Jwts.builder()
                .addClaims(additionalInformation)
                .setSubject(username)
                .setAudience("bsi")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(SignatureAlgorithm.HS256, jwtKey)
                .compact();
    }

}
