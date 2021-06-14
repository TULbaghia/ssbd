package pl.lodz.p.it.ssbd2021.ssbd06.moh.endpoints;

import org.mapstruct.factory.Mappers;
import pl.lodz.p.it.ssbd2021.ssbd06.entities.Booking;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.AppBaseException;
import pl.lodz.p.it.ssbd2021.ssbd06.mappers.IBookingMapper;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.dto.BookingDto;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.dto.NewBookingDto;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.endpoints.interfaces.BookingEndpointLocal;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.managers.BookingManager;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.AbstractEndpoint;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.LoggingInterceptor;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateful;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.interceptor.Interceptors;
import java.util.ArrayList;
import java.util.List;

/**
 * Endpoint odpowiadający za zarządzanie rezerwacjami.
 */
@Stateful
@Interceptors({LoggingInterceptor.class})
@TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
public class BookingEndpoint extends AbstractEndpoint implements BookingEndpointLocal {

    @Inject
    private BookingManager bookingManager;

    @Override
    public BookingDto get(Long id) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    @Override
    public List<BookingDto> getAll() throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    @Override
    public List<BookingDto> getAll(String... option) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    @Override
    @RolesAllowed("bookReservation")
    public void addBooking(NewBookingDto bookingDto) throws AppBaseException {
        bookingManager.addBooking(bookingDto, getLogin());
    }

    @Override
    @RolesAllowed("cancelReservation")
    public void cancelBooking(Long bookingId) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    @Override
    @RolesAllowed("endReservation")
    public void endBooking(Long bookingId) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    @Override
    public void startBooking(Long bookingId) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    @Override
    @RolesAllowed("getAllActiveReservations")
    public List<BookingDto> showActiveBooking() throws AppBaseException {
        List<Booking> activeBookings = bookingManager.showActiveBooking();
        List<BookingDto> result = new ArrayList<>(activeBookings.size());
        for (Booking booking : activeBookings) {
            BookingDto bookingDto = Mappers.getMapper(IBookingMapper.class).toBookingDto(booking);
            bookingDto.setBookingStatus(booking.getStatus().toString());
            result.add(bookingDto);
        }
        return result;
    }

    @Override
    @RolesAllowed("getAllArchiveReservations")
    public List<BookingDto> showEndedBooking() throws AppBaseException {
        List<Booking> activeBookings = bookingManager.showEndedBooking();
        List<BookingDto> result = new ArrayList<>(activeBookings.size());
        for (Booking booking : activeBookings) {
            BookingDto bookingDto = Mappers.getMapper(IBookingMapper.class).toBookingDto(booking);
            bookingDto.setBookingStatus(booking.getStatus().toString());
            result.add(bookingDto);
        }
        return result;
    }
}
