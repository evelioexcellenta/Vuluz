package id.co.bsi.Vuluz.dto.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String userName;
    private String gender;
}
