const ChatNavigation = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <h3 style={{ paddingLeft: "2%" }}>{props.chat.name}</h3>
        <button onClick={props.onClick} className="btn btn-lg" type="button">
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  );
};

export default ChatNavigation;
