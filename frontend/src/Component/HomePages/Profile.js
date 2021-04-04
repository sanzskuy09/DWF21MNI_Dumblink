import { Navbar, Form, Button } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useContext, useState, useEffect } from "react";

import { UserContext } from "../../Contexts/userContext";

import { API, setAuthToken } from "../../Config/api";

import NavVertical from "./NavVertical";

const Profile = () => {
  const [state, dispatch] = useContext(UserContext);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
  });
  const { id } = state.user;
  const { email, fullName } = form;

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

  const { data: UserData, isLoading, isError, refetch } = useQuery(
    "userCache",
    async () => {
      const response = await API.get(`/user/${id}`);
      return response.data.data.users;
    }
  );

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
  }, []);

  return (
    <>
      <NavVertical />

      <Navbar style={{ marginLeft: "20%", backgroundColor: "#FFF" }}>
        <span className="mr-auto navbar-text" style={{ color: "#000" }}>
          Profile
        </span>
      </Navbar>

      <div className="p-3 d-flex" style={{ marginLeft: "20%" }}>
        My Information
      </div>
      <div
        className="p-3"
        style={{
          marginLeft: "21%",
          width: "75%",
          height: "277px",
          backgroundColor: "#FFF",
        }}
      >
        <Form onSubmit={(e) => onSubmit(e)}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="fullName"
              value={fullName}
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              disabled
            />
          </Form.Group>
          <div className="d-flex justify-content-end mr-5 mt-3">
            <Button variant="warning" type="submit">
              Save Acount
            </Button>
            <Button variant="danger" type="button" onClick={deleteUserById}>
              Delete Acount
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Profile;
