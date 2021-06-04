import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import EditPage from "scenes/EditPage";
import HomePage from "scenes/HomePage";
import paths from "types/paths";
import { fetchGetMemeBackgrounds } from "api/memesAPI";

import "./App.scss";

function App() {
  useEffect(() => {
    fetchGetMemeBackgrounds();
  }, []);

  return (
    <Switch>
      <Route path={paths.create} component={EditPage} />
      <Route path={`${paths.edit}/:memeId`} component={EditPage} />
      <Route path={paths.main} exact component={HomePage} />
      <Redirect to={paths.main} />
    </Switch>
  );
}

export default App;
