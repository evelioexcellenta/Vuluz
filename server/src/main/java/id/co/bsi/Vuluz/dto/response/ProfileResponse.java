package id.co.bsi.Vuluz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProfileResponse {
    private String fullName;
    private String userName;
    private String email;
    private String gender;
    private String avatarUrl;
    private Long walletNumber;
    private BigDecimal walletBalance;
    private String walletName;
}
