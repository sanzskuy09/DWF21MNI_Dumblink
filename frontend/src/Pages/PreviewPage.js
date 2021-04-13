import { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams, Link, useHistory } from "react-router-dom";

import { API } from "../Config/api";

import Preview1 from "./Templates/Preview1";
import Preview2 from "./Templates/Preview2";
import Preview3 from "./Templates/Preview3";

const PreviewPage = () => {
  const params = useParams();
  const { uniqueLink } = params;

  const { data: linkData, refetch } = useQuery("linkCache", async () => {
    const response = await API.get(`/link/${uniqueLink}`);
    return response.data.data.links;
  });

  console.log(linkData);

  const [count, setCount] = useState(0);

  const setDataCount = async () => {
    setCount(linkData?.viewCount);
  };

  const updateCount = useMutation(async () => {
    const body = JSON.stringify({
      viewCount: parseInt(count) + 1,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await API.patch(`/link/${uniqueLink}`, body, config);
    console.log(res?.data?.data);
    refetch();
  });

  const handleCount = async () => {
    updateCount.mutate();
  };

  useEffect(() => {
    setDataCount();
  }, [linkData]);

  return (
    <>
      {linkData?.template == 1 && (
        <Preview1 linkData={linkData} handleCount={handleCount} />
      )}
      {linkData?.template == 2 && (
        <Preview2 linkData={linkData} handleCount={handleCount} />
      )}
      {linkData?.template == 3 && (
        <Preview3 linkData={linkData} handleCount={handleCount} />
      )}

      {/* <div className="container p-5 preview-container">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="">
            <img
              src={linkData?.image ? linkData?.image : profile}
              alt=""
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <div className="">
            <h2 style={{ textAlign: "center" }}>{linkData?.title}</h2>
          </div>
          <div className="">
            <h4 style={{ textAlign: "center" }}>{linkData?.description}</h4>
          </div>
          {linkData?.links?.map((link) => (
            <div
              className="d-flex align-items-center justify-content-center p-2 mt-3"
              style={{
                backgroundColor: "#000",
                width: "50%",
                borderRadius: "5px",
              }}
            >
              <img
                src={link?.image !== null ? link?.image : linkData?.image}
                alt={link?.image}
                style={{
                  width: "45px",
                  height: "45px",
                  objectFit: "cover",
                  borderRadius: "2px",
                }}
                className="mr-auto"
              />
              <div className="" style={{ position: "absolute" }}>
                <a
                  href={`https://${link?.url}/`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", color: "#FFF" }}
                  onClick={handleCount}
                >
                  {link?.title}
                </a>
              </div>
            </div>
          ))}
          <div className="mt-5">
            <Button
              variant="transparant"
              className="btn btn-back btn-style"
              onClick={() => {
                history.push("/my-link");
              }}
            >
              Back to Link
            </Button>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default PreviewPage;
