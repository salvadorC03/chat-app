import Card from "./Card";
import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
  return <div className={classes.modal}>{props.children}</div>;
};

const Modal = (props) => {
  return (
    <>
      <Backdrop onClose={props.onClose} />
      <ModalOverlay>
        <Card header={props.header} classes="border-secondary mb-3">
          {props.children}
        </Card>
      </ModalOverlay>
    </>
  );
};

export default Modal;
