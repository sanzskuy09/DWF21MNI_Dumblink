import { Button } from "react-bootstrap";
import profile from "../../Assets/images/profil-user.png";
import geprek from "../../Assets/images/Geprek.png";

import { Link, useHistory } from "react-router-dom";

const Preview3 = ({ linkData, handleCount }) => {
  const history = useHistory();

  return (
    <div
      className="container-fluid preview3-container"
      style={{
        backgroundImage: `url(${geprek})`,
        objectFit: "cover",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <div className="container p-5">
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{
            backgroundColor: "#FFF",
            paddingTop: "4vh",
            paddingBottom: "4vh",
          }}
        >
          <div className="">
            <img
              src={linkData?.image ? linkData?.image : geprek}
              alt=""
              style={{
                width: "35vw",
                height: "30vh",
                objectFit: "cover",
                border: "1px solid #FFF",
                marginBottom: "1em",
              }}
            />
          </div>
          <div className="">
            <h2
              style={{
                textAlign: "center",
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
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              {linkData?.description}
            </h4>
          </div>

          <div className="d-flex flex-row">
            {linkData?.links?.map((link) => (
              <div className="d-flex align-items-center justify-content-center p-2 mt-3">
                <a
                  href={`https://${link?.url}/`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleCount}
                >
                  <img
                    src={link?.image !== null ? link?.image : profile}
                    alt={link?.image}
                    style={{
                      width: "45px",
                      height: "45px",
                      objectFit: "cover",
                      borderRadius: "2px",
                    }}
                    className="mr-auto"
                  />
                </a>
              </div>
            ))}
          </div>
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

export default Preview3;
