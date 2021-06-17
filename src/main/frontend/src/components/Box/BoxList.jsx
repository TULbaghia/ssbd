import React, {Component, useEffect, useState} from "react";
import {useLocale} from "../LoginContext";
import BoxItem from "./BoxItem";
import "./BoxListStyle.scss"
import {withNamespaces} from "react-i18next";
import {Button, Form, Row} from "react-bootstrap";
import BreadCrumb from "../Partial/BreadCrumb";
import {Link} from "react-router-dom";
import {rolesConstant} from "../../Constants";
import i18n from "i18next";
import {ResponseErrorHandler} from "../Validation/ResponseErrorHandler";
import {useDialogPermanentChange} from "../Utils/CriticalOperations/CriticalOperationProvider";
import {
    useNotificationDangerAndInfinity,
    useNotificationSuccessAndShort
} from "../Utils/Notification/NotificationProvider";
import {useHistory, useLocation} from "react-router";
import queryString from "query-string";

function BoxList(props) {

    const [boxes, setBoxes] = useState([])
    const {token, username, currentRole} = useLocale();
    const history = useHistory();
    const location = useLocation();

    const dispatchDialog = useDialogPermanentChange();
    const dispatchNotificationSuccess = useNotificationSuccessAndShort();
    const dispatchNotificationDanger = useNotificationDangerAndInfinity();

    const [searchTerm, setSearchTerm] = React.useState('');
    const hotelIdFromUrl = queryString.parse(location.search).id;

    const decideFetch = (refresh = false) => {
        if (hotelIdFromUrl !== undefined) {
            fetchDataForClient(refresh);
        }
        else {
            fetchData(refresh);
        }
    }

    const handleSearchBox = (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value !== '') {
            setBoxes(filteredItems);
        } else {
            decideFetch();
        }
    }

    const filteredItems = boxes.filter(item => {
        return item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    useEffect(() => {
        if (currentRole === rolesConstant.manager) {
            debugger;
            fetchData();
        } else if (currentRole === rolesConstant.client) {
            debugger;
            fetchDataForClient();
        }
    }, [token]);

    const fetchData = (refresh = false) => {
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: token,
            },
        };

        fetch("/resources/boxes/all/" + username, requestOptions)
            .then((res) => res.json())
            .then((boxes) => {
                setBoxes(boxes);
            })
            .catch(err => {
                ResponseErrorHandler(err, dispatchNotificationDanger)
            });

        if (refresh) {
            dispatchNotificationSuccess({message: i18n.t('dataRefresh')})
        }
    }

    const fetchDataForClient = (refresh = false) => {

        debugger;
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: token,
            },
        };
        if (hotelIdFromUrl !== undefined) {

            fetch("/resources/boxes/all/id/" + hotelIdFromUrl, requestOptions)
                .then((res) => res.json())
                .then((boxes) => {
                    setBoxes(boxes);
                })
                .catch(err => {
                    ResponseErrorHandler(err, dispatchNotificationDanger)
                });
        }
        if (refresh) {
            dispatchNotificationSuccess({message: i18n.t('dataRefresh')})
        }
    }

    const handleIsManager = () => {
        return currentRole === rolesConstant.manager;
    }

    const handleModify = (userId) => {
        props.history.push({
            pathname: "/",
            state: {idOfBox: userId},
        });
    };

    const handleDelete = (boxId) => {
        setBoxes(boxes.filter((b) => b.id !== boxId))
    };

    return (
        <div id={"box-list"} className={"container"}>

            <BreadCrumb>
                <li className="breadcrumb-item"><Link to="/">{i18n.t('mainPage')}</Link></li>
                {currentRole === rolesConstant.manager && (
                    <li className="breadcrumb-item"><Link to="/">{i18n.t('managerDashboard')}</Link></li>
                )}
                {currentRole === rolesConstant.client && (
                    <li className="breadcrumb-item"><Link to="/">{i18n.t('userDashboard')}</Link></li>
                )}
                {hotelIdFromUrl !== undefined && (
                    <li className="breadcrumb-item"><Link to="/hotels">{i18n.t('hotelInfo')}</Link></li>
                )}
                <li className="breadcrumb-item active" aria-current="page">{i18n.t('boxList.navbar.title')}</li>
            </BreadCrumb>

            <div style={{position: "absolute"}} className={"box-grid"}>

                <div className={"row"}>
                    <h1 className="col-md-6">{i18n.t('boxList.navbar.title')}</h1>
                    <div className={"col-md-6"}>
                        <Button className="btn-secondary float-right m-2" onClick={event => {
                            decideFetch(true);
                            setSearchTerm('');
                        }}>
                            {i18n.t("refresh")}
                        </Button>
                        {token !== null && token !== '' && currentRole === rolesConstant.manager ? (
                            <Button className="btn-primary float-right m-2" onClick={event => {
                                history.push('/hotels/addHotel');
                            }}>{i18n.t("addBox")}</Button>
                        ) : (<></>)}
                        <input
                            className="input float-right m-2"
                            type="text"
                            placeholder={i18n.t("search.box")}
                            value={searchTerm}
                            onKeyUp={handleSearchBox}
                            onChange={handleSearchBox}
                        />
                    </div>
                </div>

                <div style={{
                    maxHeight: '35rem',
                    display: 'flex',
                    flex: '1',
                    flexDirection: 'row',
                    overflowY: 'scroll'
                }}>
                    <div className='row-wrapper' style={{padding: '1rem'}}>
                        <div className={"row"} style={{display: "flex"}}>
                            {boxes.length === 0 ? (<div>No result to show</div>) : (
                                <>
                                    {boxes.map((box) => (
                                        <div style={{display: "flex"}} className={"col-sm-6 col-md-3 my-2"}>
                                            <BoxItem
                                                key={box.id}
                                                onDelete={handleDelete}
                                                onModify={handleModify}
                                                box={box}
                                                isManager={handleIsManager}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withNamespaces()(BoxList);