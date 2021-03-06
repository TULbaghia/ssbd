package pl.lodz.p.it.ssbd2021.ssbd06.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import pl.lodz.p.it.ssbd2021.ssbd06.entities.*;
import pl.lodz.p.it.ssbd2021.ssbd06.mok.dto.AdminDataDto;
import pl.lodz.p.it.ssbd2021.ssbd06.mok.dto.ClientDataDto;
import pl.lodz.p.it.ssbd2021.ssbd06.mok.dto.ManagerDataDto;
import pl.lodz.p.it.ssbd2021.ssbd06.mok.dto.RolesDto;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Odpowiada za operacje mapowania obiektów klas potomnych klasy Role
 */
@Mapper
public interface IRoleMapper {

    /**
     * Przeprowadza mapowanie z klasy ManagerData na klasę ManagerDataDto
     * @param managerData obiekt klasy ManagerData
     * @return zmapowany obiekt klasy ManagerDataDto
     */
    @Mappings({
            @Mapping(target = "hotelName", source = "hotel.name"),
            @Mapping(target = "id", source = "account.id")
    })
    ManagerDataDto toManagerDataDto(ManagerData managerData);

    /**
     * Przeprowadza mapowanie z klasy ClientData na klasę ClientDataDto
     * @param clientData obiekt klasy ClientData
     * @return zmapowany obiekt klasy ClientDataDto
     */
    @Mapping(target = "id", source = "account.id")
    ClientDataDto toClientDataDto(ClientData clientData);

    /**
     * Przeprowadza mapowanie z klasy AdminData na klasę AdminDataDto
     * @param adminData obiekt klasy AdminData
     * @return zmapowany obiekt klasy AdminDataDto
     */
    @Mapping(target = "id", source = "account.id")
    AdminDataDto toAdminDataDto(AdminData adminData);

    /**
     * Przeprowadza proces mapowania z klasy Role na klasę RoleDto
     * @param role obiekt klasy Role
     * @return zmapowany obiekt klasy RolesDto
     */
    @Mappings({
            @Mapping(target = "roleName", source = "accessLevel"),
            @Mapping(target = "version", source = "version")
    })
    RolesDto.SingleRoleDto toSingleRoleDto(Role role);

    /**
     * Przeprowadza proces mapowania z klasy Account na klasę RolesDto
     * @param account obiekt klasy Account
     * @return obiekt klasy RolesDto
     */
    default RolesDto toRolesDto(Account account) {
        List<RolesDto.SingleRoleDto> roleGranted = account.getRoleList().stream()
                .filter(Role::isEnabled)
                .map(this::toSingleRoleDto)
                .collect(Collectors.toList());
        List<RolesDto.SingleRoleDto> roleRevoked = account.getRoleList().stream()
                .filter(x -> !x.isEnabled())
                .map(this::toSingleRoleDto)
                .collect(Collectors.toList());
        return new RolesDto(account.getId(), roleGranted, roleRevoked);
    }
}
