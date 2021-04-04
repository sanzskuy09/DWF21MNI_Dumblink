import { useState, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { Redirect, useHistory } from "react-router-dom";

import { API, setAuthToken } from "../../Config/api";

import { UserContext } from "../../Contexts/userContext";

import { Modal } from "react-bootstrap";
import "./landing.css";

const ModalRegister = ({ showRegister, setShowRegister, changeModal }) => {
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const { email, password, fullName } = form;

  const { data: UserData, refetch } = useQuery("userCache", async () => {
    const response = await API.get("/users");
    return response;
  });

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitRegister = useMutation(async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      email,
      password,
      fullName,
    });

    const response = await API.post("/register", body, config);

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: response.data.data.user,
    });
    setAuthToken(response.data.data.token);
    refetch();
  });

  const onSubmit = (e) => {
    e.preventDefault();
    submitRegister.mutate();
  };

  return (
    <>
      <Modal
        show={showRegister}
        onHide={setShowRegister}
        centered
        className="modal-container"
      >
        <div class="modal-body modal-body-register">
          <form onSubmit={(e) => onSubmit(e)}>
            <h2 className="text-color">Register</h2>

            {submitRegister.error?.response?.data && (
              <div className="alert alert-danger" role="alert">
                {submitRegister.error?.response?.data?.message}
              </div>
            )}
            <div className="modal-form mb-3">
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={(e) => onChange(e)}
                className="form-control input-style"
                autoComplete="off"
                placeholder="Full Name"
              />
            </div>
            <div className="modal-form mb-3">
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
                className="form-control input-style"
                placeholder="Email"
                autoComplete="off"
              />
            </div>
            <div className="modal-form mb-3">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => onChange(e)}
                className="form-control input-style"
                placeholder="Password"
              />
            </div>

            <div className="modal-form mb-3">
              <button
                type="submit"
                className="btn btn-submit btn-block btn-style"
                disabled={!email || !password || !fullName ? true : false}
              >
                Register
              </button>
            </div>
            <div className="d-flex justify-content-center sub-text">
              <p>
                Already have an account ? Click{" "}
                <span className="link" onClick={changeModal}>
                  <strong>Here</strong>
                </span>
              </p>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ModalRegister;
