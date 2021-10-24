import { Modal, Button } from "react-bootstrap";
import { useBreakpoints, useCurrentWidth } from "react-breakpoints-hook";
import closeIcon from "assets/images/close2.png";
import classes from "./Modal.module.scss";

function CustomModal({ title, children, onHide, show, close }) {
  const { xs } = useBreakpoints({
    xs: { min: 0, max: 768 },
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      className={classes.modalContent}
      centered
      animation="fade"
    >
      {xs && (
        <div className={classes.close} onClick={onHide}>
          <img src={closeIcon} alt="" />
        </div>
      )}
      {title && (
        <Modal.Title className={classes.modalTitle}>{title}</Modal.Title>
      )}
      <Modal.Body className={classes.modalBody}>{children}</Modal.Body>
    </Modal>
  );
}

export default CustomModal;
