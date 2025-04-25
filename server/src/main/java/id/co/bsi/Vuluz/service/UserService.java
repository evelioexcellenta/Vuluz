package id.co.bsi.Vuluz.service;

import id.co.bsi.Vuluz.dto.request.LogInRequest;
import id.co.bsi.Vuluz.dto.request.RegisterRequest;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.model.Wallet;
import id.co.bsi.Vuluz.repository.UserRepository;
import id.co.bsi.Vuluz.repository.WalletRepository;
import id.co.bsi.Vuluz.utils.JwtUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.security.authentication.AuthenticationManager;


import java.math.BigDecimal;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private JwtUtility jwtUtility;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(RegisterRequest registerRequest) {

        if (registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (registerRequest.getUserName() == null || registerRequest.getUserName().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }

        if (registerRequest.getFullName() == null || registerRequest.getFullName().trim().isEmpty()) {
            throw new RuntimeException("Full name is required");
        }

        if (registerRequest.getPassword() == null || registerRequest.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        if (registerRequest.getPassword().length() < 8 ||
                !registerRequest.getPassword().matches(".*[A-Z].*") ||
                !registerRequest.getPassword().matches(".*[a-z].*") ||
                !registerRequest.getPassword().matches(".*[0-9].*"))
        {
            throw new RuntimeException("Password must be at least 8 characters and contain uppercase, lowercase, and number");
        }

        if (registerRequest.getGender() == null || registerRequest.getGender().trim().isEmpty()) {
            throw new RuntimeException("Gender is required");
        }

        Optional<User> checkUserByEmail = this.userRepository.findByEmail(registerRequest.getEmail());

        if (checkUserByEmail.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (!(registerRequest.getEmail().matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"))) {
            throw new RuntimeException("Invalid email format");
        }

        if (registerRequest.getPin() == null){
            throw new RuntimeException("Create your pin");
        }

        if (!registerRequest.getPin().matches("\\d{6}")) {
            throw new RuntimeException("PIN must be 6 numeric digits");
        }

        User users = new User();
        users.setEmail(registerRequest.getEmail());
        users.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        users.setUserName(registerRequest.getUserName());
        users.setFullName(registerRequest.getFullName());
        users.setGender(registerRequest.getGender());
        users.setPin(passwordEncoder.encode(registerRequest.getPin()));

        Wallet wallet = new Wallet();
        wallet.setUser(users);

        Long randomWalletNumber;
        do {
            randomWalletNumber = ThreadLocalRandom.current().nextLong(100000, 1000000);
        } while (walletRepository.findByWalletNumber(randomWalletNumber).isPresent());

        wallet.setWalletNumber(randomWalletNumber);
        wallet.setBalance(BigDecimal.ZERO);
        wallet.setWalletName("Main Pocket");
        wallet.setCreatedAt(new Date());
        wallet.setUpdatedAt(new Date());

        users.setWallet(wallet);

        return this.userRepository.save(users);
    }


    public String login(LogInRequest loginRequest) {
        try {
            // Check if user exists before authentication
            User user = this.userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email " + loginRequest.getEmail()));

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            UserDetails userDetails = this.userDetailsService.loadUserByUsername(loginRequest.getEmail());
            return jwtUtility.generateToken(userDetails, user.getId());
        } catch (UsernameNotFoundException e) {
            throw e;
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid credentials");
        }
    }

}
