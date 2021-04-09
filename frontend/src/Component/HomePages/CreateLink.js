import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { useHistory, useParams } from "react-router-dom";

import "./homepage.css";
import { Col, Navbar, Row, Form, Button } from "react-bootstrap";

import phone from "../../Assets/images/Phone.png";
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

  // change title & desc
  // const onChange = (e) => {
  //   setForm({
  //     ...form,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const onChange = (e) => {
    const tempForm = { ...form };
    // tempForm[e.target.name] =
    //   e.target.type === "file" ? e.target.files[0] : e.target.value;

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

  // change sublinks
  // const onChangeLink = (e, index) => {
  //   const tempLink = { ...subLinks };
  //   tempLink[index][e.target.name] =
  //     e.target.type === "file" ? e.target.files[0].name : e.target.value;
  //   console.log(e?.target?.files);
  //   setSubLinks(tempLink);

  //   setForm({
  //     ...form,
  //     links: subLinks,
  //   });
  // };

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

      // tempLink[e.target.name] = e.target.value;

      return tempLink;
    });

    setForm({
      ...form,
      links: newLinks,
    });
  };

  // handle click event of the Remove Link
  // const handleRemoveClick = (index) => {
  //   const tempLink = [...subLinks];
  //   tempLink.splice(index, 1);
  //   setSubLinks(tempLink);
  // };

  const handleRemoveClick = (index) => {
    setForm({
      ...form,
      links: form.links.filter((l, sIndex) => index !== sIndex),
    });
  };

  // handle click event of the Add Link
  // const handleAddLink = () => {
  //   setSubLinks([...subLinks, { title: "", url: "", image: null }]);
  // };

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
      console.log(res);

      const thisLink = {
        ...links[index],
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

    await API.post("/link", body, config);

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

  // useEffect(() => {
  //   handleAddLink();
  // }, []);

  // upload file

  // const [selectedFile, setSelectedFile] = useState();
  // const [preview, setPreview] = useState();

  // useEffect(() => {
  //   if (!selectedFile) {
  //     setPreview(undefined);
  //     return;
  //   }

  //   const objectUrl = URL.createObjectURL(selectedFile);
  //   setPreview(objectUrl);

  //   // free memory when ever this component is unmounted
  //   return () => URL.revokeObjectURL(objectUrl);
  // }, [selectedFile]);

  // const onSelectFile = (e) => {
  //   if (!e.target.files || e.target.files.length === 0) {
  //     setSelectedFile(undefined);
  //     return;
  //   }

  //   // I've kept this example simple by using the first image instead of multiple
  //   setSelectedFile(e.target.files[0]);
  //   console.log(e.target.files);
  // };

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

        <pre style={{ marginLeft: "20%" }}>{JSON.stringify(form, null, 2)}</pre>

        <div className="d-flex" style={{ marginLeft: "22%" }}>
          <div className="d-flex flex-column p-4 add-links scroll-bar">
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
                      {/* {selectedFile ? (
                        <img src={preview} className="img-link-upload" />
                      ) : (
                        <img
                          src={exam}
                          alt={exam}
                          className="img-link-upload"
                        />
                      )} */}
                      {link.imagePreview != "" ? (
                        <img src={link.imagePreview} className="img-upload" />
                      ) : (
                        <img src={exam} alt={exam} className="img-upload" />
                      )}
                      {/* <img src={exam} alt={exam} className="img-link-upload" /> */}
                    </label>
                    <input
                      id={`file-input-link-${index}`}
                      type="file"
                      name="image"
                      onChange={(e) => onChangeLink(e, index)}
                    />
                  </div>
                  {/* <img src={exam} alt={exam} className="img-link-upload" /> */}
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
                  {/* {subLinks.length > 2 && (
                    <button onClick={() => handleRemoveClick(index)}>
                      <img src={deleteImg} alt="" />
                    </button>
                  )} */}
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
