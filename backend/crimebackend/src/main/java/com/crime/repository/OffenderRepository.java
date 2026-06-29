package com.crime.repository;

import com.crime.entity.Offender;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OffenderRepository
        extends JpaRepository<Offender,Long> {

}