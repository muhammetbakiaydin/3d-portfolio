import React from "react";
import Page from "../Page";
import "./AboutPage.scss";

const AboutPage = () => {
  return (
    <div className="about-page">
      <iframe 
        src="/brain-storming/index.html" 
        className="brain-storming-iframe"
        title="Brain Storming"
        frameBorder="0"
      />
    </div>
  );
};

export default AboutPage;
