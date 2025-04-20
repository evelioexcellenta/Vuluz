package id.co.bsi.Vuluz.service;

import id.co.bsi.Vuluz.dto.request.CreateWalletRequest;
import id.co.bsi.Vuluz.dto.request.TopUpRequest;
import id.co.bsi.Vuluz.dto.request.TransferRequest;
import id.co.bsi.Vuluz.dto.response.CreateWalletResponse;
import id.co.bsi.Vuluz.dto.response.TopUpResponse;
import id.co.bsi.Vuluz.dto.response.TransferResponse;
import id.co.bsi.Vuluz.model.Transaction;
import id.co.bsi.Vuluz.model.User;
import id.co.bsi.Vuluz.model.Wallet;
import id.co.bsi.Vuluz.repository.TransactionRepository;
import id.co.bsi.Vuluz.repository.UserRepository;
import id.co.bsi.Vuluz.repository.WalletRepository;
import id.co.bsi.Vuluz.utils.SecurityUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

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

    public TransferResponse transfer(TransferRequest transferRequest) {
        Wallet fromWallet = walletRepository.findByWalletNumber(transferRequest.getFromWalletNumber())
                .orElseThrow(() -> new RuntimeException("Sender wallet number is not found"));

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
        Wallet wallet = walletRepository.findByWalletNumber(topUpRequest.getWalletNumber())
                .orElseThrow(() -> new RuntimeException("Wallet is not found"));

        wallet.setBalance(wallet.getBalance().add(topUpRequest.getAmount()));
        wallet.setUpdatedAt(new Date());
        walletRepository.save(wallet);

        Transaction transaction = new Transaction();
        transaction.setTransactionType("Top Up");
        transaction.setAmount(topUpRequest.getAmount());
        transaction.setFromWalletNumber(topUpRequest.getWalletNumber());
        transaction.setToWalletNumber(topUpRequest.getWalletNumber());
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

    public Wallet createWallet(CreateWalletRequest createWalletRequest){
        Wallet wallet = new Wallet();
        wallet.setWalletName(createWalletRequest.getWalletName());
        wallet.setBalance(BigDecimal.valueOf(0));
        wallet.setCreatedAt(new Date());
        wallet.setUpdatedAt(new Date());

        long randomWalletNumber = ThreadLocalRandom.current().nextLong(100000, 1000000); // 6 digit
        wallet.setWalletNumber(randomWalletNumber);

        User user = userRepository.findById(securityUtility.getCurrentUserId()).get();
        wallet.setUser(user);

        walletRepository.save(wallet);

        return wallet;
    }
}
