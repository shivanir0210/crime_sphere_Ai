package com.crime.service;

import com.crime.entity.Offender;
import com.crime.repository.OffenderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OffenderService {

    @Autowired
    private OffenderRepository offenderRepository;

    public List<Offender> getAllOffenders(){

        return offenderRepository.findAll();

    }

    public Offender saveOffender(Offender offender){

        return offenderRepository.save(offender);

    }

}