import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Pages/Home";
import TableQuestion from "./Pages/TableQuestion";
import Tree from "./Pages/Tree";
import Error from "./Pages/Error";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/table">
          <TableQuestion />
        </Route>
        <Route path="/tree">
          <Tree />
        </Route>
        <Route path="*">
          <Error />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
