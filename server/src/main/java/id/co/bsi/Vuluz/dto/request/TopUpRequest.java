package id.co.bsi.Vuluz.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TopUpRequest {
//    private long walletNumber;
    private BigDecimal amount;
    private String paymentMethod;
    private String pin;
    private String description;
}
