import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./App.css";
import HomePage from "./Pages/HomePage/HomePage";
import { Router, Route, Switch } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import LobbyPage from "./Pages/LobbyPage/LobbyPage";
import CashGame from "./Pages/Games/cashGame";
import SitGame from "./Pages/Games/sitGame";
import TournamentGames from "./Pages/Games/tournamentGame";

import { createBrowserHistory } from "history";
import BackgroundPageWrapper from "./StyledComponents/BackgroundPageWrapper";

import ApiCall from "./shared/globalApiService";
import Actions from "./store/actions/index";
import apiConfig from "./shared/apiConfig";

export const history = createBrowserHistory();
const App = (props) => {
  global.ApiCall = ApiCall;
  global.Actions = Actions;
  global.apiConfig = apiConfig;
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const func = () => {
      setWidth(window.innerWidth);
      console.log("resize called");
      if (width <= 800) {
        // console.log(store.getState().LobbyReducer);
        props.ResolutionChange(true);
      } else {
        props.ResolutionChange(false);
      }
    };
    window.addEventListener("resize", func);
    return () => window.removeEventListener("resize", func);
  }, [width]);

  useEffect(() => {
    
    if (width <= 800) {
      props.ResolutionChange(true);
    } else {
      props.ResolutionChange(false);
    }
  }, []);

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/signup/:referrer?">
          <RegisterPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>

        <Route path="/lobby">
      
          <LobbyPage />{" "}
        </Route>
        

        <Route path="/games/cash/:room">
          <BackgroundPageWrapper>
            <CashGame />
          </BackgroundPageWrapper>
        </Route>
        <Route path="/games/sit/:room">
          <BackgroundPageWrapper>
            <SitGame />
          </BackgroundPageWrapper>
        </Route>
        <Route path="/games/tournament/:room">
          <BackgroundPageWrapper>
            <TournamentGames />
          </BackgroundPageWrapper>
        </Route>
      </Switch>
    </Router>
  );
};

const mapStateToProps = (state) => {
  const { LobbyReducer, LoginReducer } = state;
  return { status: LobbyReducer, credential: LoginReducer };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      ...Actions.LobbyAction,
      ...Actions.LoginAction,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
