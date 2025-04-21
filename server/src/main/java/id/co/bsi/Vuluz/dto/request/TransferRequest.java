package id.co.bsi.Vuluz.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferRequest {
//    private Long fromWalletNumber;
    private Long toWalletNumber;
    private BigDecimal amount;
    private String notes;
}
