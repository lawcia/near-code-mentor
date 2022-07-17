import React from "react";

import { VIEWS } from "./helpers";
import { getSubmissionsToReview } from "./near/helpers";
import Submissions from "./Submissions";

const ReviewQuestion = ({ view }) => {
  return (
    <Submissions
      view={view}
      correctView={VIEWS.REVIEW_QUESTION}
      title="Review Code"
      fetchFunction={getSubmissionsToReview}
      enableReviews={true}
    />
  );
};

export default ReviewQuestion;
