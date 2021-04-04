import { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Navbar, Nav, Form, FormControl } from "react-bootstrap";

import { UserContext } from "../../Contexts/userContext";

import brandName from "../../Assets/images/brand-name.svg";

import ModalRegister from "./ModalRegister";
import ModalLogin from "./ModalLogin";

import "./landing.css";

const NavbarBrand = () => {
  const [state, dispatch] = useContext(UserContext);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const history = useHistory();

  const openModalRegister = () => {
    setShowRegister((prev) => !prev);
  };

  const openModalLogin = () => {
    setShowLogin((prev) => !prev);
  };

  const changeModal = () => {
    setShowRegister((prev) => !prev);
    setShowLogin((prev) => !prev);
  };

  return (
    <>
      {!state.isLogin ? (
        <Navbar
          className="container-fluid navbar-container"
          style={{ backgroundColor: "#FFF" }}
        >
          <Navbar.Brand
            className="mr-auto navbar-brand"
            style={{ marginLeft: "5vw" }}
          >
            <img src={brandName} alt={brandName} />
          </Navbar.Brand>
          <Form inline style={{ marginRight: "5vw" }}>
            <Button
              variant="transparant"
              className="btn btn-login btn-style"
              onClick={openModalLogin}
            >
              Login
            </Button>
            <Button
              variant="transparant"
              className="btn btn-register btn-style"
              onClick={openModalRegister}
            >
              Register
            </Button>
            <ModalRegister
              showRegister={showRegister}
              setShowRegister={setShowRegister}
              changeModal={changeModal}
            />
            <ModalLogin
              showLogin={showLogin}
              setShowLogin={setShowLogin}
              changeModal={changeModal}
            />
          </Form>
        </Navbar>
      ) : (
        history.push("/template")
      )}
    </>
  );
};

export default NavbarBrand;
