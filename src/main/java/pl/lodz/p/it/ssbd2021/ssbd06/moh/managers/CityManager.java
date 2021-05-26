package pl.lodz.p.it.ssbd2021.ssbd06.moh.managers;

import pl.lodz.p.it.ssbd2021.ssbd06.entities.City;
import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.AppBaseException;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.dto.CityDto;
import pl.lodz.p.it.ssbd2021.ssbd06.utils.common.LoggingInterceptor;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.interceptor.Interceptors;
import java.util.List;

/**
 * Manager odpowiadający za zarządzanie miastami.
 */
@Stateless
@Interceptors({LoggingInterceptor.class})
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class CityManager {
    /**
     * Zwraca miasto o podanym identyfikatorze
     *
     * @param id identyfikator miasta
     * @throws AppBaseException podczas błędu związanego z bazą danych
     * @return encja miasta
     */
    City get(Long id) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Zwraca listę miast
     *
     * @throws AppBaseException podczas błędu związanego z bazą danych
     * @return lista miast
     */
    List<City> getAll() throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Dodaje miasto
     *
     * @param cityDto dto z danymi miasta
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    void addCity(CityDto cityDto) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Modyfikuje miasto
     *
     * @param cityDto dto z danymi miasta
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    void updateCity(CityDto cityDto) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Usuwa miasto
     *
     * @param cityId identyfikator miasta
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    void deleteCity(Long cityId) throws AppBaseException {
        throw new UnsupportedOperationException();
    }
}