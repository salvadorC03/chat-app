const Card = (props) => {
    return (
        <div
        {...props.attributes}
      >
        <div {...props.headerAttributes}>{props.header}</div>
        <div {...props.bodyAttributes}>{props.children}</div>
        </div>
    )
};

export default Card;