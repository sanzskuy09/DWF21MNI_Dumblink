import { useQuery } from "react-query";

import { API, setAuthToken } from "../Config/api";

import profil from "../Assets/images/profil-user.png";
import { useParams, Link } from "react-router-dom";

const PreviewPage = () => {
  const params = useParams();
  const { uniqueLink } = params;

  const { data: linkData } = useQuery("linkCache", async () => {
    const response = await API.get(`/link/${uniqueLink}`);
    return response.data.data.link;
  });
  console.log(linkData);

  return (
    <div className="container p-5 preview-container">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="">
          <img src={profil} alt="" style={{ width: "90px", height: "90px" }} />
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
            style={{ backgroundColor: "salmon", width: "50%" }}
          >
            <img
              src={link?.image ? link?.image : profil}
              alt="image"
              style={{ width: "45px", height: "45px" }}
              className="mr-auto"
            />
            <div className="" style={{ position: "absolute" }}>
              <a
                href={`https://${link?.url}/`}
                target="_blank"
                rel="noreferrer"
              >
                {link?.title}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewPage;
