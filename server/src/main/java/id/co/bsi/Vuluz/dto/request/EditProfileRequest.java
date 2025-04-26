package id.co.bsi.Vuluz.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class EditProfileRequest {
    private String fullName;
    private String userName;
}
