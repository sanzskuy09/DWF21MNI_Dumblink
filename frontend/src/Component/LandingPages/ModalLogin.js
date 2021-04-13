import { useState, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { Redirect, useHistory } from "react-router-dom";

import { API, setAuthToken } from "../../Config/api";

import { UserContext } from "../../Contexts/userContext";

import { Modal } from "react-bootstrap";

const ModalLogin = ({ showLogin, setShowLogin, changeModal }) => {
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { email, password } = form;

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const { data: userData, refetch } = useQuery("userCache", async () => {
    const response = await API.get("/users");
    return response;
  });

  const submitLogin = useMutation(async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      email,
      password,
    });

    const response = await API.post("/login", body, config);
    console.log(response);
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: response.data.data.user,
    });
    console.log("ini res", response.data.data.user);

    setAuthToken(response.data.data.user.token);
    refetch();
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    submitLogin.mutate();
  };

  return (
    <>
      <Modal
        show={showLogin}
        onHide={setShowLogin}
        centered
        className="modal-container"
      >
        <div className="modal-body modal-body-login">
          <form onSubmit={(e) => onSubmit(e)}>
            <h2 className="text-color">Login</h2>

            {submitLogin.error?.response?.data && (
              <div class="alert alert-danger" role="alert">
                {submitLogin.error?.response?.data?.message}
              </div>
            )}

            <div className="modal-form mb-3">
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
                className="form-control input-style"
                autoComplete="off"
                placeholder="Email"
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
                disabled={!email || !password ? true : false}
              >
                Login
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

export default ModalLogin;
