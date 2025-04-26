package id.co.bsi.Vuluz.service;

import id.co.bsi.Vuluz.dto.TransactionHistoryResponse;
import id.co.bsi.Vuluz.dto.request.*;
import id.co.bsi.Vuluz.dto.response.*;
import id.co.bsi.Vuluz.model.Favorite;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class TransactionService {
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    final BigDecimal minimumTopup = BigDecimal.valueOf(10000);


    public TransferResponse transfer(TransferRequest transferRequest) {
        User user = userRepository.findById(securityUtility.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(transferRequest.getPin() == null){
            throw new RuntimeException("Input your pin");
        }

        if (!passwordEncoder.matches(transferRequest.getPin(), user.getPin())) {
            throw new RuntimeException("Invalid PIN");
        }

        Wallet fromWallet = user.getWallet();

        if(Objects.equals(transferRequest.getToWalletNumber(), fromWallet.getWalletNumber())){
            throw new RuntimeException("You cant transfer to yourself");
        }

        if(transferRequest.getToWalletNumber() == null){
            throw new RuntimeException("Input wallet number");
        }

        if (transferRequest.getAmount() == null) {
            throw new RuntimeException("Transfer amount is required");
        }




        Wallet toWallet = walletRepository.findByWalletNumber(transferRequest.getToWalletNumber())
                .orElseThrow(() -> new RuntimeException("Receiver wallet number is not found"));

        if (fromWallet.getBalance().compareTo(transferRequest.getAmount()) < 0) {
            throw new RuntimeException("Balance is not enough");
        }

        fromWallet.setBalance(fromWallet.getBalance().subtract(transferRequest.getAmount()));
        fromWallet.setUpdatedAt(new Date());
        walletRepository.save(fromWallet);

        toWallet.setBalance(toWallet.getBalance().add(transferRequest.getAmount()));
        toWallet.setUpdatedAt(new Date());
        walletRepository.save(toWallet);

        Transaction transactionIn = new Transaction();
        transactionIn.setTransactionType("Transfer In");
        transactionIn.setAmount(transferRequest.getAmount());
        transactionIn.setFromWalletNumber(fromWallet.getWalletNumber());
        transactionIn.setToWalletNumber(toWallet.getWalletNumber());
        transactionIn.setTransactionDate(new Date());
        transactionIn.setDescription(transferRequest.getNotes());
        transactionIn.setPaymentMethod("Vuluz");
        transactionIn.setWallet(toWallet);

        transactionRepository.save(transactionIn);

        Transaction transactionOut = new Transaction();
        transactionOut.setTransactionType("Transfer Out");
        transactionOut.setAmount(transferRequest.getAmount());
        transactionOut.setFromWalletNumber(fromWallet.getWalletNumber());
        transactionOut.setToWalletNumber(toWallet.getWalletNumber());
        transactionOut.setTransactionDate(new Date());
        transactionOut.setDescription(transferRequest.getNotes());
        transactionOut.setPaymentMethod("Vuluz");
        transactionOut.setWallet(fromWallet);

        transactionRepository.save(transactionOut);

        TransferResponse response = new TransferResponse();
        response.setStatus("Success");
        response.setMessage("Transfer Success");

        return response;
    }

    public TopUpResponse topup(TopUpRequest topUpRequest){
        User user = userRepository.findById(securityUtility.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(topUpRequest.getPin() == null){
            throw new RuntimeException("Input pin is required");
        }

        if (!passwordEncoder.matches(topUpRequest.getPin(), user.getPin())) {
            throw new RuntimeException("Invalid PIN");
        }

        if(topUpRequest.getPaymentMethod() == null || topUpRequest.getPaymentMethod().isEmpty()){
            throw new RuntimeException("Payment method is required");
        }

        if (topUpRequest.getAmount() == null) {
            throw new RuntimeException("Top up amount is required");
        }

        if (topUpRequest.getAmount().compareTo(minimumTopup) < 0) {
            throw new RuntimeException("Top-up amount must be greater than Rp.10.000");
        }

        Wallet wallet = user.getWallet();

        wallet.setBalance(wallet.getBalance().add(topUpRequest.getAmount()));
        wallet.setUpdatedAt(new Date());
        walletRepository.save(wallet);

        Transaction transaction = new Transaction();
        transaction.setTransactionType("Top Up");
        transaction.setAmount(topUpRequest.getAmount());
        transaction.setFromWalletNumber(wallet.getWalletNumber());
        transaction.setToWalletNumber(wallet.getWalletNumber());
        transaction.setTransactionDate(new Date());
        transaction.setDescription(topUpRequest.getDescription());
        transaction.setPaymentMethod(topUpRequest.getPaymentMethod());
        transaction.setWallet(wallet);
        transactionRepository.save(transaction);

        TopUpResponse response = new TopUpResponse();
        response.setStatus("Success");
        response.setMessage("Top Up Success");

        return response;
    }

//    public Wallet createWallet(CreateWalletRequest createWalletRequest){
//        Wallet wallet = new Wallet();
//        wallet.setWalletName(createWalletRequest.getWalletName());
//        wallet.setBalance(BigDecimal.valueOf(0));
//        wallet.setCreatedAt(new Date());
//        wallet.setUpdatedAt(new Date());
//
//        long randomWalletNumber = ThreadLocalRandom.current().nextLong(100000, 1000000); // 6 digit
//        wallet.setWalletNumber(randomWalletNumber);
//
//        User user = userRepository.findById(securityUtility.getCurrentUserId()).get();
//        wallet.setUser(user);
//
//        walletRepository.save(wallet);
//
//        return wallet;
//    }

    public AddFavoriteResponse addFavoriteResponse(AddFavoriteRequest addFavoriteRequest){
        User user = userRepository.findById(securityUtility.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("User is not found"));

        Long walletNumberToAdd = addFavoriteRequest.getWalletNumber();
        List<Favorite> listFavorite = user.getFavorites();

        boolean alreadyFavorited = listFavorite.stream()
                .anyMatch(fav -> fav.getWalletNumber().equals(walletNumberToAdd));

        Wallet userWallet = user.getWallet();

        if (addFavoriteRequest.getWalletNumber().equals(userWallet.getWalletNumber())) {
            throw new RuntimeException("You cannot add your own wallet number");
        }

        if (alreadyFavorited) {
            throw new RuntimeException("Wallet number already added to favorites");
        }

        Favorite favorite = new Favorite();
        favorite.setWalletNumber(walletNumberToAdd);
        favorite.setUser(user);
        favoriteRepository.save(favorite);

        User userFavorite = userRepository.findByWallet_WalletNumber(addFavoriteRequest.getWalletNumber())
                .orElseThrow(() -> new RuntimeException("User favorite is not found"));;
        AddFavoriteResponse addFavoriteResponse = new AddFavoriteResponse();
        addFavoriteResponse.setFullName(userFavorite.getFullName());
        addFavoriteResponse.setStatus("Success");
        addFavoriteResponse.setMessage("Favorite is added");
        return addFavoriteResponse;
    }

    public DeleteFavoriteResponse deleteFavorite(Long walletNumber) {
        User user = userRepository.findById(securityUtility.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Wallet targetWallet = walletRepository.findByWalletNumber(walletNumber)
                .orElseThrow(() -> new RuntimeException("Target wallet not found"));

        Favorite favoriteToRemove = favoriteRepository.findByUserAndWalletNumber(user, targetWallet.getWalletNumber())
                .orElseThrow(() -> new RuntimeException("Favorite not found"));

        favoriteRepository.delete(favoriteToRemove);

        DeleteFavoriteResponse response = new DeleteFavoriteResponse();
        response.setStatus("Success");
        response.setMessage("Delete favorite success");

        return response;
    }

    public List<GetFavoriteResponse> getFavorites() {
        User user = userRepository.findById(securityUtility.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Favorite> favorites = user.getFavorites();

        return favorites.stream().map(favorite -> {
            GetFavoriteResponse response = new GetFavoriteResponse();
            response.setId(favorite.getId());
            response.setWalletNumber(favorite.getWalletNumber());

            Wallet wallet = walletRepository.findByWalletNumber(favorite.getWalletNumber())
                    .orElse(null);

            if (wallet != null) {
                response.setWalletName(wallet.getWalletName());
                User owner = wallet.getUser();
                if (owner != null) {
                    response.setOwnerName(owner.getFullName());
                }
            }

            return response;
        }).collect(Collectors.toList());
    }


}
