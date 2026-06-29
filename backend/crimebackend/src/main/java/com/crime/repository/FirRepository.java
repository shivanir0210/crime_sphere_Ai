package com.crime.repository;

import com.crime.entity.FIR;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FirRepository
        extends JpaRepository<FIR,Long> {

}