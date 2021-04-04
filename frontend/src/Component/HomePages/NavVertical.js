import { useContext } from "react";
import { Redirect } from "react-router";
import { Link, NavLink } from "react-router-dom";

import { UserContext } from "../../Contexts/userContext";

import brandName from "../../Assets/images/brand-name.svg";
import templateImage from "../../Assets/images/template-img.svg";
import profileImage from "../../Assets/images/profile-img.svg";
import linkImage from "../../Assets/images/link-img.svg";
import logoutImage from "../../Assets/images/logout-img.svg";

import { Nav } from "react-bootstrap";

const NavVertical = () => {
  const [state, dispatch] = useContext(UserContext);
  const Logout = () => {
    dispatch({
      type: "LOGOUT",
    });
    <Redirect to="/" />;
  };

  return (
    <>
      <div
        className="d-flex justify-content-center"
        style={{
          height: "100%",
          position: "fixed",
          width: "20%",
          backgroundColor: "#FFF",
        }}
      >
        <Nav className="nav d-flex flex-column align-items-baseline">
          <div className="mt-3" href="#">
            <img src={brandName} alt={brandName} />
          </div>
          <Link
            className="mt-5 text-center navbar-vertical-text d-flex"
            style={{ textDecoration: "none", color: "#000" }}
            to="/template"
          >
            <img src={templateImage} alt={templateImage} className="mr-3" />
            Template
          </Link>
          <Link
            className="mt-4 text-center navbar-vertical-text d-flex"
            style={{ textDecoration: "none", color: "#000" }}
            to="/profile"
          >
            <img src={profileImage} alt={profileImage} className="mr-3" />
            Profil
          </Link>
          <Link
            className="mt-4 text-center navbar-vertical-text d-flex"
            style={{ textDecoration: "none", color: "#000" }}
            to="/my-link"
          >
            <img src={linkImage} alt={linkImage} className="mr-3" />
            My Link
          </Link>
          <Link
            className="mt-auto mb-5 navbar-vertical-text d-flex"
            style={{ textDecoration: "none", color: "#000" }}
            onClick={Logout}
          >
            <img src={logoutImage} alt={logoutImage} className="mr-3" />
            Logout
          </Link>
        </Nav>
      </div>
    </>
  );
};

export default NavVertical;
