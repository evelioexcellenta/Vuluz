package id.co.bsi.Vuluz.dto.response;

import lombok.Data;

@Data
public class GetFavoriteResponse {
    private Long id;
    private Long walletNumber;
    private String walletName;
    private String ownerName;
}
