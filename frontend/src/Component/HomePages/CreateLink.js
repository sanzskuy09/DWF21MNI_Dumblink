import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { Col, Navbar, Row, Form, Button } from "react-bootstrap";

import phone from "../../Assets/images/Phone.svg";
import exam from "../../Assets/images/example-img.svg";
import deleteImg from "../../Assets/images/delete.png";

import { API, setAuthToken } from "../../Config/api";

import NavVertical from "./NavVertical";

const CreateLink = () => {
  const [subLinks, setSubLinks] = useState([
    { title: "", url: "", image: null },
  ]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    links: null,
  });

  const { title, description, links } = form;

  // change title & desc
  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // change sublinks
  const onChangeLink = (e, index) => {
    const { name, value } = e.target;
    const subLink = [...subLinks];
    subLink[index][name] = value;
    setSubLinks(subLink);

    setForm({
      ...form,
      links: subLinks,
    });
  };

  // handle click event of the Remove Link
  const handleRemoveClick = (index) => {
    const subLink = [...subLinks];
    subLink.splice(index, 1);
    setSubLinks(subLink);
  };

  // handle click event of the Add Link
  const handleAddLink = () => {
    setSubLinks([...subLinks, { title: "", url: "", image: null }]);
  };

  // query add link
  const addLink = useMutation(async () => {
    const body = JSON.stringify({ title, description, links });
    console.log(body);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await API.post("/link", body, config);

    setForm({
      title: "",
      description: "",
      links: null,
    });
    setSubLinks({
      title: "",
      url: "",
      image: null,
    });
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    addLink.mutate();
  };

  useEffect(() => {
    handleAddLink();
  }, []);

  return (
    <>
      <NavVertical />

      <Navbar style={{ marginLeft: "20%", backgroundColor: "#FFF" }}>
        <span className="mr-auto navbar-text" style={{ color: "#000" }}>
          Template
        </span>
      </Navbar>

      <Form onSubmit={(e) => onSubmit(e)}>
        <div
          className="pt-3 d-flex justify-content-between p-5"
          style={{ marginLeft: "20%" }}
        >
          <div className="">Create Link</div>
          <div className="">
            <button className="btn btn-warning" type="submit">
              Publish Link
            </button>
          </div>
        </div>

        {/* <pre style={{ marginLeft: "20%" }}>{JSON.stringify(form, null, 2)}</pre> */}

        <div
          className="pt-3 d-flex justify-content-between pl-5 pr-5"
          style={{ marginLeft: "20%" }}
        >
          <div
            className="d-flex flex-column p-3"
            style={{
              backgroundColor: "white",
              width: "50%",
              overflow: "auto",
              height: "60vh",
            }}
          >
            <div className="d-flex align-items-center">
              <img src={exam} alt="" />
              <div className="ml-5">
                <button className="btn btn-warning">Upload</button>
              </div>
            </div>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={title}
                onChange={(e) => onChange(e)}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                name="description"
                value={description}
                onChange={(e) => onChange(e)}
                autoComplete="off"
              />
            </Form.Group>
            {subLinks.map((link, index) => {
              return (
                <div
                  className="d-flex mt-3"
                  style={{ backgroundColor: "grey" }}
                >
                  <img src={exam} alt="" />
                  <div className="">
                    <Form.Group>
                      <Form.Label>Title Link</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter title link"
                        name="title"
                        value={link.title}
                        onChange={(e) => onChangeLink(e, index)}
                        autoComplete="off"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Link</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your link"
                        name="url"
                        value={link.url}
                        onChange={(e) => onChangeLink(e, index)}
                        autoComplete="off"
                      />
                    </Form.Group>
                  </div>
                  {subLinks.length > 2 && (
                    <button onClick={() => handleRemoveClick(index)}>
                      <img src={deleteImg} alt="" />
                    </button>
                  )}
                </div>
              );
            })}

            <Button
              className="btn-warning btn-block mt-4"
              onClick={handleAddLink}
            >
              Add New Link
            </Button>
          </div>
          <div className="">
            <img src={phone} alt="" />
          </div>
        </div>
      </Form>
    </>
  );
};

export default CreateLink;
