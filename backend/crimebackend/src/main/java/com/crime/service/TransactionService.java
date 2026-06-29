package com.crime.service;

import com.crime.entity.Transaction;
import com.crime.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    public List<Transaction> getAllTransactions(){

        return transactionRepository.findAll();

    }

    public Transaction saveTransaction(Transaction transaction){

        return transactionRepository.save(transaction);

    }

}