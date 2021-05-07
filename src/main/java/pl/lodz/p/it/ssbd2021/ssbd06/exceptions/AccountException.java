package pl.lodz.p.it.ssbd2021.ssbd06.exceptions;

public class AccountException extends AppBaseException {
    private static final String ACCOUNT_LOGIN_EXISTS = "exception.account.login_exists";
    private static final String ACCOUNT_CONTACT_NUMBER = "exception.account.contact_number";

    public AccountException(String message, Throwable cause) {
        super(message, cause);
    }

    public AccountException(String message) {
        super(message);
    }

    /**
     * Wyjątek reprezentuje błąd podczas zakładania konta związany z zajętym loginem.
     *
     * @param cause wyjątek, który zostanie opakowany
     * @return wyjątek AccountException
     */
    public static AccountException loginExists(Throwable cause) {
        return new AccountException(ACCOUNT_LOGIN_EXISTS, cause);
    }


    /**
     * Wyjątek reprezentuje błąd podczas zakładania konta związany z nieprawidłowym numerem kontaktowym.
     *
     * @param cause wyjątek, który zostanie opakowany
     * @return wyjątek AccountException
     */
    public static AccountException contactNumberException(Throwable cause) {
        return new AccountException(ACCOUNT_CONTACT_NUMBER, cause);
    }
}