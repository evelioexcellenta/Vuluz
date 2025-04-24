package id.co.bsi.Vuluz.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class BalanceResponse {
    private BigDecimal balance;
    private Long walletNumber;
    private String accountName;
    private Date lastUpdated;
    private String message;
    private String status;
}
