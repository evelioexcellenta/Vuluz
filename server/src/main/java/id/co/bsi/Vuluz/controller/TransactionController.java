package id.co.bsi.Vuluz.controller;

import id.co.bsi.Vuluz.dto.TransactionHistoryResponse;
import id.co.bsi.Vuluz.dto.request.*;
import id.co.bsi.Vuluz.dto.response.*;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.model.Wallet;
import id.co.bsi.Vuluz.service.TransactionService;
import id.co.bsi.Vuluz.service.UserService;
import id.co.bsi.Vuluz.utils.SecurityUtility;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    @Autowired
    private SecurityUtility securityUtility;

    @PostMapping("/api/transfer")
    public ResponseEntity<TransferResponse> transfer(@RequestBody TransferRequest transferRequest) {
        try {
            TransferResponse response = transactionService.transfer(transferRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            TransferResponse response = new TransferResponse();
            response.setStatus("Error");
            response.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("api/topup")
    public ResponseEntity<TopUpResponse> topup(@RequestBody TopUpRequest topUpRequest){
        try {
            TopUpResponse topUpResponse = transactionService.topup(topUpRequest);
            return ResponseEntity.ok(topUpResponse);
        } catch (RuntimeException e){
            TopUpResponse topUpResponse = new TopUpResponse();
            topUpResponse.setStatus("Error");
            topUpResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(topUpResponse);
        }
    }

//    @PostMapping("api/wallets")
//    public ResponseEntity<CreateWalletResponse> createWallet(@RequestBody CreateWalletRequest createWalletRequest){
//        CreateWalletResponse createWalletResponse = new CreateWalletResponse();
//        try {
//            Wallet newWallet = this.transactionService.createWallet(createWalletRequest);
//            createWalletResponse.setStatus("OK");
//            createWalletResponse.setMessage("New wallet is created");
//        } catch (Exception e) {
//            createWalletResponse.setStatus("FAILED");
//            createWalletResponse.setMessage(e.getMessage());
//        }
//        return ResponseEntity.ok(createWalletResponse);
//    }

    @PostMapping("api/favorite")
    public ResponseEntity<AddFavoriteResponse> addFavorite(@RequestBody AddFavoriteRequest addFavoriteRequest){
        try {
            AddFavoriteResponse addFavoriteResponse = transactionService.addFavoriteResponse(addFavoriteRequest);
            return ResponseEntity.ok(addFavoriteResponse);
        } catch (RuntimeException e){
            AddFavoriteResponse addFavoriteResponse = new AddFavoriteResponse();
            addFavoriteResponse.setStatus("Error");
            addFavoriteResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(addFavoriteResponse);
        }
    }

//    @DeleteMapping("/favorite/{walletNumber}")
//    public ResponseEntity<DeleteFavoriteResponse> deleteFavorite(@PathVariable Long walletNumber){
//        try {
//            DeleteFavoriteResponse deleteFavoriteResponse = transactionService.deleteFavorite(walletNumber);
//            return ResponseEntity.ok(deleteFavoriteResponse);
//        } catch (RuntimeException e){
//            DeleteFavoriteResponse deleteFavoriteResponse = new DeleteFavoriteResponse();
//            deleteFavoriteResponse.setStatus("Error");
//            deleteFavoriteResponse.setMessage(e.getMessage());
//            return ResponseEntity.badRequest().body(deleteFavoriteResponse);
//        }
//    }

    @GetMapping("api/summary")
    public ResponseEntity<?> getMonthlySummary(
            @RequestParam int month,
            @RequestParam int year) {

        Map<String, BigDecimal> summary = transactionService.getMonthlySummary(month, year);

        Map<String, Object> response = new HashMap<>();
        response.put("month", month);
        response.put("year", year);
        response.put("summary", summary);

        return ResponseEntity.ok(response);
    }

//    @GetMapping("/api/transaction/history")
//    public ResponseEntity<?> getTransactionHistory() {
//        try {
//            Long userId = securityUtility.getCurrentUserId();
//
//            List<TransactionHistoryResponse> history = transactionService.getTransactionHistory(userId);
//            return ResponseEntity.ok(history);
//
//        } catch (Exception e) {
//            return ResponseEntity.status(401).body("Invalid token or user not found");
//        }
//    }

    @GetMapping("/api/transaction/history")
    public ResponseEntity<?> getTransactionHistory(
            @RequestParam(required = false, defaultValue = "") String transactionType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false, defaultValue = "") String search
    ) {
        try {
            Long userId = securityUtility.getCurrentUserId();
            List<TransactionHistoryResponse> history = transactionService.getTransactionHistory(
                    userId, transactionType, fromDate, toDate, search);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token or user not found");
        }
    }






}
