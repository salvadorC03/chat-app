const SuccessAlert = (props) => {
  return (
    <div className="alert alert-dismissible alert-success group">
      <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={props.onClose}></button>
      {props.message}
    </div>
  );
};

export default SuccessAlert;