package com.crime.controller;

import com.crime.entity.CrimeType;
import com.crime.service.CrimeTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crime-types")
public class CrimeTypeController {

    @Autowired
    private CrimeTypeService crimeTypeService;

    @GetMapping
    public List<CrimeType> getAllCrimeTypes(){

        return crimeTypeService.getAllCrimeTypes();

    }

    @PostMapping
    public CrimeType saveCrimeType(@RequestBody CrimeType crimeType){

        return crimeTypeService.saveCrimeType(crimeType);

    }

}