package id.co.bsi.Vuluz.controller;

import id.co.bsi.Vuluz.dto.request.LogInRequest;
import id.co.bsi.Vuluz.dto.request.RegisterRequest;
import id.co.bsi.Vuluz.dto.response.LogInResponse;
import id.co.bsi.Vuluz.dto.response.RegisterResponse;
import id.co.bsi.Vuluz.dto.response.UserProfileResponse;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.model.Wallet;
import id.co.bsi.Vuluz.service.UserService;
import id.co.bsi.Vuluz.utils.JwtUtility;
import id.co.bsi.Vuluz.utils.SecurityUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {
    @Autowired
    private UserService usersService;
    private JwtUtility jwtUtility;
    private UserDetailsService userDetailsService;


    @PostMapping("/api/auth/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) {
        RegisterResponse registerResponse = new RegisterResponse();
        try {
            User register = this.usersService.register(registerRequest);

            registerResponse.setStatus("OK");
            registerResponse.setMessage("Register succeed");
            return ResponseEntity.ok(registerResponse);
        } catch (Exception e) {

            registerResponse.setStatus("FAILED");
            registerResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(registerResponse);
        }

    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<LogInResponse> login(@RequestBody LogInRequest loginRequest) {
        LogInResponse loginResponse = new LogInResponse();
        try {
            String token = this.usersService.login(loginRequest);
            loginResponse.setStatus("OK");
            loginResponse.setMessage("Login succeed");
            loginResponse.setToken(token);
            return ResponseEntity.ok(loginResponse);
        } catch (UsernameNotFoundException e) {
            loginResponse.setStatus("FAILED");
            loginResponse.setMessage("Email not found");
            return ResponseEntity.badRequest().body(loginResponse);
        } catch (Exception e) {
            loginResponse.setStatus("FAILED");
            loginResponse.setMessage("Password incorrect");
            return ResponseEntity.badRequest().body(loginResponse);
        }
    }

}