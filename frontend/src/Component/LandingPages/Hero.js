import { useState, useEffect } from "react";
import { Button, Navbar, Nav, Form, FormControl } from "react-bootstrap";

import ModalRegister from "./ModalRegister";
import ModalLogin from "./ModalLogin";

import "./landing.css";
import bg from "../../Assets/images/background.svg";
import contentImage from "../../Assets/images/hero-img.svg";

const Hero = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const openModalRegister = () => {
    setShowRegister((prev) => !prev);
  };

  const openModalLogin = () => {
    setShowLogin((prev) => !prev);
  };

  const changeModal = () => {
    setShowRegister((prev) => !prev);
    setShowLogin((prev) => !prev);
  };

  return (
    <>
      <div className="" style={{ minHeight: "94vh" }}>
        <img src={bg} alt="" className="hero-image" />
      </div>
      <div className="d-flex align-items-center container hero-content">
        <div className="d-flex flex-column content-text">
          <div className="text-hero">The Only Link You'll Ever Need</div>
          <div className="subtext-hero">
            Add a link for your Social Bio and optimize your social media
            traffic.
          </div>
          <div className="subtext-hero mt-5">safe, fast and easy to use.</div>

          <Button
            variant="transparant"
            className="btn content-btn btn-style"
            onClick={openModalLogin}
          >
            Get Started For Free
          </Button>
        </div>
        <div className="content-image">
          <img src={contentImage} alt={contentImage} />
        </div>

        <ModalRegister
          showRegister={showRegister}
          setShowRegister={setShowRegister}
          changeModal={changeModal}
        />
        <ModalLogin
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          changeModal={changeModal}
        />
      </div>
    </>
  );
};

export default Hero;

// <div className="App">
//   <h3>
//     <a href="https://cluemediator.com">Clue Mediator</a>
//   </h3>

//   <input
//     type="text"
//     name="title"
//     value={title}
//     onChange={(e) => onChange(e)}
//   />
//   <input
//     type="text"
//     name="desc"
//     value={desc}
//     onChange={(e) => onChange(e)}
//   />
//   <pre>{JSON.stringify(form, null, 2)}</pre>
//   {inputList.map((x, i) => {
//     return (
//       <div className="box">
//         <input
//           name="firstName"
//           placeholder="Enter First Name"
//           value={x.firstName}
//           onChange={(e) => handleInputChange(e, i)}
//         />
//         <input
//           className="ml10"
//           name="lastName"
//           placeholder="Enter Last Name"
//           value={x.lastName}
//           onChange={(e) => handleInputChange(e, i)}
//         />
//         <div className="btn-box">
//           {inputList.length !== 1 && (
//             <button className="mr10" onClick={() => handleRemoveClick(i)}>
//               Remove
//             </button>
//           )}
//           {inputList.length - 1 === i && (
//             <button onClick={handleAddClick}>Add</button>
//           )}
//         </div>
//       </div>
//     );
//   })}
//   <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
//   <button onClick={() => console.log(form)}>clikc</button>
// </div>
