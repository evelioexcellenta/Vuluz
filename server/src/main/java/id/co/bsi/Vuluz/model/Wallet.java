package id.co.bsi.Vuluz.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Table
@Entity
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long walletNumber;
    private String walletName;
    private Long balance;
    private Date createdAt;
    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "wallets", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions;

}
