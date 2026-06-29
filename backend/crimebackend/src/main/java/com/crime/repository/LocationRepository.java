package com.crime.repository;

import com.crime.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository
        extends JpaRepository<Location,Long> {

}