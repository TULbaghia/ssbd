import {withNamespaces} from 'react-i18next';
import BreadCrumb from "./Partial/BreadCrumb";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import DataTable from "react-data-table-component"
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useLocale} from "./LoginContext";
import {api} from "../Api";
import {
    useNotificationDangerAndInfinity,
    useNotificationSuccessAndShort
} from "./Utils/Notification/NotificationProvider";
import {useHistory} from "react-router";
import {ResponseErrorHandler} from "./Validation/ResponseErrorHandler";
import {useThemeColor} from './Utils/ThemeColor/ThemeColorProvider';
import {dateConverter} from "../i18n";

const FilterComponent = ({filterText, onFilter, placeholderText}) => (
    <>
        <Form>
            <Form.Control type="text" value={filterText} onChange={onFilter} placeholder={placeholderText}/>
        </Form>
    </>
);


function ActiveBookings(props) {
    const {t, i18n} = props
    const history = useHistory()
    const {token, setToken, currentRole, setCurrentRole} = useLocale();
    const [filterText, setFilterText] = React.useState('');
    const themeColor = useThemeColor()
    const [etag, setETag] = useState()
    const [data, setData] = useState([
        {
            id: 0,
            dateFrom: "",
            dateTo: "",
            price: 0,
            bookingLineList: [],
            rating: 0,
            bookingStatus: "",
        }
    ]);
    const dispatchNotificationSuccess = useNotificationSuccessAndShort();
    const dispatchNotificationDanger = useNotificationDangerAndInfinity();
    const filteredItems = data.filter(item => {
        return item.id && item.id.toString().includes(filterText);
    });


    const columns = [
        {
            name: 'Id',
            selector: 'id',
            sortable: true,
        },
        {
            name: t('reservationStart'),
            selector: 'dateFrom',
            sortable: true,
            cell: row => {
                return (
                    dateConverter(row.dateFrom.slice(0, -5))
                );
            }
        },
        {
            name: t('reservationEnd'),
            selector: 'dateTo',
            sortable: true,
            cell: row => {
                return (
                    dateConverter(row.dateTo.slice(0, -5))
                );
            }
        },
        {
            name: t('price'),
            selector: 'price',
            sortable: true,
            cell: row => {
                return row.price.toFixed(2) + " " + t('currency');
            }
        },
        {
            name: t('bookingStatus'),
            selector: 'bookingStatus',
            sortable: true,
            cell: row => {
                return (
                    t(row.bookingStatus.toLowerCase() + "BookingStatus")
                );
            }
        },
        {
            name: t('bookingDetails'),
            cell: row => {
                return (
                    <Button className="btn-sm" style={{backgroundColor: "#7749F8"}} onClick={event => {
                        history.push("/reservation/details/" + row.id + "?ref=active");
                    }}>{t("bookingDetails.text")}</Button>
                );
            }
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        if (token) {
            getActiveBookings().then(r => {
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

    const getActiveBookings = async () => {
        return await api.showActiveBooking({headers: {Authorization: token}})
    }


    const subHeaderComponentMemo = React.useMemo(() => {

        return <FilterComponent onFilter={e => {
            setFilterText(e.target.value);
        }} filterText={filterText} placeholderText={t('filterPhase')}/>;
    }, [filterText]);

    return (
        <div className="mb-2 container-fluid">
            <BreadCrumb>
                <li className="breadcrumb-item"><Link to="/">{t('mainPage')}</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{t('activeReservations')}</li>
            </BreadCrumb>
            <Container>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={11} className={"floating-no-absolute py-4 mx-auto mb-2"}>
                        <div>
                            <h1 className="float-left">{t('activeReservations')}</h1>
                            <Button className="btn-secondary float-right m-2" onClick={event => {
                                getActiveBookings().then(res => {
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
                                   theme={themeColor}
                                   subHeaderComponent={subHeaderComponentMemo}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default withNamespaces()(ActiveBookings);