import { useState } from "react";
import { useMutation } from "react-query";
import { useHistory, useParams } from "react-router-dom";

import "./homepage.css";
import { Navbar, Form, Button, Alert } from "react-bootstrap";

import template1 from "../../Assets/images/template1.svg";
import template2 from "../../Assets/images/template2.svg";
import template3 from "../../Assets/images/template3.svg";
import template4 from "../../Assets/images/template4.svg";
import exam from "../../Assets/images/example-img.png";

import { API } from "../../Config/api";

import NavVertical from "./NavVertical";

const CreateLink = () => {
  const history = useHistory();
  const params = useParams();
  const { id } = params;

  const [subLinks, setSubLinks] = useState({
    title: "",
    url: "",
    image: null,
    imagePreview: "",
  });
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
    imagePreview: "",
    template: id,
    links: [subLinks, subLinks],
  });

  const { title, description, links, template, imagePreview } = form;

  const onChange = (e) => {
    const tempForm = { ...form };

    if (e.target.type === "file") {
      tempForm[e.target.name] = e.target.files[0];

      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onloadend = () => {
        setForm({
          ...tempForm,
          imagePreview: reader.result,
        });
      };

      reader.readAsDataURL(file);
    } else {
      tempForm[e.target.name] = e.target.value;
    }
    setForm(tempForm);
  };

  const onChangeLink = (e, index) => {
    const newLinks = links.map((link, sIndex) => {
      if (index !== sIndex) return form.links[sIndex];

      const tempLink = { ...form.links[index] };
      {
        e.target.type !== "file" && (tempLink[e.target.name] = e.target.value);
      }

      if (e.target.type === "file") {
        tempLink[e.target.name] = e.target.files[0];

        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
          tempLink["imagePreview"] = reader.result;
          setForm({
            ...form,
            links: links.map((object, i) => {
              if (index !== i) return form.links[i];

              return { ...tempLink, imagePreview: reader.result };
            }),
          });
        };
        reader.readAsDataURL(file);
      }

      return tempLink;
    });

    setForm({
      ...form,
      links: newLinks,
    });
  };

  const handleRemoveClick = (index) => {
    setForm({
      ...form,
      links: form.links.filter((l, sIndex) => index !== sIndex),
    });
  };

  const handleAddLink = () => {
    setForm({
      ...form,
      links: form.links.concat([subLinks]),
    });
  };

  // query add link
  const addLink = useMutation(async () => {
    const config = {
      headers: {
        "Content-Type": "mutipart/form-data",
      },
    };

    let newLinks = [];
    for (let index = 0; index < form.links.length; index++) {
      const bodyLink = new FormData();
      bodyLink.append("imageLink", links[index].image);

      const res = await API.post("/image-link", bodyLink, config);
      // console.log(res);

      const thisLink = {
        ...links[index],
        imagePreview: "",
        image: res.data.data.image,
      };
      newLinks.push(thisLink);
    }

    const body = new FormData();

    body.append("title", title);
    body.append("description", description);
    body.append("imageFile", form.image);
    body.append("template", template);
    body.append("links", JSON.stringify(newLinks));

    const res = await API.post("/link", body, config);

    setForm({
      title: "",
      description: "",
      image: null,
      links: [subLinks, subLinks],
    });
    setSubLinks({
      title: "",
      url: "",
      image: null,
    });
    history.push("/my-link");
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    addLink.mutate();
  };

  return (
    <div className="container-createlink">
      <NavVertical />

      <Navbar style={{ marginLeft: "20%", backgroundColor: "#FFF" }}>
        <span className="mr-auto navbar-text" style={{ color: "#000" }}>
          Template
        </span>
      </Navbar>

      <Form onSubmit={(e) => onSubmit(e)}>
        <div
          className="d-flex justify-content-between text-title p-3"
          style={{ marginLeft: "21%" }}
        >
          <div className="">Create Link</div>
          <div className="">
            <Button
              variant="transparant"
              className="btn btn-publish btn-style"
              type="submit"
            >
              Publish Link
            </Button>
          </div>
        </div>

        {/* <pre style={{ marginLeft: "20%" }}>{JSON.stringify(form, null, 2)}</pre> */}

        <div className="d-flex" style={{ marginLeft: "22%" }}>
          <div className="d-flex flex-column p-4 add-links scroll-bar">
            {addLink.status == "error" && (
              <Alert variant="success">User successfully updated</Alert>
            )}
            <div className="d-flex align-items-center mb-5">
              <div className="image-upload">
                <label for="file-input">
                  {imagePreview != "" ? (
                    <img src={imagePreview} className="img-upload" />
                  ) : (
                    <img src={exam} alt={exam} className="img-upload" />
                  )}
                </label>
                <input
                  id="file-input"
                  type="file"
                  name="image"
                  onChange={(e) => {
                    onChange(e);
                  }}
                />
              </div>

              <div className="">
                <button className="btn btn-publish btn-style" type="button">
                  Upload
                </button>
              </div>
            </div>

            <Form.Group className="form-group">
              <Form.Label className="form-label">Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your Title"
                className="form-field input-style"
                name="title"
                value={title}
                onChange={(e) => onChange(e)}
                autoComplete="off"
                required
              />
            </Form.Group>
            <Form.Group className="form-group" style={{ marginBottom: "8vh" }}>
              <Form.Label className="form-label">Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Description Here"
                className="form-field input-style"
                name="description"
                value={description}
                onChange={(e) => onChange(e)}
                autoComplete="off"
                required
              />
            </Form.Group>

            {form?.links?.map((link, index) => {
              return (
                <div
                  className="d-flex p-3 mb-4"
                  style={{ backgroundColor: "#ECECEC" }}
                >
                  <div className="image-upload">
                    <label for={`file-input-link-${index}`}>
                      {link.imagePreview != "" ? (
                        <img src={link.imagePreview} className="img-upload" />
                      ) : (
                        <img src={exam} alt={exam} className="img-upload" />
                      )}
                    </label>
                    <input
                      id={`file-input-link-${index}`}
                      type="file"
                      name="image"
                      onChange={(e) => onChangeLink(e, index)}
                    />
                  </div>
                  <div className="" style={{ width: "100%" }}>
                    <Form.Group className="form-group">
                      <Form.Label className="form-label">Title Link</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Your Title Link"
                        className="form-field input-style"
                        name="title"
                        value={link.title}
                        onChange={(e) => onChangeLink(e, index)}
                        autoComplete="off"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label className="form-label">Link</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="ex. www.dumblink.com"
                        className="form-field input-style"
                        name="url"
                        value={link.url}
                        onChange={(e) => onChangeLink(e, index)}
                        autoComplete="off"
                        required
                      />
                    </Form.Group>
                    {form?.links?.length > 2 && (
                      <Button
                        variant="transparant"
                        className="btn btn-danger btn-block btn-style"
                        onClick={() => handleRemoveClick(index)}
                      >
                        Delete Link
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            <Button
              className="btn btn-warning btn-block btn-style"
              onClick={handleAddLink}
              style={{
                color: "#FFF",
                fontSize: "14px",
                fontWeight: "700",
                minHeight: "4vh",
              }}
            >
              Add New Links
            </Button>
          </div>
          <div className="d-flex align-self-center template-img">
            {template == 1 && (
              <img src={template1} alt={template1} style={{ width: "16vw" }} />
            )}
            {template == 2 && (
              <img src={template2} alt={template2} style={{ width: "16vw" }} />
            )}
            {template == 3 && (
              <img src={template3} alt={template3} style={{ width: "16vw" }} />
            )}
            {template == 4 && (
              <img src={template4} alt={template4} style={{ width: "16vw" }} />
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateLink;
