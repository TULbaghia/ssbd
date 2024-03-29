package pl.lodz.p.it.ssbd2021.ssbd06.moh.facades;

import javax.annotation.security.DenyAll;
import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.interceptor.Interceptors;
import javax.persistence.*;

import javax.validation.ConstraintViolationException;

import pl.lodz.p.it.ssbd2021.ssbd06.entities.Box;
import pl.lodz.p.it.ssbd2021.ssbd06.entities.enums.AnimalType;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.AppBaseException;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.BoxException;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.DatabaseQueryException;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.AbstractFacade;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.LoggingInterceptor;

import java.util.Date;
import java.util.List;

@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
@Interceptors({LoggingInterceptor.class})
public class BoxFacade extends AbstractFacade<Box> {

    @PersistenceContext(unitName = "ssbd06mohPU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public BoxFacade() {
        super(Box.class);
    }

    @RolesAllowed("addBox")
    @Override
    public void create(Box entity) throws AppBaseException {
        try {
            super.create(entity);
        } catch (ConstraintViolationException e) {
            throw DatabaseQueryException.databaseQueryException(e.getCause());
        }
    }

    @RolesAllowed({"deleteHotel", "updateBox", "deleteBox"})
    @Override
    public void edit(Box entity) throws AppBaseException {
        try {
            super.edit(entity);
        } catch (ConstraintViolationException e) {
            throw DatabaseQueryException.databaseQueryException(e.getCause());
        }
    }

    @DenyAll
    @Override
    public void remove(Box entity) throws AppBaseException {
        try {
            super.remove(entity);
        } catch (ConstraintViolationException e) {
            throw DatabaseQueryException.databaseQueryException(e.getCause());
        }
    }

    @PermitAll
    @Override
    public Box find(Object id) throws AppBaseException {
        return super.find(id);
    }

    @PermitAll
    @Override
    public List<Box> findAll() throws AppBaseException {
        return super.findAll();
    }

    @DenyAll
    @Override
    public List<Box> findRange(int[] range) throws AppBaseException {
        return super.findRange(range);
    }

    @DenyAll
    @Override
    public int count() throws AppBaseException {
        return super.count();
    }

    /**
     * Pobiera klatki z zadanego hotelu nie zajęte przez żadną rezerwacje w zadanym zakresie czasu
     *
     * @param hotelId identyfikator hotelu
     * @param dateFrom początek zakresu czasu kiedy klatka jest wolna
     * @param dateTo koniec zakresu czasu kiedy klatka jest wolna
     * @return listę wolnych klatek w danym hotelu w zadanym zakresie czasu
     */
    @RolesAllowed("getAllBoxes")
    public List<Box> getAvailableBoxesByHotelIdAndBetween(long hotelId, Date dateFrom, Date dateTo){
        TypedQuery<Box> query = em.createNamedQuery("getAvailableBoxesByTypesByHotelIdAndBetween", Box.class);
        query.setParameter("hotel_id", hotelId);
        query.setParameter("dateFrom", dateFrom);
        query.setParameter("dateTo", dateTo);
        return query.getResultList();
    }

    /**
     * Pobiera klatki z zadanego hotelu o zadanych identyfikatorach i nie zajęte przez żadną rezerwacje w zadanym zakresie czasu
     * Metoda zakłada blokadę pesymistyczną na pobrane rekordy aktualizując ich wersje - zapobiega to przypadkowi,
     * w którym system zarządzania bazą danych zezwalałby na odczyt danych zablokowanych (MCC or MVCC)
     *
     * @param hotelId identyfikator hotelu
     * @param boxIdList lista identyfikatorów klatek
     * @param dateFrom początek zakresu czasu kiedy klatka jest wolna
     * @param dateTo koniec zakresu czasu kiedy klatka jest wolna
     * @return listę klatek z zadanego hotelu o zadanych identyfikatorach i nie zajęte przez żadną rezerwacje w zadanym zakresie czasu
     * @throws AppBaseException w przypadku natrafienia na blokadę pesymistyczną
     */
    @RolesAllowed("bookReservation")
    public List<Box> getAvailableBoxesByIdListAndHotelIdWithLock(long hotelId, List<Long> boxIdList, Date dateFrom, Date dateTo) throws AppBaseException {
        try{
            TypedQuery<Box> query = em.createNamedQuery("getAvailableBoxesByIdListAndHotelId", Box.class);
            query.setParameter("hotel_id", hotelId);
            query.setParameter("boxIdList", boxIdList);
            query.setParameter("dateFrom", dateFrom);
            query.setParameter("dateTo", dateTo);
            query.setLockMode(LockModeType.PESSIMISTIC_FORCE_INCREMENT);
            return query.getResultList();
        }catch(PessimisticLockException | org.hibernate.PessimisticLockException ex){
            throw BoxException.boxIsUsed();
        }catch(LockTimeoutException ex){
            if(ex.getCause() instanceof PessimisticLockException){
                throw BoxException.boxIsUsed();
            }
            if(ex.getCause() instanceof org.hibernate.PessimisticLockException){
                throw BoxException.boxIsUsed();
            }
            throw ex;
        }
    }
}
