import { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";

import "./homepage.css";
import { Col, Navbar, Row, Form, Button } from "react-bootstrap";

import template1 from "../../Assets/images/template1.svg";
import template2 from "../../Assets/images/template2.svg";
import template3 from "../../Assets/images/template3.svg";
import template4 from "../../Assets/images/template4.svg";
import exam from "../../Assets/images/example-img.png";

import { API } from "../../Config/api";

import NavVertical from "./NavVertical";

const EditLink = () => {
  const history = useHistory();
  const params = useParams();
  const { uniqueLink } = params;

  const [subLinks, setSubLinks] = useState({
    title: "",
    url: "",
    image: null,
    imagePreview: "",
  });
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    template: "",
    image: null,
    imagePreview: "",
    links: [subLinks, subLinks],
  });

  console.log("ini from", form);

  const { id, title, description, links, template, imagePreview, image } = form;

  const { data: linkData, refetch } = useQuery("linkCache", async () => {
    const response = await API.get(`/link/${uniqueLink}`);
    const data = response?.data?.data?.links;
    return data;
  });

  const getData = () => {
    const data = linkData;

    setForm({
      ...form,
      id: data?.id,
      title: data?.title,
      description: data?.description,
      template: data?.template,
      imagePreview: data?.image,
      links: data?.links?.map((link) => ({
        ...link,
        image: null,
        imagePreview: link.image,
      })),
    });
  };

  useEffect(() => {
    getData();
  }, [linkData]);

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

  // query edit link
  const editLink = useMutation(async () => {
    const config = {
      headers: {
        "Content-Type": "mutipart/form-data",
      },
    };

    let newLinks = [];
    for (let index = 0; index < form.links.length; index++) {
      const bodyLink = new FormData();

      if (links[index].image == null) {
        const thisLink = {
          ...links[index],
          image: links[index].imagePreview,
        };
        newLinks.push(thisLink);
      }

      if (links[index].image != null) {
        bodyLink.append("imageLink", links[index].image);

        const res = await API.post("/image-link", bodyLink, config);
        const dataImageLink = res?.data?.data?.image;

        const thisLink = {
          ...links[index],
          image: dataImageLink,
        };
        newLinks.push(thisLink);
      }
    }

    const body = new FormData();

    body.append("title", title);
    body.append("description", description);
    body.append("template", template);
    body.append("imageFile", image);

    body.append("links", JSON.stringify(newLinks));

    const res = await API.patch(`/edit/${id}`, body, config);

    history.push("/my-link");
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    editLink.mutate();
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
          <div className="">Edit Link</div>
          <div className="">
            <Button
              variant="transparant"
              className="btn btn-publish btn-style"
              type="submit"
            >
              Save Link
            </Button>
          </div>
        </div>

        {/* <pre style={{ marginLeft: "20%" }}>{JSON.stringify(form, null, 2)}</pre> */}

        <div className="d-flex" style={{ marginLeft: "22%" }}>
          <div className="d-flex flex-column p-4 add-links scroll-bar">
            <div className="d-flex align-items-center mb-5">
              <div className="image-upload">
                <label for="file-input">
                  {imagePreview != "" ? (
                    <img src={imagePreview} className="img-upload" />
                  ) : (
                    <img src={image} alt={image} className="img-upload" />
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
            {linkData?.template == 1 && (
              <img src={template1} alt={template1} style={{ width: "16vw" }} />
            )}
            {linkData?.template == 2 && (
              <img src={template2} alt={template2} style={{ width: "16vw" }} />
            )}
            {linkData?.template == 3 && (
              <img src={template3} alt={template3} style={{ width: "16vw" }} />
            )}
            {linkData?.template == 4 && (
              <img src={template4} alt={template4} style={{ width: "16vw" }} />
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EditLink;
