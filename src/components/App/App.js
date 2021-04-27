import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import EditPage from "scenes/EditPage";
import paths from "types/paths";

import "./App.scss";

function App() {
  return (
    <Switch>
      <Route path={paths.main} exact component={EditPage} />
      <Redirect to={paths.main} />
    </Switch>
  );
}

export default App;
