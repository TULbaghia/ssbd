import {withNamespaces} from "react-i18next";
import BreadCrumb from "./Partial/BreadCrumb";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import {api} from "../Api";
import {
    useNotificationDangerAndInfinity,
    useNotificationSuccessAndShort
} from "./Utils/Notification/NotificationProvider";
import {ResponseErrorHandler} from "./Validation/ResponseErrorHandler";
import {Col, Container, Row} from "react-bootstrap";

function PasswordReset(props) {
    const {t, i18n} = props

    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const dispatchNotificationSuccess = useNotificationSuccessAndShort();
    const dispatchNotificationDanger = useNotificationDangerAndInfinity();


    const handleSend = e => {
        e.preventDefault()
        api.sendResetPassword(email)
            .then(res => {
                console.log(res);
                dispatchNotificationSuccess({message: i18n.t('passwordResetRequestSendSuccess')})
                setIsSubmitted(true);
            })
            .catch(err => ResponseErrorHandler(err, dispatchNotificationDanger))
    }


    const handleSendAgain = e => {
        e.preventDefault()
        api.sendResetPasswordAgain(email)
            .then(res => {
                console.log(res);
                dispatchNotificationSuccess({message: i18n.t('passwordResetRequestSendSuccess')})
            })
            .catch(err => ResponseErrorHandler(err, dispatchNotificationDanger))
    }


    return (
        <div className="container-fluid">
            <BreadCrumb>
                <li className="breadcrumb-item"><Link to="/">{t('mainPage')}</Link></li>
                <li className="breadcrumb-item"><Link to="/login">{t('logging')}</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{t('passwordResetting')}</li>
            </BreadCrumb>

            <Container>
                <Row>
                    <Col xs={12} sm={10} md={7} lg={6} xl={5} className={"floating-no-absolute py-4 mx-auto mb-2"}>
                        <div>
                            <h1 className="h3">{t('passwordResettingForm')}</h1>

                            <form>
                                <div className="input-group mb-3" style={{marginTop: "3rem"}}>
                                    <div className="input-group-prepend" style={{marginBottom: "2.5rem"}}>
                                        <span className="input-group-text" id="basic-addon1">@</span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="E-mail" aria-label="E-mail"
                                           onChange={event => setEmail(event.target.value)}
                                           aria-describedby="basic-addon1"/>
                                    <span style={{color: "#7749F8", display: "inline-block", margin: "0.2rem"}}>*</span>
                                </div>

                                {!isSubmitted ?
                                    <button className="btn btn-lg btn-purple btn-block" onClick={handleSend}
                                            style={{width: "70%", margin: "auto"}}>
                                        {t('send')}
                                    </button>
                                    :
                                    <button className="btn btn-lg btn-purple btn-block" onClick={handleSendAgain}
                                            style={{width: "70%", margin: "auto"}}>
                                        {t('sendAgain')}
                                    </button>
                                }
                            </form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default withNamespaces()(PasswordReset);
