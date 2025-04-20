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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
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

        Optional<User> checkUserByEmail = this.userRepository.findByEmail(registerRequest.getEmail());

        if (checkUserByEmail.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User users = new User();
        users.setEmail(registerRequest.getEmail());
        users.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        users.setUserName(registerRequest.getUserName());
        users.setFullName(registerRequest.getFullName());
        users.setGender(registerRequest.getGender());

        List<Wallet> listWallets = new ArrayList<>();

        Wallet wallets = new Wallet();
        wallets.setUser(users);
        long randomWalletNumber = ThreadLocalRandom.current().nextLong(100000, 1000000); // 6 digit
        wallets.setWalletNumber(randomWalletNumber);
        wallets.setBalance(BigDecimal.valueOf(0));
        wallets.setWalletName("Main Pocket");
        wallets.setCreatedAt(new Date());
        wallets.setUpdatedAt(new Date());

        listWallets.add(wallets);

        users.setWallets(listWallets);

        return this.userRepository.save(users);
    }

    public String login(LogInRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        UserDetails userDetails = this.userDetailsService.loadUserByUsername(loginRequest.getEmail());
        User user = this.userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email " + loginRequest.getEmail()));

        return jwtUtility.generateToken(userDetails, user.getId());
    }

    public Long getId (String token) {
        return jwtUtility.extractUserId(token);
    }


}
