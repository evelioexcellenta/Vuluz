package id.co.bsi.Vuluz.repository;

import id.co.bsi.Vuluz.model.Favorite;
import id.co.bsi.Vuluz.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
//    Optional<Favorite> findByUserAndWalletNumber(User user, Long walletNumber);
}
