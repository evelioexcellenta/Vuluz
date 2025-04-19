package id.co.bsi.Vuluz.controller;

import id.co.bsi.Vuluz.dto.request.RegisterRequest;
import id.co.bsi.Vuluz.dto.response.RegisterResponse;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    @Autowired
    private UserService usersService;


    @PostMapping("/api/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) {
        RegisterResponse registerResponse = new RegisterResponse();
        try {
            User register = this.usersService.register(registerRequest);

            registerResponse.setStatus("OK");
            registerResponse.setMessage("berhasil register");

        } catch (Exception e) {

            registerResponse.setStatus("FAILED");
            registerResponse.setMessage(e.getMessage());
        }
        return ResponseEntity.ok(registerResponse);
    }

}
