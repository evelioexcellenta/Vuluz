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
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.*;
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
                            tx.getId(),
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

        // Ambil saldo sekarang
        BigDecimal currentBalance = wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO;

        // Hitung transaksi bulan lalu
        LocalDate now = LocalDate.now();
        LocalDate previousMonthStart = now.minusMonths(1).withDayOfMonth(1);
        LocalDate previousMonthEnd = previousMonthStart.withDayOfMonth(previousMonthStart.lengthOfMonth());

        BigDecimal balanceChange = BigDecimal.ZERO;

        for (Transaction tx : transactions) {
            String type = tx.getTransactionType();
            boolean isIncoming = "Top Up".equalsIgnoreCase(type) ||
                    ("Transfer In".equalsIgnoreCase(type) && walletNumber.equals(tx.getToWalletNumber()));
            boolean isOutgoing = "Transfer Out".equalsIgnoreCase(type) && walletNumber.equals(tx.getFromWalletNumber());

            if (isIncoming) {
                totalIncome = totalIncome.add(tx.getAmount());
            } else if (isOutgoing) {
                totalExpense = totalExpense.add(tx.getAmount());
            }

            // Hitung perubahan balance bulan lalu
            LocalDate txDate = toLocalDate(tx.getTransactionDate());
            if ((txDate.isEqual(previousMonthStart) || txDate.isAfter(previousMonthStart)) &&
                    (txDate.isEqual(previousMonthEnd) || txDate.isBefore(previousMonthEnd))) {

                if (isIncoming) {
                    balanceChange = balanceChange.add(tx.getAmount());
                } else if (isOutgoing) {
                    balanceChange = balanceChange.subtract(tx.getAmount());
                }
            }
        }

        BigDecimal previousMonthBalance = currentBalance.subtract(balanceChange);
        BigDecimal netIncome = totalIncome.subtract(totalExpense);

        return new TransactionSummaryResponse(
                totalIncome,
                totalExpense,
                netIncome,
                currentBalance,
                previousMonthBalance,
                balanceChange
        );
    }

    public List<Map<String, Object>> getCashflowData(String period) {
        Long userId = securityUtility.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow();
        Wallet wallet = user.getWallet();

        List<Transaction> transactions = transactionRepository.findByWallet(wallet);

        Map<String, BigDecimal> incomeMap = new HashMap<>();
        Map<String, BigDecimal> expenseMap = new HashMap<>();

        LocalDate now = LocalDate.now();
        WeekFields weekFields = WeekFields.of(DayOfWeek.MONDAY, 1);


        // Jika daily, tentukan awal minggu (Senin) dan akhir minggu (Minggu)
        LocalDate startOfWeek = now.with(weekFields.dayOfWeek(), 1); // Monday
        LocalDate endOfWeek = now.with(weekFields.dayOfWeek(), 7);   // Sunday

        for (Transaction tx : transactions) {
            LocalDate txDate = toLocalDate(tx.getTransactionDate());
            String key = "";

            if ("daily".equalsIgnoreCase(period)) {
                if (txDate.isBefore(startOfWeek) || txDate.isAfter(endOfWeek)) {
                    continue; // Lewati transaksi di luar minggu ini
                }
                key = txDate.getDayOfWeek().toString(); // MONDAY, TUESDAY, etc
            } else if ("weekly".equalsIgnoreCase(period)) {
                int week = txDate.get(weekFields.weekOfWeekBasedYear());
                key = "Week " + week;
            } else if ("monthly".equalsIgnoreCase(period)) {
                key = txDate.getMonth().toString().substring(0, 3); // JAN, FEB, etc
            } else if ("quarterly".equalsIgnoreCase(period)) {
                int quarter = (txDate.getMonthValue() - 1) / 3 + 1;
                key = "Q" + quarter;
            } else {
                throw new IllegalArgumentException("Invalid period. Use 'daily', 'weekly', 'monthly', or 'quarterly'.");
            }

            if ("Top Up".equalsIgnoreCase(tx.getTransactionType()) ||
                    ("Transfer In".equalsIgnoreCase(tx.getTransactionType()) && wallet.getWalletNumber().equals(tx.getToWalletNumber()))) {
                incomeMap.put(key, incomeMap.getOrDefault(key, BigDecimal.ZERO).add(tx.getAmount()));
            } else if ("Transfer Out".equalsIgnoreCase(tx.getTransactionType()) && wallet.getWalletNumber().equals(tx.getFromWalletNumber())) {
                expenseMap.put(key, expenseMap.getOrDefault(key, BigDecimal.ZERO).add(tx.getAmount()));
            }
        }

        // Jika daily, pastikan semua hari Senin-Minggu ada walaupun 0
        List<String> daysOfWeek = Arrays.asList(
                "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
                "FRIDAY", "SATURDAY", "SUNDAY"
        );
        Set<String> allKeys = new HashSet<>();
        if ("daily".equalsIgnoreCase(period)) {
            allKeys.addAll(daysOfWeek);
        } else {
            allKeys.addAll(incomeMap.keySet());
            allKeys.addAll(expenseMap.keySet());
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (String key : allKeys) {
            BigDecimal income = incomeMap.getOrDefault(key, BigDecimal.ZERO);
            BigDecimal expense = expenseMap.getOrDefault(key, BigDecimal.ZERO);
            BigDecimal net = income.subtract(expense);

            Map<String, Object> item = new HashMap<>();
            item.put("label", key);
            item.put("income", income);
            item.put("expense", expense);
            item.put("net", net);
            result.add(item);
        }

        // Sort
        if ("daily".equalsIgnoreCase(period)) {
            Map<String, Integer> dayOrder = Map.of(
                    "MONDAY", 1,
                    "TUESDAY", 2,
                    "WEDNESDAY", 3,
                    "THURSDAY", 4,
                    "FRIDAY", 5,
                    "SATURDAY", 6,
                    "SUNDAY", 7
            );
            result.sort(Comparator.comparing(m -> dayOrder.get((String) m.get("label"))));
        } else {
            result.sort(Comparator.comparing(m -> (String) m.get("label")));
        }

        return result;
    }




}
