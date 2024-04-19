import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import HomePageLayoutContainer from '../../Components/HomePage/HomePageLayoutContainer';
import handleToast from '../../Components/toast';
import Button from '../../StyledComponents/Button';
import Input from '../../StyledComponents/Input';
import TextLarge from '../../StyledComponents/TextLarge';
export const MainFormButtonContainer = styled.div`
  display: grid;
  grid-column-gap: 1rem;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  margin-top: 1.25rem;
`;

export const MainFormContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  grid-gap: 1.25rem;
`;

const LoginPage = ({ credential, LoginSuccess, LogOutSuccess }) => {
  const history = useHistory();
  const { apiConfig, ApiCall } = global;
  let [userName, setUserName] = useState('');
  let [password, setPassword] = useState('');

  const loginValidation = () => {
    if (userName == null || userName == '') {
      handleToast("Name can't be blank");
      return false;
    } else if (password.length < 6) {
      handleToast('Please Enter Password');
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    console.log(credential);
    if (credential && credential.loginToken) {
      history.push('/lobby');
    }
  }, [credential]);

  const handleLogin = async () => {
    if (loginValidation()) {
      const payLoad = {
        username: userName,
        password: password,
        forceLogin: false,
        appVersion: '1.0',
        device_id: 'n/a',
        AppId: '',
        fcmId: '',
        os: 'other',
        productName: 'BytePoker'
      };
      try {
        const response = await ApiCall(
          apiConfig[apiConfig.currentEnv],
          apiConfig.authenticate.url,
          apiConfig.authenticate.method,
          '',
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
        else handleToast('Request Failed!');
        LogOutSuccess();
      }
    }
  };

  return (
    <HomePageLayoutContainer>
      <MainFormContainer>
        <Input
          autoComplete="new-username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
        ></Input>
        <Input
          autoComplete="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        ></Input>
      </MainFormContainer>
      <MainFormButtonContainer>
        <Button onClick={() => handleLogin()} variant="green">
          <TextLarge>Login</TextLarge>
        </Button>
        <Button onClick={() => history.push('/')} variant="red">
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
      LogOutSuccess: global.Actions.LoginAction.LogOutSuccess
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
