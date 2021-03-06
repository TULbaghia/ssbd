import React from "react";
import {useHistory} from "react-router";
import {withNamespaces} from "react-i18next";
import {Link, useParams} from "react-router-dom";
import {Form, Formik} from 'formik';
import FieldComponent from "./FieldComponent";
import BreadCrumb from "../Partial/BreadCrumb";
import {useNotificationCustom, useNotificationDangerAndInfinity,} from "../Utils/Notification/NotificationProvider";
import {useDialogPermanentChange} from "../Utils/CriticalOperations/CriticalOperationProvider";
import {dialogDuration, dialogType} from "../Utils/Notification/Notification";
import {dispatchErrors, ResponseErrorHandler} from "../Validation/ResponseErrorHandler";
import {validatorFactory, ValidatorType} from "../Validation/Validators";
import {Col, Container, Row} from "react-bootstrap";
import {api} from "../../Api";

function PasswordResetForm({t, i18n}) {
    const dispatchNotification = useNotificationCustom();
    const dispatchNotificationDanger = useNotificationDangerAndInfinity();
    const dispatchCriticalDialog = useDialogPermanentChange();
    const history = useHistory();
    let {code} = useParams();


    const handleConfirmation = (values, setSubmitting) => (
        dispatchCriticalDialog({
            callbackOnSave: () => handleSubmit(values, setSubmitting),
            callbackOnCancel: () => setSubmitting(false)
        })
    )

    const handleSubmit = (values, setSubmitting) => {
        api.resetPassword({password: values.newPassword, resetCode: code}).then((res) => {
            dispatchNotification({
                dialogType: dialogType.SUCCESS,
                dialogDuration: dialogDuration.SHORT,
                message: t('passwordResetForm.success.info'),
                title: t('operationSuccess')
            })
            history.push("/login");
        }).catch(err => {
            ResponseErrorHandler(err, dispatchNotificationDanger, false, (error) => {
                dispatchErrors(error, dispatchNotificationDanger);
            });
            setSubmitting(false);
        });
    }

    return (
        <div className="mb-2 container-fluid">
            <BreadCrumb>
                <li className="breadcrumb-item"><Link to="/">{t('mainPage')}</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{t('passwordResetForm.error.title')}</li>
            </BreadCrumb>
            <Container>
                <Row>
                    <Col xs={12} sm={8} md={7} lg={6} xl={5} className={"floating-no-absolute py-4 mx-auto mb-2"}>
                        <div>
                            <div>
                                <h1 className="h3 mb-4">{t('passwordResetForm.error.title')}</h1>
                                <Formik
                                    initialValues={{newPassword: '', repeatedNewPassword: ''}}
                                    validate={values => {
                                        const errors = {};
                                        if (!values.newPassword) {
                                            errors.newPassword = t('passwordResetForm.error.required');
                                        } else {
                                            validatorFactory(values.newPassword, ValidatorType.PASSWORD).forEach(x => {
                                                errors.newPassword = x;
                                            })
                                        }

                                        if (!values.repeatedNewPassword) {
                                            errors.repeatedNewPassword = t('passwordResetForm.error.repeated.required');
                                        } else {
                                            validatorFactory(values.repeatedNewPassword, ValidatorType.PASSWORD).forEach(x => {
                                                errors.repeatedNewPassword = x;
                                            })
                                        }

                                        if (!(values.repeatedNewPassword === values.newPassword)) {
                                            errors.repeatedNewPassword = t('passwordResetForm.error.match');
                                        }
                                        return errors;
                                    }}
                                    onSubmit={(values, {setSubmitting}) => handleConfirmation(values, setSubmitting)}>
                                    {({isSubmitting, handleChange}) => (
                                        <Form className={{alignItems: "center"}}>
                                            <FieldComponent name="newPassword" placeholder={t('password')}
                                                            handleChange={handleChange}/>
                                            <FieldComponent name="repeatedNewPassword" placeholder={t('repeatPassword')}
                                                            handleChange={handleChange}/>
                                            <button className="btn btn-lg btn-purple btn-block mt-2"
                                                    type="submit" disabled={isSubmitting}
                                                    style={{width: "70%", margin: "auto"}}>
                                                {t('send')}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default withNamespaces()(PasswordResetForm);
