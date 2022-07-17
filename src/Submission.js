import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, FormField } from "./helpers";
import { submitComment } from "./near/helpers";

const Submission = ({
  item: {
    comments,
    id,
    submission: { account, language, question, updated },
  },
  enableReviews,
}) => {
  const [review, setReview] = useState("");

  const getDate = (date) => {
    try {
      return new Date(date).toLocaleString();
    } catch (_e) {
      return "Unknown";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitComment({
      text: review,
      submissionId: id,
    })
      .then(() => {
        toast.success("Comment submitted");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong. Pleas try again later");
      });
  };

  const handleChange = (e) => {
    setReview(e.target.value);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{language}</h5>
        <h6 className="card-subtitle mb-2 text-muted">By {account}</h6>
        <h6 className="card-subtitle mb-2 text-muted">
          Submitted at {getDate(updated)}
        </h6>
        <p className="card-text">{question}</p>
        <div className="editor-wrapper">
          <div id={id} className="editor"></div>
        </div>
      </div>
      {enableReviews && (
        <>
          <div className="card-header">Add Your Comment</div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <FormField
                type="textarea"
                labelText="Enter text"
                extra={{ onChange: handleChange }}
              />
              <button type="submit" className="btn btn-primary">
                Submit Comment
              </button>
              <hr />
              <small>Get rewarded in NEAR</small>
            </form>
          </div>
        </>
      )}
      <div className="card-header">Comments</div>
      <ul className="list-group list-group-flush">
        {comments?.length ? (
          <>
            {comments.map((comment, index) => (
              <li key={index} className="list-group-item">
                <p className="help">
                  From <span>{comment.account}</span> at{" "}
                  {getDate(comment.updated)}
                </p>
                <p>{comment.text}</p>
              </li>
            ))}
          </>
        ) : (
          <li className="list-group-item">Nobody has commented</li>
        )}
      </ul>
    </div>
  );
};

export default Submission;
