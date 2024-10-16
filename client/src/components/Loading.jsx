import React from "react";
import LoadingGif from "../images/loading.gif";
const Loading = () => {
  return (
    <div className="loader">
      <div className="loader_image">
        <img src={LoadingGif} alt="" />
      </div>
    </div>
  );
};

export default Loading;
