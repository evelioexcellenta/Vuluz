package id.co.bsi.Vuluz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private String status;
    private String message;
    private Long id;
    private String email;
    private String userName;
    private String fullName;
    private String gender;
    private String avatarUrl;

    //  info wallet
    private Long walletNumber;
    private BigDecimal balance;
    private String walletName;

}
