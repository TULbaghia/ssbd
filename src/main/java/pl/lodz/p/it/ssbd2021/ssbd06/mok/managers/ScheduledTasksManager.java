package pl.lodz.p.it.ssbd2021.ssbd06.mok.managers;

import lombok.extern.java.Log;
import pl.lodz.p.it.ssbd2021.ssbd06.entities.Account;
import pl.lodz.p.it.ssbd2021.ssbd06.entities.PendingCode;
import pl.lodz.p.it.ssbd2021.ssbd06.entities.enums.CodeType;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.AppBaseException;
import pl.lodz.p.it.ssbd2021.ssbd06.mok.facades.AccountFacade;
import pl.lodz.p.it.ssbd2021.ssbd06.mok.facades.PendingCodeFacade;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.AbstractEndpoint;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.LoggingInterceptor;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.email.EmailSender;

import javax.annotation.Resource;
import javax.annotation.security.PermitAll;
import javax.ejb.*;
import javax.inject.Inject;
import javax.interceptor.Interceptors;
import javax.servlet.ServletContext;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;

/**
 * Odpowiada za przetwarzanie logiki biznesowej dotyczącej działań wykonywanych w konkretnym momencie czasu przez system.
 */
@Stateful
@Interceptors({LoggingInterceptor.class})
@Log
@TransactionAttribute(TransactionAttributeType.REQUIRED)
public class ScheduledTasksManager extends AbstractEndpoint {

    @Resource
    TimerService timerService;
    @Inject
    private AccountFacade accountFacade;
    @Inject
    private PendingCodeFacade pendingCodeFacade;
    @Inject
    private EmailSender emailSender;
    @Inject
    private ServletContext context;

    /**
     * Usuwa konta użytkowników nie potwierdzonych
     *
     * @param time czas z zegara stworzonego przez EJB
     * @throws AppBaseException w przypadku gdy operacja zakończy się niepowodzeniem
     */
    @PermitAll
    public void deleteUnverifiedAccounts(Timer time) throws AppBaseException{
        int confirmationCodeExpirationTime = Integer
                .parseInt(context.getInitParameter("accountConfirmationCodeExpirationTime"));
        int confirmationCodeHalfOfExpirationTime = confirmationCodeExpirationTime / 2;

        Instant expirationInstant = Instant.now().minus(confirmationCodeExpirationTime, ChronoUnit.HOURS);
        Date expirationDate = Date.from(expirationInstant);

        try {
            List<Account> unverifiedAccountsToRemove = accountFacade.findUnverifiedBefore(expirationDate);
            for (Account account : unverifiedAccountsToRemove) {
                accountFacade.remove(account);
                emailSender.sendDeleteUnconfirmedAccountEmail(account);
            }
        } catch (AppBaseException e) {
            log.log(Level.WARNING, "Error while deleting unconfirmed accounts by scheduler");
        }


        // ponowne wysłanie kodów aktywacyjnych
        Instant halfExpirationInstant = Instant.now().minus(confirmationCodeHalfOfExpirationTime, ChronoUnit.HOURS);
        Date halfExpirationDate = Date.from(halfExpirationInstant);
        try {
            List<PendingCode> unusedCodes = pendingCodeFacade.findAllUnusedByCodeTypeAndBeforeAndAttemptCount(CodeType.ACCOUNT_ACTIVATION, halfExpirationDate, 0);
            for (PendingCode code : unusedCodes) {
                code.setSendAttempt(code.getSendAttempt() + 1);
                pendingCodeFacade.edit(code);
                emailSender.sendActivationEmail(code.getAccount(), code.getCode());
            }
        } catch (AppBaseException e) {
            log.log(Level.WARNING, "Error while resending email for unconfirmed accounts by scheduler");
        }
    }

    /**
     * Ponownie wysyła email z informacją o rozpoczęciu procesu zmiany adresu email dla konta użytkownka.
     * W przypadku, gdy żeton zmiany email nie został użyty przez ponad godzinę od momentu utworzenia, jednak czas ten
     * nie przekroczył 2 godzin od momentu utworzenia, następuje ponowne wysłanie emaila z informacją o rozpoczęciu
     * procesu zmiany adresu email dla konta użytkownka.
     *
     * W przypadku, gdy żeton zmiany email nie został użyty przez ponad 2 godziny od momentu utworzenia,
     * następuje usunięcie żetonu.
     *
     * @param time czas z zegara stworzonego przez EJB
     * @throws AppBaseException w przypadku gdy operacja zakończy się niepowodzeniem
     */
    @PermitAll
    public void sendRepeatedEmailChange(Timer time) throws AppBaseException {
        int emailChangeCodeExpirationTime = Integer
                .parseInt(context.getInitParameter("emailChangeCodeExpirationTime"));
        Instant expirationInstant = Instant.now().minus(emailChangeCodeExpirationTime, ChronoUnit.HOURS);
        Date expirationDate = Date.from(expirationInstant);
        try {
            List<Account> accountsUnusedCodes = pendingCodeFacade.findAllAccountsWithUnusedCodes(CodeType.EMAIL_CHANGE, expirationDate);
            for (Account account : accountsUnusedCodes) {
                account.getPendingCodeList().removeIf(x -> x.getCodeType().equals(CodeType.EMAIL_CHANGE) && !x.isUsed());
                accountFacade.edit(account);
            }
        } catch (AppBaseException e) {
            log.log(Level.WARNING, "Error while deleting unused codes by scheduler");
        }

        int emailChangeCodeRepeatTime = Integer
                .parseInt(context.getInitParameter("emailChangeCodeRepeatTime"));
        Instant repeatInstant = Instant.now().minus(emailChangeCodeRepeatTime, ChronoUnit.HOURS);
        Date repeatDate = Date.from(repeatInstant);
        try {
            List<PendingCode> unusedCodes = pendingCodeFacade.findAllUnusedByCodeTypeAndBeforeAndAttemptCount(CodeType.EMAIL_CHANGE, repeatDate, 0);
            for (PendingCode code : unusedCodes) {
                code.setSendAttempt(code.getSendAttempt() + 1);
                pendingCodeFacade.edit(code);
                emailSender.sendEmailChange(code.getAccount(), code.getCode());
            }
        } catch (AppBaseException e) {
            log.log(Level.WARNING, "Error while resending email for accounts with unused EmailChange code by scheduler");
        }
    }
}
