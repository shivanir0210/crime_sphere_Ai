package com.crime.service;

import com.crime.entity.FIR;
import com.crime.repository.FirRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FirService {

    @Autowired
    private FirRepository firRepository;

    public List<FIR> getAllFirs(){

        return firRepository.findAll();

    }

    public FIR saveFir(FIR fir){

        return firRepository.save(fir);

    }
    public FIR updateFir(Long id, FIR fir){

        FIR existingFir =
                firRepository.findById(id)
                        .orElse(null);

        if(existingFir == null){

            return null;

        }

        existingFir.setTitle(fir.getTitle());

        existingFir.setDescription(
                fir.getDescription());

        existingFir.setStatus(
                fir.getStatus());

        return firRepository.save(existingFir);

    }
    public String deleteFir(Long id){

        firRepository.deleteById(id);

        return "Deleted Successfully";

    }

}