package pl.lodz.p.it.ssbd2021.ssbd06.exceptions;

/**
 * Reprezentuje błąd dotyczący encji Booking
 */
public class BookingException extends AppBaseException{
    private static final String NOT_ENOUGH_BOXES = "exception.boxes.not_enough";
    private static final String CANCELLED_BOOKING = "exception.booking.cancelled_booking";
    private static final String FINISHED_BOOKING_CANCEL = "exception.booking.finished_booking";
    private static final String IN_PROGRESS_BOOKING_CANCEL = "exception.booking.in_progress_booking";
    private static final String TIME_EXCEEDED = "exception.booking.time_exceeded";
    private static final String ACCESS_DENIED = "exception.booking.access_denied";

    protected BookingException(String message, Throwable cause) {
        super(message, cause);
    }

    protected BookingException(String message) {
        super(message);
    }

    public static BookingException notEnoughBoxesOfSpecifiedType() {
        return new BookingException(NOT_ENOUGH_BOXES);
    }

    /**
     * Tworzy wyjątek występujący podczas anulowania anulowanej rezerwacji
     *
     * @return wyjątek BookingException.
     */
    public static BookingException bookingAlreadyCancelled() {
        return new BookingException(CANCELLED_BOOKING);
    }

    /**
     * Tworzy wyjątek występujący podczas anulowania zakończonej rezerwacji
     *
     * @return wyjątek BookingException.
     */
    public static BookingException finishedBookingCancellation() {
        return new BookingException(FINISHED_BOOKING_CANCEL);
    }

    /**
     * Tworzy wyjątek występujący podczas anulowania trwającej rezerwacji
     *
     * @return wyjątek BookingException.
     */
    public static BookingException inProgressBookingCancellation() {
        return new BookingException(IN_PROGRESS_BOOKING_CANCEL);
    }

    /**
     * Tworzy wyjątek występujący podczas próby anulowania rezerwacji, która rozpoczyna się za mniej niż 10 dni.
     *
     * @return wyjątek BookingException.
     */
    public static BookingException timeForCancellationExceeded() {
        return new BookingException(TIME_EXCEEDED);
    }

    /**
     * Tworzy wyjątek występujący podczas próby anulowania rezerwacji klienta przez innego klienta.
     *
     * @return wyjątek BookingException.
     */
    public static BookingException accessDenied() {
        return new BookingException(ACCESS_DENIED);
    }
}