import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { useEffect, useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { UserContext } from "./Contexts/userContext";

import { API, setAuthToken } from "./Config/api";

import LandingPage from "./Pages/LandingPage";
import Template from "./Component/HomePages/Template";
import Profile from "./Component/HomePages/Profile";
import MyLink from "./Component/HomePages/MyLink";
import NavVertical from "./Component/HomePages/NavVertical";

import PrivateRoute from "./Component/PrivateRoute";
import CreateLink from "./Component/HomePages/CreateLink";
import PreviewPage from "./Pages/PreviewPage";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [state, dispatch] = useContext(UserContext);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      if (response.status === 401) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data.userData;
      payload.token = localStorage.token;

      dispatch({
        type: "AUTH_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "AUTH_ERROR",
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <Router>
        <div>
          <Route exact path="/" component={LandingPage} />
          <Switch>
            <PrivateRoute exact path="/template" component={Template} />
            <PrivateRoute exact path="/create-link" component={CreateLink} />
            <PrivateRoute exact path="/my-link" component={MyLink} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute
              exact
              path="/dumblink/:uniqueLink"
              component={PreviewPage}
            />
          </Switch>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
