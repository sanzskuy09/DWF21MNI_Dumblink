import { useContext } from "react";
import { Redirect, useParams } from "react-router";
import { Link, NavLink } from "react-router-dom";

import { UserContext } from "../../Contexts/userContext";

import brandName from "../../Assets/images/brand-name.svg";
import templateImage from "../../Assets/images/template-img.svg";
import templateImageActive from "../../Assets/images/template-img-active.svg";
import profileImage from "../../Assets/images/profile-img.svg";
import profileImageActive from "../../Assets/images/profile-img-active.svg";
import linkImage from "../../Assets/images/link-img.svg";
import linkImageActive from "../../Assets/images/link-img-active.svg";
import logoutImage from "../../Assets/images/logout-img.svg";

import { Nav } from "react-bootstrap";

import "./homepage.css";

const NavVertical = () => {
  const { pathname } = window.location;

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
        className="d-flex justify-content-center navbar-container"
        style={{
          height: "100%",
          position: "fixed",
          width: "20%",
          backgroundColor: "#FFF",
        }}
      >
        <Nav className="nav d-flex flex-column align-items-baseline">
          <Link className="mt-3" to="/template">
            <img src={brandName} alt={brandName} />
          </Link>
          <NavLink
            className="mt-5 text-center d-flex margin-text main-nav"
            activeClassName="main-nav-active"
            to="/template"
          >
            {pathname == "/template" ? (
              <img
                src={templateImageActive}
                alt={templateImageActive}
                className="mr-3"
              />
            ) : (
              <img src={templateImage} alt={templateImage} className="mr-3" />
            )}
            Template
          </NavLink>
          <NavLink
            className="text-center main-nav d-flex margin-text"
            activeClassName="main-nav-active"
            to="/profile"
          >
            {pathname == "/profile" ? (
              <img
                src={profileImageActive}
                alt={profileImageActive}
                className="mr-3"
              />
            ) : (
              <img src={profileImage} alt={profileImage} className="mr-3" />
            )}
            Profil
          </NavLink>
          <NavLink
            className="text-center main-nav d-flex"
            activeClassName="main-nav-active"
            to="/my-link"
          >
            {pathname == "/my-link" ? (
              <img
                src={linkImageActive}
                alt={linkImageActive}
                className="mr-3"
              />
            ) : (
              <img src={linkImage} alt={linkImage} className="mr-3" />
            )}
            My Link
          </NavLink>
          <Link
            className="mt-auto mb-5 main-nav d-flex"
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
