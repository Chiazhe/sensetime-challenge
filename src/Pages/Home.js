import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

/** This Function Defines the Home Page. */
function Home() {
  return (
    <div>
      <div className="head">
        <div className="page-title">Home</div>
        <Button variant="contained" color="primary" href="#contained-buttons">
          <Link to="/table">Table Page</Link>
        </Button>
        <Button variant="contained" color="primary" href="#contained-buttons">
          <Link to="/tree">Tree Page</Link>
        </Button>
        <h1>Sensetime Frontend Intern Challenge</h1>
        <h2>Lee Chia Zhe</h2>
        <h2>Solved with ReactJS</h2>
      </div>
    </div>
  );
}

export default Home;
