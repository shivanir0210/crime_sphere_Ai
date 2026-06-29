package com.crime.service;

import com.crime.entity.Victim;
import com.crime.repository.VictimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VictimService {

    @Autowired
    private VictimRepository victimRepository;

    public List<Victim> getAllVictims(){

        return victimRepository.findAll();

    }

    public Victim saveVictim(Victim victim){

        return victimRepository.save(victim);

    }

}