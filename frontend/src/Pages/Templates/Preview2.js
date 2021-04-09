import { Button } from "react-bootstrap";
import profile from "../../Assets/images/profil-user.png";

import { useHistory } from "react-router-dom";

const Preview2 = ({ linkData, handleCount }) => {
  const history = useHistory();

  return (
    <div
      className="container-fluid preview2-container"
      style={{
        background: "linear-gradient(180deg, #89AFBB 0%, #BCD8E1 100%)",
        height: "100vh",
      }}
    >
      <div className="container p-5">
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{
            backgroundColor: "#C8D4CE",
            paddingTop: "4vh",
            paddingBottom: "4vh",
            borderRadius: "10px",
          }}
        >
          <div className="">
            <img
              src={linkData?.image ? linkData?.image : profile}
              alt=""
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                border: "1px solid #FFF",
                borderRadius: "50%",
                marginBottom: "1em",
              }}
            />
          </div>
          <div className="">
            <h2
              style={{
                textAlign: "center",
                fontFamily: "serif",
                fontWeight: "700",
              }}
            >
              {linkData?.title}
            </h2>
          </div>
          <div className="">
            <h4
              style={{
                textAlign: "center",
                fontFamily: "serif",
                fontWeight: "400",
              }}
            >
              {linkData?.description}
            </h4>
          </div>
          {linkData?.links?.map((link) => (
            <div
              className="d-flex align-items-center justify-content-center p-2 mt-3"
              style={{
                backgroundColor: "#FFF",
                width: "50%",
                height: "5vh",
                border: "2px solid #7FA8B5",
                borderRadius: "50px",
              }}
            >
              <div className="" style={{ position: "absolute" }}>
                <a
                  href={`https://${link?.url}/`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    fontFamily: "serif",
                    fontWeight: "400",
                  }}
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

export default Preview2;
