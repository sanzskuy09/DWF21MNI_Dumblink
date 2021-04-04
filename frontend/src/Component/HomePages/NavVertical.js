import { useContext } from "react";

import { UserContext } from "../../Contexts/userContext";

import brandName from "../../Assets/images/brand-name.svg";
import { Redirect } from "react-router";
import { Link, NavLink } from "react-router-dom";

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
        <nav class="nav d-flex flex-column justify-content-center">
          <div class="mt-3" href="#">
            <img src={brandName} alt="" />
          </div>
          <Link class="mt-5 text-center" to="/template">
            Template
          </Link>
          <Link class="mt-4 text-center" to="/profile">
            Profil
          </Link>
          <Link class="mt-4 text-center" to="/my-link">
            My Link
          </Link>
          <button class="btn mt-auto mb-5" onClick={Logout}>
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default NavVertical;
