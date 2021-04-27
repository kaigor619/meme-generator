import { Modal, Button } from "react-bootstrap";
import classes from "./Modal.module.scss";

function CustomModal({ title, children, onHide, show }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered animation="fade">
      <Modal.Title className={classes.modalTitle}>{title}</Modal.Title>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}

export default CustomModal;
