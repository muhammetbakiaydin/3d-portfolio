import React from "react";
import "./BrainStormingPage.scss";

const BrainStormingPage = () => {
  return (
    <div className="brainstorming-page">
      <iframe
        src="/brain-storming/index.html"
        title="Brain Storming - Staggered 3D Grid"
        className="brainstorming-iframe"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
};

export default BrainStormingPage;
