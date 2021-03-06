import React, {useEffect, useState} from "react";
import BreadCrumb from "../Partial/BreadCrumb";
import {Link} from "react-router-dom";
import i18n from "../../i18n";
import {Col, Container, Row} from "react-bootstrap";
import {Form, Formik} from "formik";
import {ModifyBoxValidationSchema} from "./ModifyBoxFormComponents/ValidationSchema";
import FieldComponent from "./ModifyBoxFormComponents/FieldComponent";
import {withNamespaces} from "react-i18next";
import "./ModifyBoxFormWrapper.scss"
import {useHistory, useLocation} from "react-router";
import {useLocale} from "../LoginContext";
import {
    useNotificationDangerAndInfinity,
    useNotificationSuccessAndShort
} from "../Utils/Notification/NotificationProvider";
import {useDialogPermanentChange} from "../Utils/CriticalOperations/CriticalOperationProvider";
import {deleteBox, getBox, modifyBox} from "./ModifyBoxApiUtil";
import {ResponseErrorHandler} from "../Validation/ResponseErrorHandler";
import queryString from "query-string";
import {v4} from "uuid";

function ModifyBoxForm() {

    const location = useLocation();
    const history = useHistory();
    const {token} = useLocale();
    const [etag, setETag] = useState();
    const [box, setBox] = useState({
        id: "",
        price: "",
        description: "",
        animalType: "",
        delete: ""
    });

    const boxId = queryString.parse(location.search).id;

    const dispatchNotificationDanger = useNotificationDangerAndInfinity();
    const dispatchNotificationSuccess = useNotificationSuccessAndShort();
    const dispatchDialog = useDialogPermanentChange();

    useEffect(() => {
        if (token) {
            handleFetch(true);
        }
    }, [token]);


    const handleFetch = (firstFetch = false) => {
        getBox(boxId, token).then(response => {
            setBox({...response.data, key: v4()});
            setETag(response.headers.etag);
            if(response.data.delete) {
                history.push("/");
                dispatchNotificationDanger({message: i18n.t('exception.box.box_is_deleted')});
            }
        }).catch(error => {
            history.push("/");
            ResponseErrorHandler(error, dispatchNotificationDanger);
        });

        if (!firstFetch) {
            dispatchNotificationSuccess({message: i18n.t('dataRefresh')});
        }
    }

    const handleModifyBox = (values, setSubmitting) => {
        dispatchDialog({
            callbackOnSave: () => {
                modifyBox({values, token, etag}).then(res => {
                    dispatchNotificationSuccess({message: i18n.t('modifyBox.success')});
                    history.goBack();
                }).catch(err => {
                    ResponseErrorHandler(err, dispatchNotificationDanger);
                });
            },
            callbackOnCancel: () => {
                setSubmitting(false)
            },
        });
        setSubmitting(false);
    }

    const handleDelete = (boxId) => {
        dispatchDialog({
            callbackOnSave: () => {
                deleteBox(boxId, etag, token).then(res => {
                    dispatchNotificationSuccess({message: i18n.t('box.delete.success')});
                    history.goBack();
                }).catch(err => {
                    dispatchNotificationDanger({message: i18n.t(err.response.data.message)})
                })
            }
        })
    };

    return (
        <div id="modify-box-form" className={"mb-2 container-fluid"}>
            <BreadCrumb>
                <li className="breadcrumb-item">
                    <Link to="/">{i18n.t('mainPage')}</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to="/">{i18n.t('managerDashboard')}</Link>
                </li>
                <li className="breadcrumb-item active">
                    <Link to="/boxes/own">{i18n.t('boxList.navbar.title')}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                    {i18n.t('modifyBox.title')}
                </li>
            </BreadCrumb>
            <Container>
                <Row>
                    <Col xs={12} sm={11} md={8} lg={7} xl={6} className={"floating-no-absolute py-4 mx-auto mb-2"}>
                        <div>
                            <div>
                                <Row className="text-center justify-content-center d-block">
                                    <h1 className="mb-3">{i18n.t('modifyBox.title')}</h1>
                                    <h5>{i18n.t('modifyBox.modify.info')}{box.description}</h5>
                                    <button className="mt-3 w-25 btn btn-secondary"
                                            onClick={(e) => handleFetch()}
                                            type="submit">
                                        {i18n.t("refresh")}
                                    </button>
                                    <p className="obligatory-fields">{i18n.t('obligatoryFields')}</p>
                                </Row>
                                <Formik
                                    initialValues={{
                                        price: box.price ? box.price.toFixed(2) : '',
                                        description: box.description,
                                        animalType: i18n.t(box.animalType),
                                        id: box.id
                                    }}
                                    enableReinitialize
                                    validate={ModifyBoxValidationSchema}
                                    onSubmit={(values, {setSubmitting}) => handleModifyBox(values, setSubmitting)}>
                                    {({isSubmitting, handleChange}) => (
                                        <Form>
                                            <Row>
                                                <Col>
                                                    <FieldComponent name="animalType"
                                                                    label={i18n.t('animalType')}
                                                                    placeholder={i18n.t('animalType')}
                                                                    handleChange={handleChange}
                                                                    readonly={true}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <FieldComponent name="price"
                                                                    label={i18n.t('price')}
                                                                    placeholder={i18n.t('price')}
                                                                    handleChange={handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <FieldComponent name="description"
                                                                    label={i18n.t('box.description')}
                                                                    placeholder={i18n.t('box.description')}
                                                                    handleChange={handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <button className="btn-background-custom btn btn-lg btn-primary mt-3 "
                                                        type="submit"
                                                        disabled={isSubmitting}>
                                                    {i18n.t('edit')}
                                                </button>
                                            </Row>
                                        </Form>
                                    )}
                                </Formik>
                                <Row className="text-center justify-content-center d-block">
                                    <button className="btn w-75 btn-lg btn-danger mt-3"
                                            onClick={(e) => handleDelete(boxId)}
                                            type="submit">
                                        {i18n.t("delete")}
                                    </button>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default withNamespaces()(ModifyBoxForm)