import {withNamespaces} from 'react-i18next';
import BreadCrumb from "./Partial/BreadCrumb";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import DataTable from "react-data-table-component"
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useLocale} from "./LoginContext";
import {api} from "../Api";
import {useDialogPermanentChange} from "./Utils/CriticalOperations/CriticalOperationProvider";
import {
    useNotificationDangerAndInfinity,
    useNotificationSuccessAndShort
} from "./Utils/Notification/NotificationProvider";
import {useHistory} from "react-router";
import {ResponseErrorHandler} from "./Validation/ResponseErrorHandler";
import {useThemeColor} from './Utils/ThemeColor/ThemeColorProvider';

const FilterComponent = ({filterText, onFilter, placeholderText}) => (
    <>
        <Form>
            <Form.Control type="text" value={filterText} onChange={onFilter} placeholder={placeholderText}/>
        </Form>
    </>
);


function UserList(props) {
    const {t, i18n} = props
    const history = useHistory()
    const {token, setToken} = useLocale();
    const [filterText, setFilterText] = React.useState('');
    const themeColor = useThemeColor()
    const [data, setData] = useState([
        {
            login: "",
            email: "",
            firstname: "",
            lastname: "",
            enabled: true,
            active: false,
        }
    ]);
    const dispatchDialog = useDialogPermanentChange();
    const dispatchNotificationSuccess = useNotificationSuccessAndShort();
    const dispatchNotificationDanger = useNotificationDangerAndInfinity();
    const filteredItems = data.filter(item => {
        return item.firstname && item.firstname.toLowerCase().includes(filterText.toLowerCase())
            || item.lastname && item.lastname.toLowerCase().includes(filterText.toLowerCase());
    });

    const columns = [
        {
            name: 'Login',
            selector: 'login',
            sortable: true,
        },
        {
            name: 'E-mail',
            selector: 'email',
            sortable: true,
        },
        {
            name: t('name'),
            selector: 'firstname',
            sortable: true,
        },
        {
            name: t('surname'),
            selector: 'lastname',
            sortable: true,
        },
        {
            name: t('unlocked'),
            selector: 'enabled',
            cell: row => {
                const checked = row.enabled;
                return (
                    <div style={{margin: "auto"}}>
                        <Form.Check defaultChecked={checked} onChange={event => {
                            let value = event.target.checked;
                            dispatchDialog({
                                callbackOnSave: () => {
                                    value ? unblockAccount(row.login) : blockAccount(row.login)
                                },
                                callbackOnCancel: () => {
                                    console.log("Cancel")
                                    event.target.checked = !value;
                                },
                            })
                        }}/>
                    </div>
                )
            },
        },
        {
            name: t('active'),
            selector: 'confirmed',
            cell: row => {
                let color = row.confirmed ? "green" : "grey";
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill={color}
                         className="bi bi-check" viewBox="0 0 16 16">
                        <path
                            d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                    </svg>
                )
            },
        },
        {
            name: t('edit'),
            selector: 'edit',
            cell: row => {
                return (
                    <Button className="btn-sm" variant="purple" onClick={event => {
                        history.push('/editOtherAccount?login=' + row.login);
                    }}>{t("edit")}</Button>
                )
            },
        },
        {
            name: t('details'),
            selector: 'details',
            cell: row => {
                return(
                    <Button className="btn-sm" variant="purple" onClick={event => {
                        history.push('/accounts/userInfo?login=' + row.login);
                    }}>{t('details')}</Button>
                )
            }
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        if (token) {
            getAllAccounts().then(r => {
                console.log(r);
                setData(r.data);
            }).catch(r => {
                if (r.response != null) {
                    if (r.response.status === 403) {
                        history.push("/errors/forbidden")
                    } else if (r.response.status === 500) {
                        history.push("/errors/internal")
                    }
                }
                console.log(r)
            });
        }
    }

    const getAllAccounts = async () => {
        return await api.getAllAccountsList({headers: {Authorization: token}})
    }

    const getUserData = async (login) => {
        const response = await api.showAccount(login, {
            method: "GET",
            headers: {
                Authorization: token,
            }
        })
        return response;
    };

    const blockAccount = (login) => {
        getUserData(login).then(res => {
            let userData = data.filter(x => x.login === login)[0];
            if (res.data.enabled !== userData.enabled) {
                dispatchNotificationDanger({message: i18n.t("exception.database_query_exception.concurrent_operation")})
            } else {
                api.blockAccount(login, {headers: {Authorization: token, "If-Match": res.headers.etag}}).then(res => {
                    dispatchNotificationSuccess({message: i18n.t('accountBlockSuccess')})
                }).catch(err => {
                    if (err.response != null) {
                        if (err.response.status === 403) {
                            history.push("/errors/forbidden")
                        } else if (err.response.status === 500) {
                            history.push("/errors/internal")
                        }
                    }
                    dispatchNotificationDanger({message: i18n.t(err.response.data.message)})
                }).finally(() => fetchData());
            }
        })
    }

    const unblockAccount = (login) => {
        getUserData(login).then(res => {
            let userData = data.filter(x => x.login === login)[0];
            if (res.data.enabled !== userData.enabled) {
                dispatchNotificationDanger({message: i18n.t("exception.database_query_exception.concurrent_operation")})
            } else {
                api.unblockAccount(login, {headers: {Authorization: token, "If-Match": res.headers.etag}}).then(res => {
                    dispatchNotificationSuccess({message: i18n.t('accountUnblockSuccess')})
                }).catch(err => {
                    if (err.response != null) {
                        if (err.response.status === 403) {
                            history.push("/errors/forbidden")
                        } else if (err.response.status === 500) {
                            history.push("/errors/internal")
                        }
                    }
                    dispatchNotificationDanger({message: i18n.t(err.response.data.message)})
                }).finally(() => fetchData());
            }
        });
    }

    const subHeaderComponentMemo = React.useMemo(() => {

        return <FilterComponent onFilter={e => {
            setFilterText(e.target.value);
        }} filterText={filterText} placeholderText={t('filterPhase')}/>;
    }, [filterText]);

    return (
        <div className="container-fluid">
            <BreadCrumb>
                <li className="breadcrumb-item"><Link to="/">{t('mainPage')}</Link></li>
                <li className="breadcrumb-item"><Link to="/">{t('adminDashboard')}</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{t('accountList')}</li>
            </BreadCrumb>
            <Container>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className={"floating-no-absolute py-4 mx-auto mb-2"}>
                        <div>
                            <div>
                                <h1 className="float-left">{t('userList')}</h1>
                                <Button className="btn-secondary float-right m-2" onClick={event => {
                                    getAllAccounts().then(res => {
                                        setData(res.data);
                                        setFilterText('')
                                        dispatchNotificationSuccess({message: i18n.t('dataRefresh')})
                                    }).catch(err => {
                                        ResponseErrorHandler(err, dispatchNotificationDanger)
                                    })
                                }}>{t("refresh")}</Button>
                            </div>
                            <DataTable className={"rounded-0"}
                                       noDataComponent={i18n.t('table.no.result')}
                                       columns={columns}
                                       data={filteredItems}
                                       subHeader
                                       noHeader={true}
                                       theme={themeColor === 'light' ? 'lightMode' : themeColor}
                                       subHeaderComponent={subHeaderComponentMemo}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default withNamespaces()(UserList);
