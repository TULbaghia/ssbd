package pl.lodz.p.it.ssbd2021.ssbd06.moh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.lodz.p.it.ssbd2021.ssbd06.security.Signable;

import java.math.BigDecimal;

/**
 * Klasa DTO reprezentująca Hotel
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelDto implements Signable {
    private Long id;
    private String name;
    private String address;
    private String cityName;
    private BigDecimal rating;

    private Long version;

    @Override
    public String getMessageToSign() {
        return String.format("%d;%d", id, version);
    }
}
