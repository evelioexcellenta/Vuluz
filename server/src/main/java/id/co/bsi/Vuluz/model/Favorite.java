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
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "walletId", referencedColumnName = "id")
    private Wallet wallet;
}
