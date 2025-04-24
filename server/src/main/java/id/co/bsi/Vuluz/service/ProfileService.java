package id.co.bsi.Vuluz.service;

import id.co.bsi.Vuluz.dto.response.ProfileResponse;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.model.Wallet;
import id.co.bsi.Vuluz.repository.UserRepository;
import id.co.bsi.Vuluz.repository.WalletRepository;
import id.co.bsi.Vuluz.utils.SecurityUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    @Autowired
    private SecurityUtility securityUtility;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    public ProfileResponse getProfileDetails() {
        Long userId = securityUtility.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow();
        ProfileResponse profileResponse = new ProfileResponse();
        profileResponse.setFullName(user.getFullName());
        profileResponse.setUserName(user.getUserName());
        profileResponse.setEmail(user.getEmail());
        profileResponse.setAvatarUrl(user.getAvatarUrl());
        profileResponse.setGender(user.getGender());

        Wallet wallet = walletRepository.findById(userId).orElseThrow();
        profileResponse.setWalletName(wallet.getWalletName());
        profileResponse.setWalletNumber(wallet.getWalletNumber());
        profileResponse.setWalletBalance(wallet.getBalance());

        return profileResponse;
    }

}
