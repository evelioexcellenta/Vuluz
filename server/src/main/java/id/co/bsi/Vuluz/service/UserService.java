package id.co.bsi.Vuluz.service;

import id.co.bsi.Vuluz.dto.request.LogInRequest;
import id.co.bsi.Vuluz.dto.request.RegisterRequest;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.model.Wallet;
import id.co.bsi.Vuluz.repository.UserRepository;
import id.co.bsi.Vuluz.repository.WalletRepository;
import id.co.bsi.Vuluz.utils.JWTTokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.concurrent.ThreadLocalRandom;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private JWTTokenUtils jwtTokenUtils;

    public User register(RegisterRequest registerRequest) {

        Optional<User> checkUserByEmail = this.userRepository.findByEmail(registerRequest.getEmail());

        if (checkUserByEmail.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User users = new User();
        users.setEmail(registerRequest.getEmail());
        users.setPassword(registerRequest.getPassword());
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
        String token = jwtTokenUtils.generateToken(loginRequest.getEmail());
        Optional<User> findUserByEmailanadPassword = this.userRepository.findByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword());
        if (findUserByEmailanadPassword.isEmpty()) {
            throw new RuntimeException("Email and password do not match");
        }
        return token;
    }

    public String getEmailFromToken(String token) {
        return jwtTokenUtils.extractEmail(token);
    }

    public User getUserByEmail(String email) {
        return userRepository.findFirstByEmail(email);
    }

}
