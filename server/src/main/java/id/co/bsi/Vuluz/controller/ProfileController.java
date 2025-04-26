package id.co.bsi.Vuluz.controller;

import id.co.bsi.Vuluz.dto.TransactionSummaryResponse;
import id.co.bsi.Vuluz.dto.request.EditProfileRequest;
import id.co.bsi.Vuluz.dto.response.EditProfileResponse;
import id.co.bsi.Vuluz.dto.response.ProfileResponse;
import id.co.bsi.Vuluz.dto.response.RegisterResponse;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.repository.UserRepository;
import id.co.bsi.Vuluz.service.ProfileService;
import id.co.bsi.Vuluz.utils.JwtUtility;
import id.co.bsi.Vuluz.utils.SecurityUtility;
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

    @Autowired
    SecurityUtility securityUtility;

    @GetMapping("api/profile")
    public ResponseEntity<?> getProfile() {
        try{
            ProfileResponse profileResponse = profileService.getProfileDetails();
            return ResponseEntity.ok(profileResponse);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token or user not found");
        }
    }


    @PutMapping("api/profile")
    public ResponseEntity<?> editProfile(@RequestBody EditProfileRequest editProfileRequest) {
        EditProfileResponse editProfileResponse = new EditProfileResponse();

        try {
            User user = this.profileService.editProfiles(editProfileRequest);

            editProfileResponse.setStatus("OK");
            editProfileResponse.setMessage("Edit profile successful");

        } catch (Exception e) {

            editProfileResponse.setStatus("FAILED");
            editProfileResponse.setMessage(e.getMessage());
        }

        return ResponseEntity.ok(editProfileResponse);

    }

//    @PutMapping("api/avatar")
//    public ResponseEntity<?> updateAvatar(@RequestParam String avatarUrl, Authentication authentication) {
//        String email = authentication.getName();
//        Optional<User> userOptional = userRepository.findByEmail(email);
//
//        if (userOptional.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        User user = userOptional.get();
//        user.setAvatarUrl(avatarUrl);
//        userRepository.save(user);
//
//        return ResponseEntity.ok("Foto profil berhasil diperbarui.");
//    }


}
