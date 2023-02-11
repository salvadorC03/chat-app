import Modal from "../UI/Modal";
import "./ImageModal.css";

const ImageModal = (props) => {
  return (
    <Modal header="Ver imagen">
      <img
        className="modal-image"
        src={props.src}
      />
      <div style={{marginTop: "0.5rem"}}>
        <button className="btn btn-primary group" onClick={() => window.open(props.src)}>
          Ver en tamaño completo
        </button>
        <button
        style={{marginLeft: "0.8rem", width: "5rem"}}
          className="btn btn-primary group"
          onClick={props.onClose}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default ImageModal;
