const Card = (props) => {
    return (
        <div
        className={`card ${props.classes}`}
      >
        <div className="card-header">{props.header}</div>
        <div className="card-body">{props.children}</div>
        </div>
    )
};

export default Card;