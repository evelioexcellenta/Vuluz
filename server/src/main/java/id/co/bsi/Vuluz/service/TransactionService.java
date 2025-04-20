package id.co.bsi.Vuluz.service;

import id.co.bsi.Vuluz.dto.request.TransferRequest;
import id.co.bsi.Vuluz.dto.response.TransferResponse;
import id.co.bsi.Vuluz.model.Transaction;
import id.co.bsi.Vuluz.model.Wallet;
import id.co.bsi.Vuluz.repository.TransactionRepository;
import id.co.bsi.Vuluz.repository.UserRepository;
import id.co.bsi.Vuluz.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TransactionService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public TransferResponse transfer(TransferRequest transferRequest) {
        Wallet fromWallet = walletRepository.findByWalletNumber(transferRequest.getFromWalletNumber())
                .orElseThrow(() -> new RuntimeException("Sender wallet number is not found"));

        Long toWalletNumber = transferRequest.getToWalletNumber();
        Wallet toWallet = walletRepository.findByWalletNumber(toWalletNumber)
                .orElseThrow(() -> new RuntimeException("Receiver wallet number is not found"));

        if (fromWallet.getBalance().compareTo(transferRequest.getAmount()) < 0) {
            throw new RuntimeException("Balance is not enough");
        }

        fromWallet.setBalance(fromWallet.getBalance().subtract(transferRequest.getAmount()));
        toWallet.setBalance(toWallet.getBalance().add(transferRequest.getAmount()));

        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);

        Transaction transaction = new Transaction();
        transaction.setTransactionType("Transfer");
        transaction.setAmount(transferRequest.getAmount());
        transaction.setFromWalletNumber(fromWallet.getWalletNumber());
        transaction.setToWalletNumber(toWallet.getWalletNumber());
        transaction.setTransactionDate(new Date());
        transaction.setDescription(transferRequest.getNotes());
        transaction.setPaymentMethod("Vuluz");
        transaction.setWallet(fromWallet);

        transactionRepository.save(transaction);

        TransferResponse response = new TransferResponse();
        response.setStatus("success");
        response.setMessage("Transfer success");

        return response;
    }
}
