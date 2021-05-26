import React, {useState} from "react";
import {useHistory, useLocation} from "react-router";
import {withNamespaces} from "react-i18next";
import {Configuration, DefaultApi} from "api-client";
import {Link, useParams} from "react-router-dom";
import {Form, Formik} from 'formik';
import PasswordComponent from "./PasswordComponent";
import BreadCrumb from "../BreadCrumb";
import {useNotificationCustom, useNotificationDangerAndLong, useNotificationSuccessAndShort} from "../Notification/NotificationProvider";
import {useDialogPermanentChange} from "../CriticalOperations/CriticalOperationProvider";
import {dialogDuration, dialogType} from "../Notification/Notification";
import EmailComponent from "./EmailComponent";
import FirstnameComponent from "./FirstnameComponent";
import LastnameComponent from "./LastnameComponent";
import ContactNumberComponent from "./ContactNumberComponent";
import {useLocale} from "../LoginContext";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {Button} from "react-bootstrap";
import {rolesConstant} from "../../Constants";

function EditOtherAccountForm({t, i18n}) {
    const dispatchNotification = useNotificationCustom();
    const dispatchCriticalDialog = useDialogPermanentChange();
    const history = useHistory();
    let {code} = useParams();
    const conf = new Configuration()
    const api = new DefaultApi(conf)
    const {token, setToken} = useLocale();
    const [etag, setETag] = useState();
    const [etagRole, setETagRole] = useState();
    const location = useLocation();
    const [roles, setRoles] = useState("");
    const dispatchNotificationSuccess = useNotificationSuccessAndShort();
    const dispatchNotificationDanger = useNotificationDangerAndLong();
    const dispatchDialog = useDialogPermanentChange();

    const getRoles = async () => {
        return await api.getUserRole(location.login, {headers: {Authorization: "Bearer " + token}});
    }

    const isRole = (role) => {
        return roles.includes(role);
    }

    React.useEffect(() => {
        handleDataFetch();
    }, []);

    const handleDataFetch = () => {
        if (token) {
            getEtag().then(r => setETag(r));
            getEtagRole(location.login).then(r => setETagRole(r));
            getRoles().then(res => {
                console.log(res.data);
                let data = "";
                let i;
                for(i = 0; i < res.data.rolesGranted.length; i++) {
                    data += res.data.rolesGranted[i].roleName + ", ";
                }
                data = data.slice(0, data.length-2)
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

    const getEtag = async () => {
        const response = await fetch("/resources/accounts/user", {
            method: "GET",
            headers: {
                Authorization: token,
            },
        });
        return response.headers.get("ETag");
    };

    const getEtagRole = async (login) => {
        const response = await fetch("/" + login + "/role", {
            method: "GET",
            headers: {
                Authorization: token,
            },
        });
        return response.headers.get("ETag");
    };

    const addRole = (role) => (
        api.grantAccessLevel(location.login, role, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                "If-Match": etagRole
            }
        }).then(res => {
            dispatchNotificationSuccess({message: i18n.t('roleGrant.success')})
        }).catch(err => {
            dispatchNotificationDanger({message: i18n.t(err.response.data.message)})
        })
    )

    const revokeRole = (role) => (
        api.revokeAccessLevel(location.login, role, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                "If-Match": etagRole
            }
        }).then((res) => {
            dispatchNotificationSuccess({message: i18n.t('roleRevoke.success')})
        }).catch(err => {
            dispatchNotificationDanger({message: i18n.t(err.response.data.message)})
        })
    )

    const handleAddRoleClient = e => {
        e.preventDefault()
        dispatchDialog({
            callbackOnSave: () => {
                addRole(rolesConstant.client)
            },
            callbackOnCancel: () => {
                console.log("Cancel")
            },
        })
    }

    const handleAddRoleManager = e => {
        e.preventDefault()
        dispatchDialog({
            callbackOnSave: () => {
                addRole(rolesConstant.manager)
            },
            callbackOnCancel: () => {
                console.log("Cancel")
            },
        })
    }

    const handleAddRoleAdmin = e => {
        e.preventDefault()
        dispatchDialog({
            callbackOnSave: () => {
                addRole(rolesConstant.admin)
            },
            callbackOnCancel: () => {
                console.log("Cancel")
            },
        })
    }

    const handleRevokeRoleClient = e => {
        e.preventDefault()
        dispatchDialog({
            callbackOnSave: () => {
                revokeRole(rolesConstant.client)
            },
            callbackOnCancel: () => {
                console.log("Cancel")
            },
        })
    }

    const handleRevokeRoleManager = e => {
        e.preventDefault()
        dispatchDialog({
            callbackOnSave: () => {
                revokeRole(rolesConstant.manager)
            },
            callbackOnCancel: () => {
                console.log("Cancel")
            },
        })
    }

    const handleRevokeRoleAdmin = e => {
        e.preventDefault()
        dispatchDialog({
            callbackOnSave: () => {
                revokeRole(rolesConstant.admin)
            },
            callbackOnCancel: () => {
                console.log("Cancel")
            },
        })
    }

    const handleEmailConfirmation = (values, setSubmitting) => (
        dispatchCriticalDialog({
            callbackOnSave: () => handleEmailSubmit(values, setSubmitting),
            callbackOnCancel: () => setSubmitting(false)
        })
    )

    const handlePasswordConfirmation = (values, setSubmitting) => (
        dispatchCriticalDialog({
            callbackOnSave: () => handlePasswordSubmit(values, setSubmitting),
            callbackOnCancel: () => setSubmitting(false)
        })
    )

    const handleDetailsConfirmation = (values, setSubmitting) => (
        dispatchCriticalDialog({
            callbackOnSave: () => handleDetailsSubmit(values, setSubmitting),
            callbackOnCancel: () => setSubmitting(false)
        })
    )

    const handleEmailSubmit = (values, setSubmitting) => {
        api.editOtherAccountEmail(location.login, {newEmail: values.email}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                "If-Match": etag
            }
        }).then((res) => {
            dispatchNotification({
                dialogType: dialogType.SUCCESS,
                dialogDuration: dialogDuration.SHORT,
                message: t('editOtherAccount.success.email'),
                title: t('operationSuccess')
            })
        }).catch(err => {
            dispatchNotification({
                dialogType: dialogType.DANGER,
                dialogDuration: dialogDuration.SHORT,
                message: t(err.response.data.message),
                title: t('operationError')
            })
            setSubmitting(false);
        });
    }

    const handlePasswordSubmit = (values, setSubmitting) => {
        api.changeOtherPassword({login: location.login, oldPassword: values.oldPassword, newPassword: values.newPassword}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                "If-Match": etag
            }
        }).then((res) => {
            dispatchNotification({
                dialogType: dialogType.SUCCESS,
                dialogDuration: dialogDuration.SHORT,
                message: t('editOtherAccount.success.password'),
                title: t('operationSuccess')
            })
        }).catch(err => {
            dispatchNotification({
                dialogType: dialogType.DANGER,
                dialogDuration: dialogDuration.SHORT,
                message: t(err.response.data.message),
                title: t('operationError')
            })
            setSubmitting(false);
        });
    }

    const handleDetailsSubmit = (values, setSubmitting) => {
        api.editOtherAccountDetails(location.login, {firstname: values.firstname, lastname: values.lastname, contactNumber: values.contactNumber}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                "If-Match": etag
            }
        }).then((res) => {
            dispatchNotification({
                dialogType: dialogType.SUCCESS,
                dialogDuration: dialogDuration.SHORT,
                message: t('editOtherAccount.success.details'),
                title: t('operationSuccess')
            })
        }).catch(err => {
            dispatchNotification({
                dialogType: dialogType.DANGER,
                dialogDuration: dialogDuration.SHORT,
                message: t(err.response.data.message),
                title: t('operationError')
            })
            setSubmitting(false);
        });
    }

    return (
        <div className="container">
            <BreadCrumb>
                <li className="breadcrumb-item"><Link to="/">{t('mainPage')}</Link></li>
                <li className="breadcrumb-item"><Link to="/userPage">{t('adminDashboard')}</Link></li>
                <li className="breadcrumb-item"><Link to="/accounts">{t('accountList')}</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{t('userEdit')}</li>
            </BreadCrumb>

            <div className="floating-box" style={{minWidth: "30rem", minHeight: "30rem"}}>
                <div>
                    <h1 className="h3 mb-0.5">{t('userEdit')}</h1>
                    <Button className="btn btn-secondary" style={{backgroundColor: "#7749F8", width: "20%", margin: "auto"}} onClick={event => {handleDataFetch()}}>{t("refresh")}</Button>
                    <div style={{color: "#7749F8", fontSize: 14, marginBottom: "0.5rem"}}>
                        {t('obligatoryFields')}
                    </div>
                    <div className="container">
                        <Tabs defaultActiveKey="tab1" className="categories m-3">
                            <Tab eventKey="tab1" title={t('editEmail')}>
                                <Formik
                                    initialValues={{email: ''}}
                                    validate={values => {
                                        const errors = {};
                                        let mailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                        if (!values.email) {
                                            errors.email = t('editOtherAccountForm.error.email.required');
                                        } else if (values.email.length > 127 || values.email.length < 6) {
                                            errors.email = t('editOtherAccountForm.error.email.length');
                                        }
                                          else if (!mailPattern.test(values.email)){
                                            errors.email = t('editOtherAccountForm.error.email.pattern');
                                        }
                                        return errors;
                                    }}
                                    onSubmit={(values, {setSubmitting}) => handleEmailConfirmation(values, setSubmitting)}>
                                    {({isSubmitting, handleChange}) => (
                                        <Form className={{alignItems: "center"}}>
                                            <EmailComponent name="email" placeholder={t('emailAddress')}
                                                handleChange={handleChange}/>
                                            <button className="btn btn-lg btn-primary btn-block mt-2"
                                                    type="submit" disabled={isSubmitting}
                                                    style={{backgroundColor: "#7749F8", width: "70%", margin: "auto"}}>
                                                {t('changeEmail')}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </Tab>
                            <Tab eventKey="tab2" title={t('editPassword')}>
                                <Formik
                                    initialValues={{newPassword: '', repeatedNewPassword: ''}}
                                    validate={values => {
                                        const errors = {};
                                        if (!values.newPassword) {
                                            errors.newPassword = t('editOtherAccountForm.password.error.required');
                                        } else if (values.newPassword.length > 64 || values.newPassword.length < 8) {
                                            errors.newPassword = t('editOtherAccountForm.password.error.length');
                                        }

                                        if (!values.repeatedNewPassword) {
                                            errors.repeatedNewPassword = t('editOtherAccountForm.password.error.repeated.required');
                                        } else if (values.repeatedNewPassword.length > 64 || values.repeatedNewPassword.length < 8) {
                                            errors.repeatedNewPassword = t('editOtherAccountForm.password.error.length');
                                        }

                                        if (!(values.repeatedNewPassword === values.newPassword)) {
                                            errors.repeatedNewPassword = t('editOtherAccountForm.password.error.match');
                                        }
                                        return errors;
                                    }}
                                    onSubmit={(values, {setSubmitting}) => handlePasswordConfirmation(values, setSubmitting)}>
                                    {({isSubmitting, handleChange}) => (
                                        <Form className={{alignItems: "center"}}>
                                            <PasswordComponent name="newPassword" placeholder={t('password')}
                                                handleChange={handleChange}/>
                                            <PasswordComponent name="repeatedNewPassword" placeholder={t('repeatPassword')}
                                                handleChange={handleChange}/>
                                            <button className="btn btn-lg btn-primary btn-block mt-2"
                                                    type="submit" disabled={isSubmitting}
                                                    style={{backgroundColor: "#7749F8", width: "70%", margin: "auto"}}>
                                                {t('changePassword')}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </Tab>
                            <Tab eventKey="tab3" title={t('editDetails')}>
                                <Formik
                                    initialValues={{firstname: '', lastname: '', contactNumber: ''}}
                                    validate={values => {
                                        const errors = {};
                                        let firstnamePattern = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
                                        let lastnamePattern = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
                                        let contactNumberPattern = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/;
                                        if (!values.firstname) {
                                            errors.firstname = t('editOtherAccountForm.firstname.error.required');
                                        } else if (values.firstname.length > 31 || values.firstname.length < 3) {
                                            errors.firstname = t('editOtherAccountForm.firstname.error.length');
                                        } else if (!firstnamePattern.test(values.firstname)) {
                                            errors.firstname = t('editOtherAccountForm.firstname.error.pattern');
                                        }

                                        if (!values.lastname) {
                                            errors.lastname = t('editOtherAccountForm.lastname.error.required');
                                        } else if (values.lastname.length > 31 || values.lastname.length < 2) {
                                            errors.lastname = t('editOtherAccountForm.lastname.error.length');
                                        } else if (!lastnamePattern.test(values.lastname)) {
                                            errors.lastname = t('editOtherAccountForm.lastname.error.pattern');
                                        }

                                        if (!values.contactNumber) {
                                            errors.contactNumber = t('editOtherAccountForm.contactNumber.error.required');
                                        } else if (values.contactNumber.length > 15 || values.contactNumber.length < 9) {
                                            errors.contactNumber = t('editOtherAccountForm.contactNumber.error.length');
                                        } else if (!contactNumberPattern.test(values.contactNumber)) {
                                            errors.contactNumber = t('editOtherAccountForm.contactNumber.error.pattern');
                                        }
                                        return errors;
                                    }}
                                    onSubmit={(values, {setSubmitting}) => handleDetailsConfirmation(values, setSubmitting)}>
                                    {({isSubmitting, handleChange}) => (
                                        <Form className={{alignItems: "center"}}>
                                            <FirstnameComponent name="firstname" placeholder={t('name')}
                                                handleChange={handleChange}/>
                                            <LastnameComponent name="lastname" placeholder={t('surname')}
                                                handleChange={handleChange}/>
                                            <ContactNumberComponent name="contactNumber" placeholder={t('phoneNumber')}
                                                handleChange={handleChange}/>
                                            <button className="btn btn-lg btn-primary btn-block mt-2"
                                                    type="submit" disabled={isSubmitting}
                                                    style={{backgroundColor: "#7749F8", width: "70%", margin: "auto"}}>
                                                {t('changeDetails')}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </Tab>
                            <Tab eventKey="tab4" title={t('editRoles')}>
                                {!isRole(rolesConstant.client) &&
                                <button className="btn btn-lg btn-primary btn-block" type="submit"
                                        style={{backgroundColor: "forestgreen", marginBottom: "1rem"}}
                                        onClick={handleAddRoleClient}>
                                    {t('addRoleClient')}
                                </button>
                                }
                                {isRole(rolesConstant.client) &&
                                <button className="btn btn-lg btn-primary btn-block" type="submit"
                                        style={{backgroundColor: "indianred", marginBottom: "1rem"}}
                                        onClick={handleRevokeRoleClient}>
                                    {t('revokeRoleClient')}
                                </button>
                                }
                                {!isRole(rolesConstant.manager) &&
                                <button className="btn btn-lg btn-primary btn-block" type="submit"
                                        style={{backgroundColor: "forestgreen", marginBottom: "1rem"}}
                                        onClick={handleAddRoleManager}>
                                    {t('addRoleManager')}
                                </button>
                                }
                                {isRole(rolesConstant.manager) &&
                                <button className="btn btn-lg btn-primary btn-block" type="submit"
                                        style={{backgroundColor: "indianred", marginBottom: "1rem"}}
                                        onClick={handleRevokeRoleManager}>
                                    {t('revokeRoleManager')}
                                </button>
                                }
                                {!isRole(rolesConstant.admin) &&
                                <button className="btn btn-lg btn-primary btn-block" type="submit"
                                        style={{backgroundColor: "forestgreen", marginBottom: "1rem"}}
                                        onClick={handleAddRoleAdmin}>
                                    {t('addRoleAdmin')}
                                </button>
                                }
                                {isRole(rolesConstant.admin) &&
                                <button className="btn btn-lg btn-primary btn-block" type="submit"
                                        style={{backgroundColor: "indianred", marginBottom: "1rem"}}
                                        onClick={handleRevokeRoleAdmin}>
                                    {t('revokeRoleAdmin')}
                                </button>
                                }
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withNamespaces()(EditOtherAccountForm);