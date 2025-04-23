package id.co.bsi.Vuluz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileResponse {
    private String fullName;
    private String userName;
    private String email;
    private String gender;
    private String avatarUrl;
}
