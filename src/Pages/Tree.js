import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import Button from "@material-ui/core/Button";

import { baseUrl } from "../shared/baseURL";

/** This Function Defines the Tree Page. */
function Tree() {
  const [tree, setTree] = useState([]);

  /** This Function is Used to Fetch Data from the Server During Initial Loading. */
  useEffect(() => {
    axios.get(baseUrl + "tree").then((response) => setTree(response.data));
  }, []);

  /** This Function is Called Recursively if the data passed in has at least one children. */ 
  function ChildTree(props) {
    const { data } = props;
    return (
      <React.Fragment>
        {data !== undefined &&
          data.length !== 0 &&
          data.map((children) => {
            return (
              <TreeItem
                key={children.id}
                nodeId={children.id}
                label={"Type: " + children.Type + "  ID: " + children.id}
              >
                {children.children.length !== 0 && (
                  <React.Fragment>
                    <ChildTree data={children.children} />
                  </React.Fragment>
                )}
              </TreeItem>
            );
          })}
      </React.Fragment>
    );
  }

  return (
    <div>
      <div className="head">
        <ChildTree />
        <div className="page-title">Tree</div>
        <Button variant="contained" color="primary" href="#contained-buttons">
          <Link to="/">Home Page</Link>
        </Button>
        <Button variant="contained" color="primary" href="#contained-buttons">
          <Link to="/table">Table Page</Link>
        </Button>
      </div>
      <div className="container">
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <ChildTree data={tree}></ChildTree>
        </TreeView>
      </div>
    </div>
  );
}

export default Tree;
