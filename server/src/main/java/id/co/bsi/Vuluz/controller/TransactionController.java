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
@CrossOrigin(origins = "http://localhost:5173") // <--- tambahkan ini
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

    @DeleteMapping("api/favorite/delete")
    public ResponseEntity<?> deleteFavorite(@RequestParam(required = true) Long walletNumber){
        try {
            DeleteFavoriteResponse deleteFavoriteResponse = transactionService.deleteFavorite(walletNumber);
            return ResponseEntity.ok(deleteFavoriteResponse);
        } catch (RuntimeException e){
            DeleteFavoriteResponse deleteFavoriteResponse = new DeleteFavoriteResponse();
            deleteFavoriteResponse.setStatus("Error");
            deleteFavoriteResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(deleteFavoriteResponse);
        }
    }

    @GetMapping("api/getfavorites")
    public ResponseEntity<?> getFavorites() {
        try {
            List<GetFavoriteResponse> favorites = transactionService.getFavorites();

            Map<String, Object> response = new HashMap<>();
            response.put("status", "Success");
            response.put("message", "Favorites retrieved successfully");
            response.put("data", favorites);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "Error");
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/api/wallet/owner/{walletNumber}")
    public ResponseEntity<?> getOwnerByWalletNumber(@PathVariable Long walletNumber) {
        Wallet wallet = walletRepository.findByWalletNumber(walletNumber)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        User user = wallet.getUser();

        Map<String, String> response = new HashMap<>();
        response.put("fullName", user.getFullName());
        return ResponseEntity.ok(response);
    }

}
