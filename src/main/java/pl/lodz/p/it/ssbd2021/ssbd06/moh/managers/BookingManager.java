package pl.lodz.p.it.ssbd2021.ssbd06.moh.managers;

import pl.lodz.p.it.ssbd2021.ssbd06.entities.Booking;
import pl.lodz.p.it.ssbd2021.ssbd06.entities.enums.BookingStatus;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.AppBaseException;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.BookingException;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.dto.NewBookingDto;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.facades.AccountFacade;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.facades.BookingFacade;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.LoggingInterceptor;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.email.EmailSender;

import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.interceptor.Interceptors;
import javax.security.enterprise.SecurityContext;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Manager odpowiadający za zarządzanie rezerwacjami.
 */
@Stateless
@Interceptors({LoggingInterceptor.class})
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class BookingManager {

    private static final long TEN_DAYS_IN_MILLIS = 864000000L;

    @Inject
    private BookingFacade bookingFacade;

    @Inject
    private AccountFacade accountFacade;

    @Inject
    private SecurityContext securityContext;

    @Inject
    private EmailSender emailSender;

    /**
     * Zwraca wskazaną rezerwację:
     * - Dla managera dozwolone rezerwacja w jego hotelu,
     * - Dla klienta rezerwacja złożona przez tego klienta.
     *
     * @param id identyfikator rezerwacji
     * @return rezerwacja
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    Booking get(Long id) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Zwraca listę rezerwacji w zależności od roli:
     * - Dla managera rezerwacje dotyczące jego hotelu,
     * - Dla klienta rezerwacje dotyczące tego klienta.
     *
     * @return lista rezerwacji
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    List<Booking> getAll() throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Zwraca listę rezerwacji w zależności od roli z filtrowaniem:
     * - Dla managera rezerwacje dotyczące jego hotelu,
     * - Dla klienta rezerwacje dotyczące tego klienta.
     *
     * @return lista rezerwacji
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    List<Booking> getAll(String... option) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Tworzy nową rezerwację
     *
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    @RolesAllowed("bookReservation")
    void addBooking(NewBookingDto bookingDto) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Anuluje rezerwację
     *
     * @param bookingId identyfikator rezerwacji
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    @RolesAllowed("cancelReservation")
    public void cancelBooking(Long bookingId) throws AppBaseException {
        Booking booking = bookingFacade.find(bookingId);
        String callerName = securityContext.getCallerPrincipal().getName();
        String clientLogin = booking.getAccount().getLogin();
        if (securityContext.isCallerInRole("Client") && !callerName.equals(clientLogin)) {
            throw BookingException.accessDenied();
        }
        if (booking.getStatus().equals(BookingStatus.PENDING)) {
            if (securityContext.isCallerInRole("Client") && isLessThanTenDaysFromNow(booking.getDateFrom())) {
                throw BookingException.timeForCancellationExceeded();
            }
            booking.setStatus(BookingStatus.CANCELLED);
            bookingFacade.edit(booking);
            emailSender.sendCancelReservationEmail(booking.getAccount(), booking.getId());
        } else if (booking.getStatus().equals(BookingStatus.IN_PROGRESS)) {
            throw BookingException.inProgressBookingCancellation();
        } else if (booking.getStatus().equals(BookingStatus.FINISHED)) {
            throw BookingException.finishedBookingCancellation();
        } else {
            throw BookingException.bookingAlreadyCancelled();
        }
    }

    /**
     * Sprawdza czy został przekroczony dozwolony czas na anulowanie rezerwacji
     *
     * @param bookingBeginDate data rozpoczęcia rezerwacji
     * @return czy został przekroczony dozwolony czas
     */
    private boolean isLessThanTenDaysFromNow(Date bookingBeginDate) {
        long differenceInMillis = (bookingBeginDate.getTime() - new Date().getTime());
        return differenceInMillis < TEN_DAYS_IN_MILLIS;
    }

    /**
     * Kończy rezerwację
     *
     * @param bookingId identyfikator rezerwacji
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    @RolesAllowed("endReservation")
    void endBooking(Long bookingId) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Zmienia stan rezerwacji na IN_PROGRESS
     *
     * @param bookingId identyfikator rezerwacji
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    void startBooking(Long bookingId) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * MOH.18 Wyświetla listę aktywnych rezerwacji:
     * - Dla managera rezerwacje dotyczące jego hotelu,
     * - Dla klienta rezerwacje dotyczące tego klienta.
     *
     * @return lista rezerwacji
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    @RolesAllowed({"getAllActiveReservations", "Client"})
    public List<Booking> showActiveBooking() throws AppBaseException {
        String callerName = securityContext.getCallerPrincipal().getName();
        if (securityContext.isCallerInRole("Client")) {
            return bookingFacade.findAllActive().stream()
                    .filter(b -> b.getAccount().getLogin().equals(callerName))
                    .collect(Collectors.toList());
        } else {
            return bookingFacade.findAllActive().stream()
                    .filter(b -> b.getBookingLineList().stream().anyMatch(
                            bl -> bl.getBox().getHotel().getManagerDataList().stream().anyMatch(
                                    md -> md.getAccount().getLogin().equals(callerName))))
                    .collect(Collectors.toList());
        }
    }

    /**
     * MOH.19 Wyświetla listę archiwalnych rezerwacji:
     * - Dla managera archiwalne rezerwacje dotyczące jego hotelu,
     * - Dla klienta archiwalne rezerwacje dotyczące tego klienta.
     *
     * @return lista rezerwacji
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    @RolesAllowed({"getAllArchiveReservations", "Client"})
    public List<Booking> showEndedBooking() throws AppBaseException {
        String callerName = securityContext.getCallerPrincipal().getName();
        if (securityContext.isCallerInRole("Client")) {
            return bookingFacade.findAllArchived().stream()
                    .filter(b -> b.getAccount().getLogin().equals(callerName))
                    .collect(Collectors.toList());
        } else {
            return bookingFacade.findAllArchived().stream()
                    .filter(b -> b.getBookingLineList().stream().anyMatch(
                            bl -> bl.getBox().getHotel().getManagerDataList().stream().anyMatch(
                                    md -> md.getAccount().getLogin().equals(callerName))))
                    .collect(Collectors.toList());
        }
    }
}
