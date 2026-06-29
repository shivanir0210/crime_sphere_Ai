package com.crime.service;

import com.crime.entity.Location;
import com.crime.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public List<Location> getAllLocations(){

        return locationRepository.findAll();

    }

    public Location saveLocation(Location location){

        return locationRepository.save(location);

    }

}