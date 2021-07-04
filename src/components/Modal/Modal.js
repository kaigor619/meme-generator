import { Modal, Button } from "react-bootstrap";
import classes from "./Modal.module.scss";

function CustomModal({ title, children, onHide, show }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      className={classes.modalContent}
      centered
      animation="fade"
    >
      <Modal.Title className={classes.modalTitle}>{title}</Modal.Title>
      <Modal.Body className={classes.modalBody}>{children}</Modal.Body>
    </Modal>
  );
}

export default CustomModal;
