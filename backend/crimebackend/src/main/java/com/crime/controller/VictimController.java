package com.crime.controller;

import com.crime.entity.Victim;
import com.crime.service.VictimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/victims")
public class VictimController {

    @Autowired
    private VictimService victimService;

    @GetMapping
    public List<Victim> getAllVictims(){

        return victimService.getAllVictims();

    }

    @PostMapping
    public Victim saveVictim(@RequestBody Victim victim){

        return victimService.saveVictim(victim);

    }

}