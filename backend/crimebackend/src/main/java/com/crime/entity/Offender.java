package com.crime.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "offenders")
public class Offender {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer age;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getCrimeHistory() {
        return crimeHistory;
    }

    public void setCrimeHistory(String crimeHistory) {
        this.crimeHistory = crimeHistory;
    }

    private String gender;

    private String crimeHistory;

}