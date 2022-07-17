import React, { useState } from "react"
import AskQuestion from "./AskQuestion"
import "./feeds.css"
import { VIEWS } from "./helpers"
import ReviewQuestion from "./ReviewQuestion"
import ViewMySubmissions from "./ViewMySubmissions"

const Feeds = () => {
    const [view, setView] = useState(VIEWS.DEFAULT)

    const account = window.walletConnection.getAccountId()

    const logout = () => {
        window?.walletConnection?.signOut();
        window.location.replace(window.location.origin + window.location.pathname);
    }

    return <div>
        <div className="prompt-div">
            <p className="welcome-message">Welcome <span>{account}</span>!</p>
            <p>What would you like to do?</p>
            <button className="btn btn-primary" onClick={() => setView(VIEWS.ASK_QUESTION)}>Get Coding Help</button>
            <button className="btn btn-secondary" onClick={() => setView(VIEWS.REVIEW_QUESTION)}>Review Code</button>
            <button className="btn btn-info" onClick={() => setView(VIEWS.VIEW_MY_SUBMISSIONS)}>See Your Submissions</button>
            <button className="btn btn-warning" onClick={logout}>Logout</button>
        </div>
        <AskQuestion view={view} setView={setView} />
        <ReviewQuestion view={view} setView={setView} />
        <ViewMySubmissions view={view} setView={setView} />
    </div>
}

export default Feeds