package id.co.bsi.Vuluz.controller;

import id.co.bsi.Vuluz.dto.TransactionHistoryResponse;
import id.co.bsi.Vuluz.dto.TransactionSummaryResponse;
import id.co.bsi.Vuluz.dto.response.BalanceResponse;
import id.co.bsi.Vuluz.service.DashboardService;
import id.co.bsi.Vuluz.service.TransactionService;
import id.co.bsi.Vuluz.service.UserService;
import id.co.bsi.Vuluz.utils.SecurityUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private SecurityUtility securityUtility;

    @GetMapping("/api/history")
    public ResponseEntity<?> getTransactionHistory(
            @RequestParam(required = false, defaultValue = "") String transactionType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "") String sortOrder
    ) {
        try {
            Long userId = securityUtility.getCurrentUserId();
            List<TransactionHistoryResponse> history = dashboardService.getTransactionHistory(
                    userId, transactionType, fromDate, toDate, search, sortOrder);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token or user not found");
        }
    }

    @GetMapping("/api/balance")
    public ResponseEntity<BalanceResponse> getBalance() {
        BalanceResponse response = dashboardService.getBalance();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/summary")
    public ResponseEntity<?> getTransactionSummary() {
        try {
            TransactionSummaryResponse summary = dashboardService.getTransactionSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token or user not found");
        }
    }

}
