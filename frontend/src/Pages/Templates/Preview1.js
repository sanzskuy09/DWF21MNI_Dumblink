import { Button } from "react-bootstrap";
import profile from "../../Assets/images/profil-user.png";

import { useHistory } from "react-router-dom";

const Preview1 = ({ linkData, handleCount }) => {
  const history = useHistory();

  return (
    <div
      className="container-fluid"
      //   style={{
      //     background: "linear-gradient(180deg, #89AFBB 0%, #BCD8E1 100%)",
      //     height: "100vh",
      //   }}
    >
      <div className="container p-5 preview1-container">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="">
            <img
              src={linkData?.image ? linkData?.image : profile}
              alt=""
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                border: "2px solid black",
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
      </div>
    </div>
  );
};

export default Preview1;
