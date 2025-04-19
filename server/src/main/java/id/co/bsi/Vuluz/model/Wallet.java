package id.co.bsi.Vuluz.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Table
@Entity
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String walletName;
    private Long walletNumber;

    @Column(scale = 2)
    private BigDecimal balance;

    private Date createdAt;
    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL)
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL)
    private List<Favorite> favorites;

}
