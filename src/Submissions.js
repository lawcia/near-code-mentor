import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

import { gatherEditorSettings, setEditorSettings } from "./helpers";
import Loading from "./Loading";

import Submission from "./Submission";

const Submissions = ({ view, correctView, title, enableReviews, fetchFunction }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [submissions, setSubmissions] = useState([])

    useEffect(() => {
        if (view === correctView) {
            setIsLoading(true)
            fetchFunction()
                .then((res) => {
                    const subs = [...res].sort((a, b) => b.submission.updated.localeCompare(a.submission.updated))
                    setIsLoading(false)
                    setSubmissions(subs)
                })
                .catch((e) => {
                    setIsLoading(false)
                    toast.error("Could not get submissions. Please try again later.")
                })
        }

    }, [view])

    useEffect(() => {
        if (view === correctView) {
            const settings = gatherEditorSettings(submissions)
            setEditorSettings(settings)
        }

    }, [view, submissions])

    if (view !== correctView) {
        return null
    }

    return <div>
        <h2 className="h2">{title}</h2>
        {isLoading && <Loading />}
        {submissions?.length ? submissions.map((submission) => (
            <Submission key={submission.id} item={submission} enableReviews={enableReviews} />
        )) : <div className="card">
            <div className="card-body">
                No Results Found
            </div>
        </div>}
    </div>
};

export default Submissions;