package id.co.bsi.Vuluz.controller;

import id.co.bsi.Vuluz.dto.request.CreateWalletRequest;
import id.co.bsi.Vuluz.dto.request.TopUpRequest;
import id.co.bsi.Vuluz.dto.request.TransferRequest;
import id.co.bsi.Vuluz.dto.response.CreateWalletResponse;
import id.co.bsi.Vuluz.dto.response.TopUpResponse;
import id.co.bsi.Vuluz.dto.response.TransferResponse;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.model.Wallet;
import id.co.bsi.Vuluz.service.TransactionService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @GetMapping("/api/transactions")
    private ResponseEntity<String> test(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(user.getUserName());
    }

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

    @PostMapping("api/wallets")
    public ResponseEntity<CreateWalletResponse> createWallet(@RequestBody CreateWalletRequest createWalletRequest){
        CreateWalletResponse createWalletResponse = new CreateWalletResponse();
        try {
            Wallet newWallet = this.transactionService.createWallet(createWalletRequest);
            createWalletResponse.setStatus("OK");
            createWalletResponse.setMessage("New wallet is created");
        } catch (Exception e) {
            createWalletResponse.setStatus("FAILED");
            createWalletResponse.setMessage(e.getMessage());
        }
        return ResponseEntity.ok(createWalletResponse);
    }
}
