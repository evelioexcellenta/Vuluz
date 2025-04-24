package id.co.bsi.Vuluz.controller;

import id.co.bsi.Vuluz.dto.TransactionSummaryResponse;
import id.co.bsi.Vuluz.dto.response.ProfileResponse;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.repository.UserRepository;
import id.co.bsi.Vuluz.service.ProfileService;
import id.co.bsi.Vuluz.utils.JwtUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class ProfileController {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private ProfileService profileService;

    @GetMapping("api/profile")
    public ResponseEntity<?> getProfile() {
        try{
            ProfileResponse profileResponse = profileService.getProfileDetails();
            return ResponseEntity.ok(profileResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Invalid token or user not found");
        }
    }

    @PutMapping("api/avatar")
    public ResponseEntity<?> updateAvatar(@RequestParam String avatarUrl, Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        return ResponseEntity.ok("Foto profil berhasil diperbarui.");
    }
}
