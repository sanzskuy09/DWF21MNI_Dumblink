import { Navbar, Form, Button, Alert, Modal } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useContext, useState, useEffect } from "react";

import { UserContext } from "../../Contexts/userContext";

import { API, setAuthToken } from "../../Config/api";

import NavVertical from "./NavVertical";

const Profile = () => {
  const [state, dispatch] = useContext(UserContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
  });
  const { id } = state.user;
  const { email, fullName } = form;

  const { data: UserData, isLoading, isError, refetch } = useQuery(
    "userCache",
    async () => {
      const response = await API.get(`/user/${id}`);
      return response.data.data.users;
    }
  );

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loadData = async () => {
    setForm({
      ...form,
      fullName: state.user.fullName,
      email: state.user.email,
    });
  };

  const updateUser = useMutation(async () => {
    const body = JSON.stringify({
      fullName,
      email,
    });
    console.log(body);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await API.patch(`/user/${id}`, body, config);
    console.log(res);

    dispatch({
      type: "EDIT_SUCCESS",
      payload: {
        ...res.data.data.userData,
        token: localStorage.token,
      },
    });

    {
      res.status == 200 && (
        <Alert variant="success">This is a success alert—check it out!</Alert>
      );
    }
    refetch();
  });

  const deleteUser = useMutation(async () => {
    await API.delete(`/user/${id}`);
    dispatch({
      type: "LOGOUT",
    });
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    updateUser.mutate();
  };

  const deleteUserById = async () => {
    deleteUser.mutate();
  };

  useEffect(() => {
    loadData();
  }, [UserData]);

  return (
    <div className="container-profile">
      <NavVertical />

      <Navbar style={{ marginLeft: "20%", backgroundColor: "#FFF" }}>
        <span className="mr-auto navbar-text" style={{ color: "#000" }}>
          Profile
        </span>
      </Navbar>

      <div className="p-3 d-flex text-title" style={{ marginLeft: "21%" }}>
        My Information
      </div>

      <div
        className="p-3"
        style={{
          marginLeft: "22%",
          width: "75%",
          miHeight: "277px",
          backgroundColor: "#FFF",
          borderRadius: "10px",
        }}
      >
        {updateUser.status == "success" && (
          <Alert variant="success">User successfully updated</Alert>
        )}
        <Form onSubmit={(e) => onSubmit(e)}>
          <Form.Group className="form-group ">
            <Form.Label className="form-label">Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              className="form-field input-style"
              name="fullName"
              value={fullName}
              onChange={(e) => onChange(e)}
              autoComplete="off"
            />
          </Form.Group>
          <Form.Group className="form-group mt-4">
            <Form.Label className="form-label">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              className="form-field input-style"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              disabled
            />
          </Form.Group>
        </Form>
      </div>
      <div className="d-flex justify-content-end btn-submit">
        <Button
          variant="warning"
          type="button"
          onClick={onSubmit}
          className="mr-3 btn btn-style"
        >
          Save Acount
        </Button>
        <Button
          variant="danger"
          type="button"
          onClick={handleShow}
          className="btn btn-style"
        >
          Delete Acount
        </Button>
      </div>

      <Modal show={show} onHide={handleClose} centered className="modal-delete">
        <Modal.Body className="modal-body p-4">
          <p>
            You are sure you want to <strong>Delete</strong> this Account ?
          </p>
          <div className="d-flex justify-content-end">
            <Button
              variant="transparant"
              className="btn btn-agree btn-style"
              onClick={deleteUserById}
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
  );
};

export default Profile;
