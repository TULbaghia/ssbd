package pl.lodz.p.it.ssbd2021.ssbd06.mok.facades;

import org.hibernate.exception.ConstraintViolationException;
import pl.lodz.p.it.ssbd2021.ssbd06.entities.Account;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.*;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.AbstractFacade;

import javax.annotation.security.PermitAll;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.*;

@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class AccountFacade extends AbstractFacade<Account> {

    @PersistenceContext(unitName = "ssbd06mokPU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public AccountFacade() {
        super(Account.class);
    }

    /**
     * Utrwala encję w bazie danych oraz sprawdza warunki poprawności.
     *
     * @param entity obiekt encji konta
     * @throws AppBaseException podczas wystąpienia błędu utrwalania w bazie danych
     */
    @Override
    public void create(Account entity) throws AppBaseException {
        try {
            super.create(entity);
        } catch (ConstraintViolationException e) {
            if (e.getCause().getMessage().contains("uk_account_login")) {
                throw AccountException.loginExists(e.getCause());
            } else if (e.getCause().getMessage().contains("uk_account_contact_number")) {
                throw AccountException.contactNumberException(e.getCause());
            }
            throw new DatabaseQueryException(e.getMessage(), e.getCause());
        }
    }

    public Account findByLogin(String login) throws AppBaseException {
        try {
            TypedQuery<Account> accountTypedQuery = em.createNamedQuery("Account.findByLogin", Account.class);
            accountTypedQuery.setParameter("login", login);
            return accountTypedQuery.getSingleResult();
        } catch (NoResultException e) {
            throw new NotFoundException(e.getMessage());
        } catch (PersistenceException e) {
            throw new DatabaseQueryException(e.getMessage());
        }
    }

    @Override
    @PermitAll
    public void edit(Account entity) throws AppBaseException {
        super.edit(entity);
    }
}
