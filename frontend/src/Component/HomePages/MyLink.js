import { Navbar, Form, Button, Nav, FormControl } from "react-bootstrap";

import { useMutation, useQuery } from "react-query";
import { useState, useEffect } from "react";

import { API } from "../../Config/api";

import Links from "./Links";
import NavVertical from "./NavVertical";

import ReactPaginate from "react-paginate";

import "./homepage.css";

const MyLink = () => {
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);

  const [search, setSearch] = useState("");

  const { data: linkData, isLoading, isError, refetch } = useQuery(
    "linkCache",
    async () => {
      const response = await API.get("/links");
      const data = response?.data?.data?.links;
      const slice = data.slice(offset, offset + perPage);
      const postData = slice.map((link) => (
        <Links link={link} key={link.id} handleDelete={handleDelete} />
      ));

      setDataFilter(postData);
      setPageCount(Math.ceil(data.length / perPage));
      setData(data);
      return data;
    }
  );

  const getData = () => {
    const res = linkData;
    return res;
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    {
      selectedPage == 0 && setOffset(0);
    }
    {
      selectedPage !== 0 && setOffset(selectedPage + 4 * selectedPage);
    }
  };

  useEffect(() => {
    getData();
    refetch();
  }, [offset]);

  const deleteLink = useMutation(async (id) => {
    await API.delete(`/link/${id}`);
    refetch();
  });

  const handleDelete = (id) => {
    deleteLink.mutate(id);
  };

  useEffect(() => {
    if (search === "") {
      refetch();
    }

    const linkFilter = data?.filter((link) => {
      return link?.title?.includes(search);
    });

    setData(linkFilter);
  }, [search]);

  return (
    <>
      <NavVertical />
      <Navbar style={{ marginLeft: "20%", backgroundColor: "#FFF" }}>
        <span className="mr-auto navbar-text" style={{ color: "#000" }}>
          My Link
        </span>
      </Navbar>
      <div
        className="d-flex align-items-center justify-content-between text-title container-mylink p-3"
        style={{ marginLeft: "21%" }}
      >
        <div className="">All Link</div>
        <span class="badge badge-pill badge-warning">{linkData?.length}</span>
        <Form inline>
          <FormControl
            type="text"
            placeholder="Find Your Link"
            className="mr-sm-2 ml-auto input-search input-style"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form>
        <div className=" mr-5">
          <Button
            variant="transparant"
            className="btn btn-search btn-style"
            type="submit"
          >
            Search
          </Button>
        </div>
      </div>

      {search == "" || search == null ? (
        <>
          {dataFilter}

          <div className="pagination-wrapper d-flex">
            {linkData?.length !== 0 && (
              <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={3}
                pageRangeDisplayed={4}
                onPageChange={handlePageClick}
                breakClassName={"break-me"}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            )}
          </div>
        </>
      ) : (
        <>
          {data?.map((link) => (
            <Links link={link} key={link.id} handleDelete={handleDelete} />
          ))}
        </>
      )}
    </>
  );
};

export default MyLink;
