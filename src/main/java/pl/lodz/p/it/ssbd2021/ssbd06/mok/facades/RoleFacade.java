package pl.lodz.p.it.ssbd2021.ssbd06.mok.facades;

import javax.annotation.security.PermitAll;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.interceptor.Interceptors;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.exception.ConstraintViolationException;
import pl.lodz.p.it.ssbd2021.ssbd06.entities.Account;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.AccountException;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.AppBaseException;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.DatabaseQueryException;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.RoleException;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.AbstractFacade;
import pl.lodz.p.it.ssbd2021.ssbd06.entities.Role;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.LoggingInterceptor;

import java.util.List;

@Stateless
@Interceptors({LoggingInterceptor.class})
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class RoleFacade extends AbstractFacade<Role> {

    @PersistenceContext(unitName = "ssbd06mokPU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public RoleFacade() {
        super(Role.class);
    }

    @Override
    public void create(Role entity) throws AppBaseException {
        try{
            super.create(entity);
        }catch(ConstraintViolationException e){
            if (e.getCause().getMessage().contains(Role.ROLE_ACCESS_LEVEL_ACCOUNT_ID_CONSTRAINT)) {
                throw RoleException.alreadyGranted();
            }
            throw DatabaseQueryException.databaseQueryException(e.getCause());
        }
    }

    @Override
    public void edit(Role entity) throws AppBaseException {
        try{
            super.edit(entity);
        }catch(ConstraintViolationException e){
            if (e.getCause().getMessage().contains(Role.ROLE_ACCESS_LEVEL_ACCOUNT_ID_CONSTRAINT)) {
                throw RoleException.alreadyGranted();
            }
            throw DatabaseQueryException.databaseQueryException(e.getCause());
        }
    }

    @PermitAll
    @Override
    public void remove(Role entity) throws AppBaseException {
        super.remove(entity);
    }

    @PermitAll
    @Override
    public Role find(Object id) {
        return super.find(id);
    }

    @PermitAll
    @Override
    public List<Role> findAll() throws AppBaseException {
        return super.findAll();
    }

    @PermitAll
    @Override
    public List<Role> findRange(int[] range) throws AppBaseException {
        return super.findRange(range);
    }

    @PermitAll
    @Override
    public int count() throws AppBaseException {
        return super.count();
    }
}
