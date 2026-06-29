package com.crime.repository;

import com.crime.entity.Victim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VictimRepository
        extends JpaRepository<Victim,Long> {

}