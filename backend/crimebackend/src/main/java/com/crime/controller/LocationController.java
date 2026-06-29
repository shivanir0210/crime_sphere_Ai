package com.crime.controller;

import com.crime.entity.Location;
import com.crime.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping
    public List<Location> getAllLocations(){

        return locationService.getAllLocations();

    }

    @PostMapping
    public Location saveLocation(@RequestBody Location location){

        return locationService.saveLocation(location);

    }

}