package id.co.bsi.Vuluz.repository;

import id.co.bsi.Vuluz.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndPassword(String email, String password);
    Optional<User> findByEmail(String email);
    User findFirstByEmail(String email);
    Optional<User> findByWallet_WalletNumber(Long walletNumber);
}
