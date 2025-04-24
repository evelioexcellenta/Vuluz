package id.co.bsi.Vuluz.service;

import id.co.bsi.Vuluz.dto.TransactionHistoryResponse;
import id.co.bsi.Vuluz.dto.TransactionSummaryResponse;
import id.co.bsi.Vuluz.dto.response.BalanceResponse;
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
import java.util.Comparator;
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
            String sortOrder  // "amount_asc", "amount_desc", "date_asc", "date_desc", "amount_asc_date_desc", etc.
    ) {
        User user = userRepository.findById(userId).orElseThrow();
        Wallet wallet = user.getWallet();

        List<Transaction> transactions = transactionRepository.findByWallet(wallet);

        Comparator<TransactionHistoryResponse> comparator = null;

        if (sortOrder != null) {
            if (sortOrder.equals("amount_asc")) {
                comparator = Comparator.comparing(TransactionHistoryResponse::getAmount);
            } else if (sortOrder.equals("amount_desc")) {
                comparator = Comparator.comparing(TransactionHistoryResponse::getAmount).reversed();
            } else if (sortOrder.equals("date_asc")) {
                comparator = Comparator.comparing(TransactionHistoryResponse::getTransactionDate);
            } else if (sortOrder.equals("date_desc")) {
                comparator = Comparator.comparing(TransactionHistoryResponse::getTransactionDate).reversed();
            } else if (sortOrder.equals("amount_asc_date_desc")) {
                comparator = Comparator.comparing(TransactionHistoryResponse::getAmount)
                        .thenComparing(TransactionHistoryResponse::getTransactionDate, Comparator.reverseOrder());
            } else if (sortOrder.equals("amount_desc_date_asc")) {
                comparator = Comparator.comparing(TransactionHistoryResponse::getAmount, Comparator.reverseOrder())
                        .thenComparing(TransactionHistoryResponse::getTransactionDate);
            } else if (sortOrder.equals("date_asc_amount_asc")) {
                comparator = Comparator.comparing(TransactionHistoryResponse::getTransactionDate)
                        .thenComparing(TransactionHistoryResponse::getAmount);
            } else if (sortOrder.equals("date_desc_amount_desc")) {
                comparator = Comparator.comparing(TransactionHistoryResponse::getTransactionDate, Comparator.reverseOrder())
                        .thenComparing(TransactionHistoryResponse::getAmount, Comparator.reverseOrder());
            }
        }

        if (comparator == null) {
            comparator = Comparator.comparing(TransactionHistoryResponse::getTransactionDate, Comparator.reverseOrder());
        }

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
                .filter(tx -> search.isEmpty() || tx.getAccount().toLowerCase().
                        contains(search.toLowerCase()) || tx.getDescription().toLowerCase().
                        contains(search.toLowerCase()) || tx.getTransactionType().toLowerCase().
                        contains(search.toLowerCase()) || tx.getAmount().toString().
                        contains(search.toLowerCase()) || tx.getTransactionDate().toString().
                        contains(search.toLowerCase()))
                .sorted(comparator)
                .collect(Collectors.toList());
    }

    private LocalDate toLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    public BalanceResponse getBalance() {
        Long currentUserId = securityUtility.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Wallet wallet = user.getWallet();
        if (wallet == null) {
            throw new RuntimeException("Wallet not found for the user");
        }

        BalanceResponse response = new BalanceResponse();
        response.setBalance(wallet.getBalance());
        response.setWalletNumber(wallet.getWalletNumber());
        response.setAccountName(user.getFullName());
        response.setLastUpdated(wallet.getUpdatedAt());
        response.setMessage("Balance retrieved successfully");
        response.setStatus("Success");

        return response;
    }

    public TransactionSummaryResponse getTransactionSummary() {
        Long userId = securityUtility.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow();
        Wallet wallet = user.getWallet();
        Long walletNumber = wallet.getWalletNumber();

        List<Transaction> transactions = transactionRepository.findByWallet(wallet);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (Transaction tx : transactions) {
            String type = tx.getTransactionType();
            if ("Top Up".equalsIgnoreCase(type)) {
                totalIncome = totalIncome.add(tx.getAmount());
            } else if ("Transfer In".equalsIgnoreCase(type) && walletNumber.equals(tx.getToWalletNumber())) {
                totalIncome = totalIncome.add(tx.getAmount());
            } else if ("Transfer Out".equalsIgnoreCase(type) && walletNumber.equals(tx.getFromWalletNumber())) {
                totalExpense = totalExpense.add(tx.getAmount());
            }
        }

        BigDecimal netIncome = totalIncome.subtract(totalExpense);

        return new TransactionSummaryResponse(totalIncome, totalExpense, netIncome);
    }


}
