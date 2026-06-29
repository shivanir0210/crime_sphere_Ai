package com.crime.controller;

import com.crime.entity.FIR;
import com.crime.service.FirService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/firs")
public class FirController {

    @Autowired
    private FirService firService;

    @GetMapping
    public List<FIR> getAllFirs(){

        return firService.getAllFirs();

    }

    @PostMapping
    public FIR saveFir(@RequestBody FIR fir){

        return firService.saveFir(fir);

    }
    @PutMapping("/{id}")
    public FIR updateFir(
            @PathVariable Long id,
            @RequestBody FIR fir){

        return firService.updateFir(
                id,
                fir);

    }
    @DeleteMapping("/{id}")
    public String deleteFir(
            @PathVariable Long id){

        return firService.deleteFir(id);

    }

}