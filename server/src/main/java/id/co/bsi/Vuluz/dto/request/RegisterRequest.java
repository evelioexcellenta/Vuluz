package id.co.bsi.Vuluz.dto.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String userName;
    private String password;
    private String email;
    private String fullName;
    private String avatarUrl;
}
