package id.co.bsi.Vuluz.controller;

import id.co.bsi.Vuluz.dto.response.ProfileResponse;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.repository.UserRepository;
import id.co.bsi.Vuluz.utils.JwtUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtility jwtUtility;

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();

        return ResponseEntity.ok(new ProfileResponse(
                user.getFullName(),
                user.getUserName(),
                user.getEmail(),
                user.getGender(),
                user.getAvatarUrl()
        ));
    }

    @PutMapping("/avatar")
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
