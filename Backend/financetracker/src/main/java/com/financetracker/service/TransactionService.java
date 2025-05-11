package com.financetracker.service;

import com.financetracker.dto.TransactionRequest;
import com.financetracker.model.Category;
import com.financetracker.model.Transaction;
import com.financetracker.repository.CategoryRepository;
import com.financetracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    public List<Transaction> getAllTransactions() {
        return transactionRepo.findAll();
    }

    public Transaction addTransaction(TransactionRequest request) {
        Transaction txn = new Transaction();
        txn.setTitle(request.getTitle());
        txn.setAmount(request.getAmount());
        txn.setDate(request.getDate());
        txn.setType(request.getType());

        Category category = categoryRepo.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        txn.setCategory(category);

        return transactionRepo.save(txn);
    }

    public void deleteTransaction(Long id) {
        transactionRepo.deleteById(id);
    }
}