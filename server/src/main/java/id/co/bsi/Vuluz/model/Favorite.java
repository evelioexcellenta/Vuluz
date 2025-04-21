package id.co.bsi.Vuluz.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Table
@Entity
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fromWalletId")
    private Wallet fromWallet;

    @ManyToOne
    @JoinColumn(name = "toWalletId")
    private Wallet toWallet;
}
