import React from "react";

import { VIEWS } from "./helpers";

import { getMySubmissions } from "./near/helpers";
import Submissions from "./Submissions";

const ViewMySubmissions = ({ view }) => {
  return (
    <Submissions
      view={view}
      correctView={VIEWS.VIEW_MY_SUBMISSIONS}
      title="My Submissions"
      fetchFunction={getMySubmissions}
      enableReviews={false}
    />
  );
};

export default ViewMySubmissions;