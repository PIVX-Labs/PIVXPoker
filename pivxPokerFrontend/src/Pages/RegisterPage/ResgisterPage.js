import { useHistory, useRouteMatch } from "react-router";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import HomePageLayoutContainer from "../../Components/HomePage/HomePageLayoutContainer";
import Button from "../../StyledComponents/Button";
import { useState, useEffect } from "react";
import TextLarge from "../../StyledComponents/TextLarge";
import handleToast, { success } from "../../Components/toast";

import {
  MainFormButtonContainer,
  MainFormContainer,
} from "../LoginPage/LoginPage";

const RegisterPage = ({ credential, LoginSuccess, LogOutSuccess }) => {
  const { apiConfig, ApiCall } = global;
  const router=useRouteMatch();
  let [userName, setUserName] = useState("");
  let [password, setPassword] = useState("");
  let [cPassword, setCPassword] = useState("");
  let [referrer, setReferrer] = useState(router.params.referrer ? router.params.referrer : "");
  const history = useHistory();
  
  useEffect(() => {
     console.log(credential);
    if (credential && credential.loginToken) {
      history.push("/lobby");
    }
  }, [credential]);
  const handleValidation = () => {
    if (userName == null || userName == "") {
      handleToast("user name can't be blank");
      return false;
    } else if (password.length < 6) {
      handleToast("Password must be at least 6 characters long.");
      return false;
    } else if (password !== cPassword) {
      handleToast("Confirm Password doesn't match with password");
      return false;
    } else {
      return true;
    }
  };

  const handleRegister = async () => {
    const payLoad = {
      username: userName,
      password: password,
      referrer,
      device_id: "na",
      os: navigator.platform,
      appVersion: "web_v1",
      productName: "bytepoker",
    };

    if (handleValidation()) {
      try {
        const response = await ApiCall(
          apiConfig[apiConfig.currentEnv],
          apiConfig.signUp.url,
          apiConfig.signUp.method,
          "",
          payLoad
        );
        if (response.status === 200) {
          LoginSuccess(response.data);
        } else {
          handleToast(response.data.message);
          LogOutSuccess();
        }
      } catch (error) {
        if (error.response) handleToast(error.response.data.message);
        else handleToast("Request Failed!");
        LogOutSuccess();
      }
    }
  };
  return (
    <HomePageLayoutContainer>
      <MainFormContainer>
        <input
          autoComplete="new-userName"
          className="theme-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
        ></input>
        <input
          autoComplete="new-password"
          className="theme-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        ></input>
        <input
          autoComplete="confirm-new-password"
          className="theme-input"
          type="password"
          value={cPassword}
          onChange={(e) => setCPassword(e.target.value)}
          placeholder="Confirm Password"
        ></input>
        <input
          autoComplete="Referrer"
          className="theme-input"
          value={referrer}
          onChange={(e) => setReferrer(e.target.value.toLowerCase())}
          placeholder="Referrer"
        ></input>
      </MainFormContainer>
      <MainFormButtonContainer>
        <Button onClick={() => handleRegister()} variant="green">
          <TextLarge>Register</TextLarge>
        </Button>
        <Button onClick={() => history.push("/")} variant="red">
          <TextLarge>Cancel</TextLarge>
        </Button>
      </MainFormButtonContainer>
    </HomePageLayoutContainer>
  );
};
const mapStateToProps = (state) => {
  const { LoginReducer } = state;
  return { credential: LoginReducer };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      LoginSuccess: global.Actions.LoginAction.LoginSuccess,
      LogOutSuccess: global.Actions.LoginAction.LogOutSuccess,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
