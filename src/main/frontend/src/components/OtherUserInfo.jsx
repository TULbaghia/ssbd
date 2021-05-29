import React, {useState} from "react";
import {withNamespaces} from "react-i18next";
import {Button, Container} from "react-bootstrap";
import "../css/UserInfo.css";
import {useLocale} from "./LoginContext";

import BreadCrumb from "./Partial/BreadCrumb";
import {Link} from "react-router-dom";
import {api} from "../Api";
import {useHistory, useLocation} from "react-router";

function OtherUserInfo(props) {
    const {t, i18n} = props;
    const history = useHistory();
    const {token, setToken} = useLocale();
    const location = useLocation();
    const [data, setData] = useState({
        login: "",
        email: "",
        firstname: "",
        lastname: "",
        contactNumber: "",
        lastSuccessfulLoginIpAddress: "",
    });

    const [roles, setRoles] = useState("");

    React.useEffect(() => {
        handleDataFetch();
    }, []);

    const handleDataFetch = () => {
        if (token) {
            getUser().then(res => {
                console.log(res.data);
                setData(res.data);
            }).catch(err => {
                console.log(err);
                if (err.response != null) {
                    if (err.response.status === 403) {
                        history.push("/errors/forbidden");
                    } else if (err.response.status === 500) {
                        history.push("/errors/internal");
                    }
                }
            });
            getRoles().then(res => {
                console.log(res.data);
                let data = "";
                let i;
                for (i = 0; i < res.data.rolesGranted.length; i++) {
                    data += res.data.rolesGranted[i].roleName + ", ";
                }
                data = data.slice(0, data.length - 2)
                setRoles(data);
            }).catch(err => {
                if (err.response != null) {
                    if (err.response.status === 403) {
                        history.push("/errors/forbidden");
                    } else if (err.response.status === 500) {
                        history.push("/errors/internal");
                    }
                }
            });
        }
    }

    const getUser = async () => {
        return await api.showAccount(location.state.login, {headers: {Authorization: token}});
    }

    const getRoles = async () => {
        return await api.getUserRole(location.state.login, {headers: {Authorization: token}});
    }

    return (
        <div className="container">
            <BreadCrumb>
                <li className="breadcrumb-item"><Link to="/">{t('mainPage')}</Link></li>
                <li className="breadcrumb-item"><Link to="/">{t('adminDashboard')}</Link></li>
                <li className="breadcrumb-item active" aria-current="page"><Link to="/accounts">{t('accountList')}</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{t('otherUserDetailsTitle')}</li>
            </BreadCrumb>
            <Container className="main-wrapper floating-box">
                <h1>{t("otherUserDetailsTitle")}</h1>
                <table>
                    <thead/>
                    <tbody>
                    <tr>
                        <td>{t("userDetailsFirstname")}</td>
                        <td>{data.firstname}</td>
                    </tr>
                    <tr>
                        <td>{t("userDetailsLastname")}</td>
                        <td>{data.lastname}</td>
                    </tr>
                    <tr>
                        <td>{t("userDetailsEmail")}</td>
                        <td>{data.email}</td>
                    </tr>
                    <tr>
                        <td>{t("userDetailsLogin")}</td>
                        <td>{data.login}</td>
                    </tr>
                    <tr>
                        <td>{t("userDetailsContactNumber")}</td>
                        <td>{data.contactNumber}</td>
                    </tr>
                    <tr>
                        <td>{t("userDetailsRoles")}</td>
                        <td>{roles.split(", ").map(role => t(role)).join(", ")}</td>
                    </tr>
                    <tr>
                        <td>{t("lastSuccessfulLoginAddress")}</td>
                        <td>{data.lastSuccessfulLoginIpAddress}</td>
                    </tr>
                    <tr>
                        <td>{t("lastSuccessfulLoginDate")}</td>
                        <td>{data.lastSuccessfulLoginDate}</td>
                    </tr>
                    <tr>
                        <td>{t("lastFailedLoginIpAddress")}</td>
                        <td>{data.lastFailedLoginIpAddress}</td>
                    </tr>
                    <tr>
                        <td>{t("lastFailedLoginDate")}</td>
                        <td>{data.lastFailedLoginDate}</td>
                    </tr>
                    <tr>
                        <td>{t("language")}</td>
                        <td>{data.language}</td>
                    </tr>
                    </tbody>
                </table>
                <div className="main-wrapper-actions-container">
                    <Button className="btn-primary" onClick={event => {
                        history.push("/editOwnAccount")
                    }}>{t("userDetailsEditBtn")}</Button>
                    <Button className="btn-primary" onClick={event => {
                        handleDataFetch()
                    }}>{t("refresh")}</Button>
                </div>
            </Container>
        </div>
    );
}

export default withNamespaces()(OtherUserInfo);