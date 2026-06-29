package com.crime.controller;

import com.crime.entity.Offender;
import com.crime.service.OffenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offenders")
public class OffenderController {

    @Autowired
    private OffenderService offenderService;

    @GetMapping
    public List<Offender> getAllOffenders(){

        return offenderService.getAllOffenders();

    }

    @PostMapping
    public Offender saveOffender(@RequestBody Offender offender){

        return offenderService.saveOffender(offender);

    }

}