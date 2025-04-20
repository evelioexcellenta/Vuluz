package id.co.bsi.Vuluz.controller;

import id.co.bsi.Vuluz.dto.request.LogInRequest;
import id.co.bsi.Vuluz.dto.request.RegisterRequest;
import id.co.bsi.Vuluz.dto.response.LogInResponse;
import id.co.bsi.Vuluz.dto.response.RegisterResponse;
import id.co.bsi.Vuluz.dto.response.UserProfileResponse;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.model.Wallet;
import id.co.bsi.Vuluz.service.UserService;
import id.co.bsi.Vuluz.utils.JWTTokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {
    @Autowired
    private UserService usersService;
    private JWTTokenUtils jwtTokenUtils;


    @PostMapping("/api/auth/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) {
        RegisterResponse registerResponse = new RegisterResponse();
        try {
            User register = this.usersService.register(registerRequest);

            registerResponse.setStatus("OK");
            registerResponse.setMessage("Register succeed");

        } catch (Exception e) {

            registerResponse.setStatus("FAILED");
            registerResponse.setMessage(e.getMessage());
        }
        return ResponseEntity.ok(registerResponse);
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<LogInResponse> login(@RequestBody LogInRequest loginRequest) {
        LogInResponse loginResponse = new LogInResponse();
        try {
            String token = this.usersService.login(loginRequest);
            loginResponse.setStatus("OK");
            loginResponse.setMessage("Login succeed");
            loginResponse.setToken(token);
        } catch (Exception e) {
            loginResponse.setStatus("FAILED");
            loginResponse.setMessage(e.getMessage());
        }
        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/api/auth/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = usersService.getEmailFromToken(token);
            User user = usersService.getUserByEmail(email);

            // Ambil wallet pertama
            Long walletNumber = null;
            BigDecimal balance = null;
            String walletName = null;
            if (user.getWallets() != null && !user.getWallets().isEmpty()) {
                Wallet defaultWallet = user.getWallets().get(0);
                walletNumber = defaultWallet.getWalletNumber();
                balance = defaultWallet.getBalance();
                walletName = defaultWallet.getWalletName();
            }

            UserProfileResponse response = new UserProfileResponse(
                    "OK",
                    "User profile fetched",
                    user.getId(),
                    user.getEmail(),
                    user.getUserName(),
                    user.getFullName(),
                    user.getGender(),
                    user.getAvatarUrl(),
                    walletNumber,
                    balance,
                    walletName
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                    new UserProfileResponse("FAILED", "Invalid token",
                            null, null, null, null, null, null,
                            null, null, null)
            );
        }
    }


}
