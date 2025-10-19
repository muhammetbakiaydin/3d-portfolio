import React, { useState } from "react";
import { useNavigate } from "react-router";
import DecodingTextTerminal from "../../components/DecodingTextTerminal/DecodingTextTerminal";
import MatrixBackground from "../../components/MatrixBackground/MatrixBackground";
import "./DevWorkPage.scss";

const DevWorkPage = () => {
  const [showTerminal, setShowTerminal] = useState(true);
  const navigate = useNavigate();

  const handleTerminalClose = () => {
    // Navigate back to previous page (like browser back button)
    navigate(-1);
  };

  const terminalLines = [
    'SYSTEM INITIALIZED',
    'LOADING DEVELOPMENT PORTFOLIO...',
    '',
    'Full-stack developer specializing in',
    'React, Three.js, and modern web technologies.',
    '',
    'Creating immersive digital experiences',
    'that push the boundaries of the web.',
    '',
    '> Ready for new challenges',
  ];

  return (
    <div className="dev-work-page">
      <MatrixBackground />
      <DecodingTextTerminal
        lines={terminalLines} 
        open={showTerminal}
        onClosed={handleTerminalClose}
        openDuration={1400}
        closeDuration={800}
        lineStagger={100}
        charStagger={12}
      />
      
     
    </div>
  );
};

export default DevWorkPage;
