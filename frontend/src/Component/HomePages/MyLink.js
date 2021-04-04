import { Navbar, Form, Button, Nav, FormControl } from "react-bootstrap";

import { useMutation, useQuery } from "react-query";
import { useContext, useState, useEffect } from "react";

import { UserContext } from "../../Contexts/userContext";

import { API, setAuthToken } from "../../Config/api";

import Links from "./Links";
import NavVertical from "./NavVertical";

const MyLink = () => {
  const { data: linkData, isLoading, isError, refetch } = useQuery(
    "linkCache",
    async () => {
      const response = await API.get("/links");
      return response?.data?.data?.links;
    }
  );
  console.log(linkData);

  const deleteLink = useMutation(async (id) => {
    await API.delete(`/link/${id}`);
    refetch();
  });

  const handleDelete = (id) => {
    deleteLink.mutate(id);
  };

  return (
    <>
      <NavVertical />

      <Navbar style={{ marginLeft: "20%", backgroundColor: "#FFF" }}>
        <span className="mr-auto navbar-text" style={{ color: "#000" }}>
          My Link
        </span>
      </Navbar>

      <div className="p-3 d-flex" style={{ marginLeft: "20%" }}>
        <Navbar bg="light" variant="light">
          <Navbar.Brand href="#home">All Links</Navbar.Brand>
          <Form inline>
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2 ml-auto"
            />
            <Button variant="outline-primary ">Search</Button>
          </Form>
        </Navbar>
      </div>

      {linkData?.map((link) => (
        <Links link={link} key={link.id} handleDelete={handleDelete} />
      ))}
    </>
  );
};

export default MyLink;
