package id.co.bsi.Vuluz.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Table
@Entity
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long accountNumber;
    private Long balance;
    private Date createdAt;
    private Date updatedAt;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
