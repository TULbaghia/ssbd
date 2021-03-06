package pl.lodz.p.it.ssbd2021.ssbd06.exceptions;

/**
 * Reprezentuje błąd dotyczący encji City.
 */
public class CityException extends AppBaseException {
    private static final String CITY_NAME_INVALID = "exception.city.name_invalid";
    private static final String CITY_HAS_HOTELS_ASSIGNED = "exception.delete.city.has_hotels";

    private CityException(String message, Throwable cause) {
        super(message, cause);
    }

    private CityException(String message) {
        super(message);
    }

    /**
     * Tworzy wyjątek związany z duplikacją nazwy obiektu typu City.
     *
     * @param cause wyjątek, który zostanie opakowany.
     * @return wyjątek NotFoundException.
     */
    public static CityException cityNameExists(Throwable cause) {
        return new CityException(CITY_NAME_INVALID, cause);
    }

    /**
     * Wyjątek reprezentuje błąd podczas usuwania miasta związany z przypisanym do niego hotelem
     *
     * @return wyjątek NotFoundException.
     */
    public static CityException deleteHasHotels() {
        return new CityException(CITY_HAS_HOTELS_ASSIGNED);
    }
}
