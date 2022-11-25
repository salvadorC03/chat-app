const Input = (props) => {
  return (
    <div className="form-group">
      <fieldset className={props.fieldsetClass}>
        <label htmlFor={props.id} className="form-label">
          {props.label}
        </label>
        <input
        id={props.id}
          {...props.attributes}
        />
      </fieldset>
    </div>
  );
};

export default Input;