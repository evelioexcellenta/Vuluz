package id.co.bsi.Vuluz.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Table
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long walletId;
    private String transactionType;
    private Long amount;
    private Long recipientWalletId;
    private Date transactionDate;
    private String description;
}
