package pl.lodz.p.it.ssbd2021.ssbd06.auth.endpoints;

import pl.lodz.p.it.ssbd2021.ssbd06.auth.dto.LoginDataDto;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.AppBaseException;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.CallingClass;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.ejb.Local;

@Local
public interface AuthEndpointLocal extends CallingClass {
    /**
     * Przeprowadza proces uwierzytelnienia użytkownika
     *
     * @param loginDataDto dane uwierzytelniające użytkownika
     * @return token jwt
     * @throws AppBaseException gdy uwierzytelnianie się nie powiedzie
     */
    @PermitAll
    String login(LoginDataDto loginDataDto) throws AppBaseException;

    /**
     * Zapisuje w dzienniku zdarzeń fakt wylogowanie użytkownika
     */
    @RolesAllowed("logoutUser")
    void logout();

    /**
     * Odświeża token JWT
     * @param currToken obecny token, wymagający odnowienia
     * @return nowy token JWT
     */
    @RolesAllowed("refreshToken")
    public String refreshToken(String currToken);
}
