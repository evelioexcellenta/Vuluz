package id.co.bsi.Vuluz.dto.response;

import lombok.Data;

@Data
public class LogInResponse {
    private String status;
    private String message;
    private String token;
}
