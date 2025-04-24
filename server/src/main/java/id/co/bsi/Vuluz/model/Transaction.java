package id.co.bsi.Vuluz.model;

import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Table
@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String transactionType;

    @Column(precision = 20, scale = 2)
    private BigDecimal amount;

    private String paymentMethod;

    private Long fromWalletNumber;

    private Long toWalletNumber;

    private Date transactionDate;
    private String description;

    @ManyToOne
    @JoinColumn(name = "walletId", referencedColumnName = "id")
    private Wallet wallet;

}
