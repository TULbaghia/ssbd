import React, {useState} from "react";
import {withNamespaces} from "react-i18next";
import {Button, Col, Container, Row} from "react-bootstrap";
import "../css/UserInfo.css";
import {useLocale} from "./LoginContext";

import BreadCrumb from "./Partial/BreadCrumb";
import {Link} from "react-router-dom";
import {api} from "../Api";
import {useHistory} from "react-router";
import {dateConverter} from "../i18n";
import {useNotificationSuccessAndShort} from "./Utils/Notification/NotificationProvider";

function UserInfo(props) {
    const {t, i18n} = props;
    const history = useHistory();
    const {token, setToken} = useLocale();
    const [data, setData] = useState({
        login: "",
        email: "",
        firstname: "",
        lastname: "",
        contactNumber: "",
        lastSuccessfulLoginIpAddress: "",
        lastSuccessfulLoginDate: "",
        lastFailedLoginDate: ""
    });

    const [roles, setRoles] = useState("");
    const dispatchNotificationSuccess = useNotificationSuccessAndShort();

    React.useEffect(() => {
        handleDataFetch();
    }, []);

    const handleDataFetch = (firstTime = true) => {
        let firstGet = false
        if (token) {
            getUser().then(res => {
                console.log(res.data);
                if (res.data.lastFailedLoginDate !== undefined && res.data.lastSuccessfulLoginDate !== undefined) {
                    setData({
                        ...res.data,
                        lastSuccessfulLoginDate: dateConverter(res.data.lastSuccessfulLoginDate.slice(0, -5)),
                        lastFailedLoginDate: dateConverter(res.data.lastFailedLoginDate.slice(0, -5))
                    });
                } else if (res.data.lastSuccessfulLoginDate !== undefined) {
                    setData({
                        ...res.data,
                        lastSuccessfulLoginDate: dateConverter(res.data.lastSuccessfulLoginDate.slice(0, -5))
                    });
                } else if (res.data.lastFailedLoginDate !== undefined) {
                    setData({
                        ...res.data,
                        lastFailedLoginDate: dateConverter(res.data.lastFailedLoginDate.slice(0, -5))
                    });
                } else {
                    setData(
                        res.data
                    );
                }
                firstGet = true
            }).catch(err => {
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
                if (firstGet == true && firstTime != true) {
                    dispatchNotificationSuccess({message: i18n.t('dataRefresh')})
                }
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
        return await api.showAccountInformation({headers: {Authorization: token}});
    }

    const getRoles = async () => {
        return await api.getSelfRole({headers: {Authorization: token}});
    }

    return (
        <div className="container-fluid">
            <BreadCrumb>
                <li className="breadcrumb-item"><Link to="/">{t('mainPage')}</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{t('accountInfo')}</li>
            </BreadCrumb>
            <Container>
                <Row>
                    <Col xs={12} sm={12} md={10} lg={8} xl={7} className={"floating-no-absolute py-4 mx-auto mb-2"}>
                        <h1>{t("userDetailsTitle")}</h1>
                        <table className={"table w-100"}>
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
                            <Button variant="purple" onClick={event => {
                                history.push("/editOwnAccount")
                            }}>{t("userDetailsEditBtn")}</Button>
                            <Button variant="secondary" onClick={event => {
                                handleDataFetch(false)
                            }}>{t("refresh")}</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default withNamespaces()(UserInfo);
