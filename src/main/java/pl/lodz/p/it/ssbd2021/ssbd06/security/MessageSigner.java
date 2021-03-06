package pl.lodz.p.it.ssbd2021.ssbd06.security;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.AppRuntimeException;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.Config;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

/**
 * Klasa służąca do po podpisywanie wiadomości z użyciem HMAC SHA-256
 */
@ApplicationScoped
public class MessageSigner {

    @Inject
    private Config eTagConfig;

    private JWSSigner signer;

    /**
     * Metoda inicjalizująca mechanizm podpisywania
     */
    @PostConstruct
    public void init() {
        try {
            signer = new MACSigner(eTagConfig.getEtagSecretKey());
        } catch (KeyLengthException e) {
            throw AppRuntimeException.signerException(e);
        }
    }

    /**
     * Metoda podpisująca obiekt algorytmem HMAC SHA-256
     *
     * @param signable obiekt do podpisania
     * @return zakodowany ciąg znaków podpisany HMAC SHA-256
     */
    public String sign(Signable signable) {
        try {
            JWSObject jwsObject =
                    new JWSObject(new JWSHeader(JWSAlgorithm.HS256), new Payload(signable.getMessageToSign()));
            jwsObject.sign(signer);
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw AppRuntimeException.signerException(e);
        }
    }
}
