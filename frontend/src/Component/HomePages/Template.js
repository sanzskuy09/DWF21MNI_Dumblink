import { Col, Navbar, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import template1 from "../../Assets/images/template1.svg";
import template2 from "../../Assets/images/template2.svg";
import template3 from "../../Assets/images/template3.svg";
import template4 from "../../Assets/images/template4.svg";

import "./homepage.css";

import NavVertical from "./NavVertical";

const Template = () => {
  return (
    <>
      <NavVertical />

      <Navbar style={{ marginLeft: "20%", backgroundColor: "#FFF" }}>
        <span className="mr-auto navbar-text" style={{ color: "#000" }}>
          Template
        </span>
      </Navbar>

      <div
        className="pt-3 d-flex justify-content-around"
        style={{ marginLeft: "20%" }}
      >
        <Row className="d-flex">
          <Col>
            <Link className="btn" to="/create-link/1">
              <img src={template1} alt={template1} />
            </Link>
          </Col>
          <Col>
            <Link className="btn" to="/create-link/2">
              <img src={template2} alt={template2} />
            </Link>
          </Col>
          <Col>
            <Link className="btn" to="/create-link/3">
              <img src={template3} alt={template3} />
            </Link>
          </Col>
          <Col>
            <Link className="btn" to="/create-link/4">
              <img src={template4} alt={template4} />
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Template;
