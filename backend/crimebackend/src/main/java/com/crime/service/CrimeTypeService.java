package com.crime.service;

import com.crime.entity.CrimeType;
import com.crime.repository.CrimeTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CrimeTypeService {

    @Autowired
    private CrimeTypeRepository crimeTypeRepository;
    public List<CrimeType> getAllCrimeTypes(){

        return crimeTypeRepository.findAll();

    }

    public CrimeType saveCrimeType(CrimeType crimeType){

        return crimeTypeRepository.save(crimeType);

    }

}