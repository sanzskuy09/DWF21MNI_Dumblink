import example from "../../Assets/images/example.svg";
import ICEedit from "../../Assets/images/edit.svg";
import ICView from "../../Assets/images/view.svg";
import ICDelete from "../../Assets/images/delete.svg";
import { useHistory } from "react-router";

const Links = ({ link, handleDelete }) => {
  const { id, title, description, uniqueLink } = link;
  const history = useHistory();
  return (
    <div
      className="d-flex p-3 align-items-center"
      style={{ marginLeft: "20%" }}
    >
      <div className="mr-5">
        <img src={example} alt="" />
      </div>
      <div
        className="d-flex flex-column justify-content-between pt-2"
        style={{ width: "35vw" }}
      >
        <div className="d-flex justify-content-between">
          <p>{title}</p>
          <p className="mr-2">10</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>{`localhost:5000/dumblink/${uniqueLink}`}</p>
          <p>Visit</p>
        </div>
      </div>
      <div className="d-flex ml-auto mr-5">
        <img
          src={ICView}
          alt=""
          className=" mr-4"
          type="button"
          onClick={() => {
            history.push(`/dumblink/${uniqueLink}`);
          }}
        />
        <img src={ICEedit} alt="" className=" mr-4" type="button" />
        <img
          src={ICDelete}
          alt=""
          className="mr-4"
          type="button"
          onClick={() => handleDelete(id)}
        />
      </div>
    </div>
  );
};

export default Links;
