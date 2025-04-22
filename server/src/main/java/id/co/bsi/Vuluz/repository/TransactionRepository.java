package id.co.bsi.Vuluz.repository;

import id.co.bsi.Vuluz.model.Transaction;
import id.co.bsi.Vuluz.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("SELECT t FROM Transaction t WHERE t.wallet.user.id = :userId AND FUNCTION('MONTH', t.transactionDate) = :month AND FUNCTION('YEAR', t.transactionDate) = :year")
    List<Transaction> findByUserIdAndMonthYear(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

    List<Transaction> findByWallet(Wallet wallet);
}
