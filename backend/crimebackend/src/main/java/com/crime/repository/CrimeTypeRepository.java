package com.crime.repository;

import com.crime.entity.CrimeType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrimeTypeRepository
        extends JpaRepository<CrimeType,Long> {

}