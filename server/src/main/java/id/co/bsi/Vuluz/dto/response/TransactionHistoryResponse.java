package id.co.bsi.Vuluz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
public class TransactionHistoryResponse {
    private Date transactionDate;
    private String transactionType;
    private String description;
    private String account;
    private BigDecimal amount;
}