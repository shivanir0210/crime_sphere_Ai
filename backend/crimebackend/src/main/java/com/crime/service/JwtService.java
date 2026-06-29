package com.crime.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final String SECRET =
            "mysecretkeymysecretkeymysecretkey123456";

    public String generateToken(String email){

        return Jwts.builder()

                .subject(email)

                .issuedAt(new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 86400000))

                .signWith(
                        SignatureAlgorithm.HS256,
                        SECRET.getBytes())

                .compact();

    }
    public String extractEmail(String token){

        return Jwts.parser()

                .setSigningKey(
                        SECRET.getBytes())

                .build()

                .parseClaimsJws(token)

                .getBody()

                .getSubject();

    }
    public boolean validateToken(String token){

        try{

            extractEmail(token);

            return true;

        }

        catch(Exception e){

            return false;

        }

    }

}