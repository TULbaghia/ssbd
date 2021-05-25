import {Dropdown, Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useHistory} from "react-router-dom";
import {useLocale} from "../LoginContext";
import {withNamespaces} from 'react-i18next';
import {library} from "@fortawesome/fontawesome-svg-core";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import "../../css/Navbar.css";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import axios from "axios";
import ThemeColorSwitcher from "../Utils/ThemeColor/ThemeColorSwitcher";

library.add(faUser);

function LanguageSwitcher(props) {

    const {t, i18n} = props
    const {token, setToken} = useLocale();

    const langs = ['pl', 'en']

    const handleClickPl = () => {
        setLanguage(i18n, "pl")
    }

    const handleClickEn = () => {
        setLanguage(i18n, "en")
    }

    const handleClickLoggedPl = () => {
        handleClickPl()
        axios.post('/resources/accounts/self/edit/language/pl', null, {
            headers: {
                Authorization: token
            }
        })
    }

    const handleClickLoggedEn = () => {
        handleClickEn()
        axios.post('/resources/accounts/self/edit/language/en', null, {
            headers: {
                Authorization: token
            }
        })
    }

    return (
        <>
            <Dropdown>
                <DropdownToggle id="dropdown-basic" className="dropButton" variant="Info">
                    <span style={{marginRight: "10px"}}>{i18n.t("language")} [{i18n.language.toUpperCase()}]</span>
                </DropdownToggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={token !== null && token !== '' ? (
                            handleClickLoggedPl)
                        : (
                            handleClickPl)}>{t(langs[0])}</Dropdown.Item>
                    <Dropdown.Item onClick={token !== null && token !== '' ? (
                            handleClickLoggedEn)
                        : (
                            handleClickEn)}>{t(langs[1])}</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

function NavigationBar(props) {
    const {t, divStyle, i18n} = props
    const history = useHistory();
    const {token, username, setToken, currentRole, setCurrentRole, setUsername} = useLocale();

    const handleLogout = () => {
        history.push("/login")
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: token,
            }
        };
        fetch('/resources/auth/logout', requestOptions)
            .then((res) => {
                setToken('');
                setCurrentRole('');
                setUsername('');
                localStorage.removeItem('token')
                localStorage.removeItem('currentRole')
                localStorage.removeItem('username')
            })
            .catch(err => console.log(err))
    }

    // *** LANDING PAGE ***
    const {isAuthenticated} = props;
    return (
        <>
            {token !== null && token !== '' ? (
                //------------------------LOGGED USER VIEW----------------------------
                <Navbar expand="lg" className="main-navbar" style={divStyle()}>
                    <Navbar.Brand>
                        <div className="name">{t('animalHotel')}</div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <LinkContainer to="/">
                                <Nav.Link>{t('mainPage')}</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/hotels">
                                <Nav.Link>{t('hotels')}</Nav.Link>
                            </LinkContainer>
                            {currentRole === 'ADMIN' && (
                                <>
                                    <LinkContainer to="/accounts">
                                        <Nav.Link>{t('accountList')}</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/cities">
                                        <Nav.Link>{t('cityList')}</Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                            {currentRole === 'MANAGER' && (
                                <>
                                    <LinkContainer to="/myHotel">
                                        <Nav.Link>{t('myHotel')}</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/activeReservations">
                                        <Nav.Link>{t('activeReservations')}</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/archiveReservations">
                                        <Nav.Link>{t('archiveReservations')}</Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                            {currentRole === 'CLIENT' && (
                                <>
                                    <LinkContainer to="/cities">
                                        <Nav.Link>{t('cities')}</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/reservation">
                                        <Nav.Link>{t('reservation')}</Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                        </Nav>
                        <Nav className="navbar-right">
                            <ThemeColorSwitcher/>
                            <LanguageSwitcher t={t} i18n={i18n}/>
                            <Dropdown alignRight={true}>
                                <Dropdown.Toggle id="dropdown-basic" className="dropButton" variant="Info">
                                    <FontAwesomeIcon icon="user"/>
                                    {' '}{username}{' '}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <li>
                                        <a href="#/action-1" className="item">
                                            <LinkContainer to="/myAccount">
                                                <Nav.Link>{t('myAccount')}</Nav.Link>
                                            </LinkContainer>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#/action-2" className="item">
                                            <LinkContainer to="/changePassword">
                                                <Nav.Link>{t('changePassword')}</Nav.Link>
                                            </LinkContainer>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#/action-3" className="item">
                                            <LinkContainer to="/">
                                                <Nav.Link onSelect={handleLogout}>{t('signOut')}</Nav.Link>
                                            </LinkContainer>
                                        </a>
                                    </li>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            ) : (
                //------------------------GUEST VIEW----------------------------
                <Navbar expand="lg" className="main-navbar" style={divStyle()}>
                    <Navbar.Brand>
                        <LinkContainer to="/">
                            <div className="name"><span className={"text-dark"}>{t('animalHotel')}</span></div>
                        </LinkContainer>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <LinkContainer to="/">
                                <Nav.Link>{t('mainPage')}</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/hotels">
                                <Nav.Link>{t('hotels')}</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/regulations">
                                <Nav.Link>{t('regulations')}</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <Nav className="navbar-right">
                            <ThemeColorSwitcher/>
                            <LanguageSwitcher t={t} i18n={i18n}/>
                            <LinkContainer to="/signUp">
                                <Nav.Link className="signUp">
                                    <FontAwesomeIcon className="signUpIcon" icon="user-plus"/>
                                    <div className="signUpText">{t('signUp')}</div>
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/login">
                                <Nav.Link className="login">
                                    <FontAwesomeIcon className="loginIcon" icon="sign-in-alt"/>
                                    <div className="loginText">{t('signIn')}</div>
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            )}
        </>
    )
}

export function setLanguage(i18n, lang) {
    i18n.changeLanguage(lang)
}

export function getUserLanguage(token, i18n) {
    if (token !== null && token !== '') {
        axios.get('https://localhost:8181/resources/accounts/user', {
            headers: {
                Authorization: token
            }
        }).then(res => res.data)
            .then(data => data.language)
            .then(result => setLanguage(i18n, result))
    } else setLanguage(i18n, "en")
}

export default withNamespaces()(NavigationBar);