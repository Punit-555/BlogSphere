import React, { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

const LoaderComponent = () => {
  const loaderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
  };

  const spinnerStyle = {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const keyframes = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(30);
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return oldProgress + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={loaderStyle}>
      <style>{keyframes}</style>
      {/* <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      /> */}
      <div style={spinnerStyle}></div>
    </div>
  );
};

export default LoaderComponent;
