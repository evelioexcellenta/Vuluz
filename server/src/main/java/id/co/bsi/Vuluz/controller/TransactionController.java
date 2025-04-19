package id.co.bsi.Vuluz.controller;

import id.co.bsi.Vuluz.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TransactionController {
    @Autowired
    private TransactionService transactionService;
}
