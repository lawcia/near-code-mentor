import React from "react"

import { SMART_CONTRACT } from "./near/config";

const Login = () => {
  return (
    <>
      <h3>Please login to your NEAR account to continue.</h3>
      <button
        className="btn btn-success"
        onClick={() => window.walletConnection.requestSignIn(SMART_CONTRACT)}
      >
        Login
      </button>
    </>
  );
};

export default Login;
