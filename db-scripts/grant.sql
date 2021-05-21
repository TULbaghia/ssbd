GRANT SELECT, UPDATE, DELETE, INSERT ON account TO ssbd06mok;
GRANT SELECT, UPDATE, DELETE, INSERT ON pending_code TO ssbd06mok;
GRANT SELECT, UPDATE, DELETE, INSERT ON role TO ssbd06mok;
GRANT SELECT, UPDATE, DELETE, INSERT ON admin_data TO ssbd06mok;
GRANT SELECT, UPDATE, DELETE, INSERT ON manager_data TO ssbd06mok;
GRANT SELECT, UPDATE, DELETE, INSERT ON client_data TO ssbd06mok;
GRANT SELECT ON booking TO ssbd06mok;
GRANT SELECT ON booking_line TO ssbd06mok;
GRANT SELECT ON box TO ssbd06mok;
GRANT SELECT ON city TO ssbd06mok;
GRANT SELECT ON hotel TO ssbd06mok;
GRANT SELECT ON rating TO ssbd06mok;

GRANT SELECT ON account TO ssbd06moh;
GRANT SELECT, UPDATE, DELETE, INSERT ON booking TO ssbd06moh;
GRANT SELECT, UPDATE, DELETE, INSERT ON booking_line TO ssbd06moh;
GRANT SELECT, UPDATE, DELETE, INSERT ON box TO ssbd06moh;
GRANT SELECT, UPDATE, DELETE, INSERT ON city TO ssbd06moh;
GRANT SELECT, UPDATE, DELETE, INSERT ON hotel TO ssbd06moh;
GRANT SELECT, UPDATE ON manager_data TO ssbd06moh;
GRANT SELECT, UPDATE, DELETE, INSERT ON rating TO ssbd06moh;

GRANT SELECT ON auth_view TO ssbd06auth;

GRANT SELECT ON SEQUENCE seq_account_id TO ssbd06mok;
GRANT SELECT ON SEQUENCE seq_booking_id TO ssbd06mok;
GRANT SELECT ON SEQUENCE seq_booking_line_id TO ssbd06mok;
GRANT SELECT ON SEQUENCE seq_box_id TO ssbd06mok;
GRANT SELECT ON SEQUENCE seq_city_id TO ssbd06mok;
GRANT SELECT ON SEQUENCE seq_hotel_id TO ssbd06mok;
GRANT SELECT, USAGE ON seq_pending_code_id TO ssbd06mok;
GRANT SELECT ON SEQUENCE seq_rating_id TO ssbd06mok;
GRANT SELECT ON SEQUENCE seq_role_id TO ssbd06mok;

GRANT SELECT ON SEQUENCE seq_account_id TO ssbd06moh;
GRANT SELECT ON SEQUENCE seq_booking_id TO ssbd06moh;
GRANT SELECT ON SEQUENCE seq_booking_line_id TO ssbd06moh;
GRANT SELECT ON SEQUENCE seq_box_id TO ssbd06moh;
GRANT SELECT ON SEQUENCE seq_city_id TO ssbd06moh;
GRANT SELECT ON SEQUENCE seq_hotel_id TO ssbd06moh;
GRANT SELECT ON SEQUENCE seq_pending_code_id TO ssbd06moh;
GRANT SELECT ON SEQUENCE seq_rating_id TO ssbd06moh;
GRANT SELECT ON SEQUENCE seq_role_id TO ssbd06moh;
