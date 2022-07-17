import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { Buffer } from "buffer"
import * as near from "./near/config"

import "./index.css"

window.Buffer = Buffer;

const root = ReactDOM.createRoot(
    document.getElementById("app")
);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

