package pl.lodz.p.it.ssbd2021.ssbd06.controllers;

import pl.lodz.p.it.ssbd2021.ssbd06.exceptions.AppBaseException;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.dto.GenerateReportDto;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.dto.HotelDto;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.dto.NewHotelDto;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.dto.UpdateHotelDto;
import pl.lodz.p.it.ssbd2021.ssbd06.moh.endpoints.interfaces.HotelEndpointLocal;
import pl.lodz.p.it.ssbd2021.ssbd06.security.EtagValidatorFilterBinding;
import pl.lodz.p.it.ssbd2021.ssbd06.security.MessageSigner;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Kontroler odpowiadający za zarządzanie hotelami.
 */
@Path("/hotels")
public class HotelController extends AbstractController {

    @Inject
    private HotelEndpointLocal hotelEndpointLocal;

    @Inject
    private MessageSigner messageSigner;

    /**
     * Zwraca hotel o podanym identyfikatorze
     *
     * @param id identyfikator hotelu
     * @throws AppBaseException podczas błędu związanego z pobieraniem hotelu
     * @return dto hotelu
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public HotelDto get(@PathParam("id") Long id) throws AppBaseException {
        return repeat(() -> hotelEndpointLocal.get(id), hotelEndpointLocal);
    }

    /**
     * Zwraca listę hoteli
     *
     * @throws AppBaseException podczas błędu związanego z pobieraniem listy hoteli
     * @return lista dto hoteli
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<HotelDto> getAll() throws AppBaseException {
        return repeat(() -> hotelEndpointLocal.getAll(), hotelEndpointLocal);
    }

    /**
     * Wyszukaj hotel
     *
     * @param option opcje hotelu
     * @throws AppBaseException podczas błędu związanego z wyszukiwaniem hotelu
     * @return dto hotelu
     */
    @GET
    @Path("/look/{option}")
    public List<HotelDto> lookForHotel(@PathParam("option") String option) throws AppBaseException {
        return repeat(() -> hotelEndpointLocal.lookForHotel(option), hotelEndpointLocal);
    }

    /**
     * Zwraca listę hoteli po przefiltrowaniu
     *
     * @throws AppBaseException podczas błędu związanego z listą hoteli
     * @return lista dto hoteli
     */
    @GET
    @Path("/filter/{option}")
    public List<HotelDto> getAllFilter(@PathParam("option") String option) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Dodaje hotel
     *
     * @param hotelDto dto z danymi hotelu
     * @throws AppBaseException podczas błędu związanego z dodawaniem hotelu
     */
    @POST
    @RolesAllowed("addHotel")
    public void addHotel(NewHotelDto hotelDto) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Usuwa hotel
     *
     * @param hotelId identyfikator hotelu
     * @throws AppBaseException podczas błędu związanego z usuwaniem hotelu
     */
    @DELETE
    @RolesAllowed("deleteHotel")
    public void deleteHotel(Long hotelId) throws AppBaseException {
        repeat(() -> hotelEndpointLocal.deleteHotel(hotelId), hotelEndpointLocal);
    }

    /**
     * Przypisuje managera (po loginie) do hotelu
     *
     * @param hotelId identyfikator hotelu
     * @param managerLogin login managera którego przypisać do hotelu
     * @throws AppBaseException podczas błędu związanego z przypisywaniem managera do hotelu
     */
    @PATCH
    @RolesAllowed("addManagerToHotel")
    @Path("/add/{managerLogin}/{hotelId}")
    public void addManagerToHotel(@PathParam("hotelId") Long hotelId, @PathParam("managerLogin") String managerLogin) throws AppBaseException {
        repeat(() -> hotelEndpointLocal.addManagerToHotel(hotelId, managerLogin), hotelEndpointLocal);
    }

    /**
     * Usuwa managera (po loginie) z hotelu
     *
     * @param managerLogin login managera którego przypisać do hotelu
     * @throws AppBaseException podczas błędu związanego z usunięciem managera z hotelu
     */
    @PATCH
    @RolesAllowed("deleteManagerFromHotel")
    @Path("/remove/{managerLogin}")
    public void deleteManagerFromHotel(@PathParam("managerLogin") String managerLogin) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Generuje raport nt. działalności hotelu
     *
     * @param hotelId identyfikator hotelu
     * @param from data od
     * @param to data do
     * @return dane potrzebne do wygenerowania raportu
     */
    @GET
    @RolesAllowed("generateReport")
    @Path("/raport/{hotelId}/{from}/{to}")
    public GenerateReportDto generateReport(@PathParam("hotelId") Long hotelId, @PathParam("from") String from, @PathParam("to") String to) throws AppBaseException {
        throw new UnsupportedOperationException();
    }

    /**
     * Modyfikuje hotel managera.
     *
     * @param hotelDto dto z danymi hotelu
     * @throws AppBaseException podczas błędu związanego z bazą danych
     */
    @PUT
    @Path("/edit")
    @RolesAllowed("updateOwnHotel")
    @EtagValidatorFilterBinding
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateOwnHotel(@Valid UpdateHotelDto hotelDto) throws AppBaseException {
        repeat(() -> hotelEndpointLocal.updateOwnHotel(hotelDto), hotelEndpointLocal);
    }


    /**
     * Modyfikuje dowolny hotel.
     *
     * @param id identyfikator hotelu.
     * @param hotelDto dto z danymi hotelu.
     * @throws AppBaseException podczas błędu związanego z bazą danych.
     */
    @PUT
    @Path("/edit/{id}")
    @RolesAllowed("updateOtherHotel")
    @EtagValidatorFilterBinding
    @Consumes(MediaType.APPLICATION_JSON)
    public void updateOtherHotel(@PathParam("id") Long id, @Valid UpdateHotelDto hotelDto) throws AppBaseException {
        repeat(() -> hotelEndpointLocal.updateOtherHotel(id, hotelDto), hotelEndpointLocal);
    }

    /**
     * Zwraca dane konkretnego użytkownika.
     *
     * @return odpowiedź z danymi hotelu i wartością Etag.
     * @throws AppBaseException podczas wystąpienia problemu z bazą danych.
     */
    @GET
    @RolesAllowed("getOwnHotelInfo")
    @Path("/info")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOwnHotelInfo() throws AppBaseException {
        HotelDto hotelDto = repeat(() -> hotelEndpointLocal.getOwnHotelInfo(), hotelEndpointLocal);
        return Response.ok()
                .entity(hotelDto)
                .header("ETag", messageSigner.sign(hotelDto))
                .build();
    }

    /**
     * Zwraca dane konkretnego użytkownika.
     *
     * @param id identyfikator hotelu.
     * @return odpowiedź z danymi hotelu i wartością Etag.
     * @throws AppBaseException podczas wystąpienia problemu z bazą danych.
     */
    @GET
    @RolesAllowed("getOtherHotelInfo")
    @Path("/info/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOtherHotelInfo(@PathParam("id") Long id) throws AppBaseException {
        HotelDto hotelDto = repeat(() -> hotelEndpointLocal.getOtherHotelInfo(id), hotelEndpointLocal);
        return Response.ok()
                .entity(hotelDto)
                .header("ETag", messageSigner.sign(hotelDto))
                .build();
    }
}
