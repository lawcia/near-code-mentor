import React from "react"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./app.css";
import femaleOfficeWorkers from "./1.jpg";
import Login from "./Login";
import Feeds from "./Feeds";

const App = () => {

  return (
    <>
      <div className="app">
        <h1 className="title">Code Mentor</h1>
        {window?.walletConnection?.isSignedIn() ? (
          <Feeds />
        ) : (
          <>
            <h2>
              This is a platform for women to get code reviews from mentors in Tech.
            </h2>
            <Login />
          </>
        )}
      </div>
      <div>
        <img
          className="title-image"
          src={femaleOfficeWorkers}
          alt="female office workers"
        />
      </div>
      <ToastContainer />
    </>
  );
};
export default App;
