package id.co.bsi.Vuluz.service;

import id.co.bsi.Vuluz.dto.TransactionHistoryResponse;
import id.co.bsi.Vuluz.model.Transaction;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.model.Wallet;
import id.co.bsi.Vuluz.repository.FavoriteRepository;
import id.co.bsi.Vuluz.repository.TransactionRepository;
import id.co.bsi.Vuluz.repository.UserRepository;
import id.co.bsi.Vuluz.repository.WalletRepository;
import id.co.bsi.Vuluz.utils.SecurityUtility;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private SecurityUtility securityUtility;

    @Autowired
    private FavoriteRepository favoriteRepository;

    private String getAccountNameByWalletNumber(Long walletNumber) {
        if (walletNumber == null) return "Unknown";
        return userRepository.findByWallet_WalletNumber(walletNumber)
                .map(User::getFullName)
                .orElse("Unknown");
    }

    @Transactional
    public List<TransactionHistoryResponse> getTransactionHistory(
            Long userId,
            String transactionType,
            LocalDate fromDate,
            LocalDate toDate,
            String search,
            String sortAmount
    ) {
        User user = userRepository.findById(userId).orElseThrow();
        Wallet wallet = user.getWallet();

        List<Transaction> transactions = transactionRepository.findByWallet(wallet);

        return transactions.stream()
                .map(tx -> {
                    boolean isIncoming = tx.getToWalletNumber() != null && tx.getToWalletNumber().equals(wallet.getWalletNumber());
                    String accountName = getAccountNameByWalletNumber(isIncoming ? tx.getFromWalletNumber() : tx.getToWalletNumber());
                    BigDecimal amount = isIncoming ? tx.getAmount() : tx.getAmount().negate();

                    return new TransactionHistoryResponse(
                            tx.getTransactionDate(),
                            tx.getTransactionType(),
                            tx.getDescription(),
                            accountName,
                            amount
                    );
                })
                .filter(tx -> transactionType.isEmpty() || tx.getTransactionType().equalsIgnoreCase(transactionType))
                .filter(tx -> {
                    if (fromDate != null) {
                        LocalDate txDate = toLocalDate(tx.getTransactionDate());
                        return !txDate.isBefore(fromDate);
                    }
                    return true;
                })
                .filter(tx -> {
                    if (toDate != null) {
                        LocalDate txDate = toLocalDate(tx.getTransactionDate());
                        return !txDate.isAfter(toDate);
                    }
                    return true;
                })
                .filter(tx -> search.isEmpty() || tx.getAccount().toLowerCase().contains(search.toLowerCase()) || tx.getDescription().toLowerCase().contains(search.toLowerCase()))
                .sorted((a, b) -> {
                    if ("asc".equalsIgnoreCase(sortAmount)) {
                        return a.getAmount().compareTo(b.getAmount());
                    } else if ("desc".equalsIgnoreCase(sortAmount)) {
                        return b.getAmount().compareTo(a.getAmount());
                    } else {
                        return b.getTransactionDate().compareTo(a.getTransactionDate()); // default
                    }
                })
                .collect(Collectors.toList());
    }

    private LocalDate toLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }
}
