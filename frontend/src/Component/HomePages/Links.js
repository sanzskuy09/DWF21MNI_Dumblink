import { useState } from "react";
import { useHistory } from "react-router";

import { Button, Modal } from "react-bootstrap";
import example from "../../Assets/images/example.svg";
import ICEedit from "../../Assets/images/edit.svg";
import ICView from "../../Assets/images/view.svg";
import ICDelete from "../../Assets/images/delete.svg";

import "./homepage.css";

const Links = ({ link, handleDelete }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { id, title, uniqueLink, viewCount, image } = link;
  const history = useHistory();
  return (
    <div
      className="d-flex p-3 align-items-center container-link"
      style={{ marginLeft: "21%" }}
    >
      <div className="mr-5">
        <img
          src={image !== null ? image : example}
          alt=""
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      </div>
      <div
        className="d-flex justify-content-between pt-2"
        style={{ width: "35vw" }}
      >
        <div className="d-flex flex-column ">
          <p className="title">{title}</p>
          <p className="sub-title">{`localhost:5000/dumblink/${uniqueLink}`}</p>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <p className="title">{viewCount}</p>
          <p className="sub-title">Visit</p>
        </div>
      </div>
      <div className="d-flex ml-auto mr-5">
        <img
          src={ICView}
          alt={ICView}
          className=" mr-4 icon-img"
          type="button"
          onClick={() => {
            history.push(`/dumblink/${uniqueLink}`);
          }}
        />
        <img
          src={ICEedit}
          alt={ICEedit}
          className=" mr-4 icon-img"
          type="button"
        />
        <img
          src={ICDelete}
          alt={ICDelete}
          className="mr-4 icon-img"
          type="button"
          onClick={handleShow}
        />

        <Modal
          show={show}
          onHide={handleClose}
          centered
          className="modal-delete"
        >
          <Modal.Body className="modal-body p-4">
            <p> You are sure you want to remove this link ? </p>
            <div className="d-flex justify-content-end">
              <Button
                variant="transparant"
                className="btn btn-agree btn-style"
                onClick={() => handleDelete(id)}
              >
                Yes
              </Button>
              <Button
                variant="transparant"
                className="btn btn-disagree btn-style"
                onClick={handleClose}
              >
                No
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Links;
