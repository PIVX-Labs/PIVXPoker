import clsx from 'clsx';
import { AiOutlineLogin } from 'react-icons/ai';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import Avatar from 'react-avatar';
import { withRouter } from 'react-router-dom';
import Button from '../../Components/Button';
import PokerLogo from '../../Components/HomePage/PokerLogo';
import LobbyMenuIcon from '../../Components/Lobby/LobbyMenuIcon';
import MoneyLabel from '../../Components/Lobby/MoneyLabel';
import { showDot } from '../../shared/printConfig';
import MainTabs from './LobbyMainTabs';

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1.5rem;
`;

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  userAvatar: {
    padding: '1px',
    backgroundColor: '#130d1e',
    border: '1px solid white',
    borderRadius: '80px',
    width: '40px',
    height: '40px'
  }
}));

const LobbyHeader = (props) => {
  const { apiConfig } = global;
  let [showDropDown, handleDropDown] = useState(false);
  const classes = useStyles();
  const handleHistory = (router) => {
    props.history.push(router);
  };

  const logOut = () => {
    props.LogOutSuccess();
    handleHistory('/');
  };

  return (
    <div className="tournament-header">
      <TopSection>
        <div className="row col-12 justify-content-between">
          <PokerLogo />
          <div>
            {props.credential.loginToken ? (
              <span className="d-flex mb-2" style={{ alignItems: 'center' }}>
                {props.credential.loginUserAvatar ? (
                  <img
                    src={`${apiConfig.api}/uploads/avatars/${props.credential.loginUserAvatar}`}
                    alt="A"
                    className={clsx(classes.userAvatar, 'avatar-image')}
                  />
                ) : (
                  <Avatar
                    className="avatar-image"
                    name={props.credential.loginUserName}
                    size={40}
                    color="#130d1e"
                    round="40px"
                  />
                )}
                <MoneyLabel text={showDot(props.credential.loginUserPivx)} />
                <div onClick={(e) => handleDropDown(!showDropDown)}>
                  <LobbyMenuIcon />
                </div>
                <Backdrop
                  className={classes.backdrop}
                  open={showDropDown}
                  onClick={(e) => handleDropDown(!showDropDown)}
                >
                  <div className={'toggle-popup  ' + (showDropDown ? '' : 'd-none')}>
                    <div onClick={() => props.setProfileModal(true)}>Profile</div>
                    <div onClick={() => props.setDepositModal(true)}>Deposit</div>
                    <div onClick={() => props.setWithdrawalModal(true)}>Withdrawal</div>
                    <div onClick={() => props.setSecurityModal(true)}>Security</div>
                    <div onClick={() => props.setAffiliateModal(true)}>Affiliate</div>
                    <div onClick={() => props.setFeedbackModal(true)}>Feedback</div>
                    <div onClick={logOut}>Logout</div>
                  </div>
                </Backdrop>
              </span>
            ) : (
              <span className="d-flex mb-2" style={{ alignItems: 'center' }}>
                <Button justIcon color="" onClick={(e) => props.history.push('/')}>
                  <AiOutlineLogin />
                </Button>
              </span>
            )}
          </div>
        </div>
      </TopSection>
      <div className="row justify-content-between">
        <div>{!props.hideTabs && <MainTabs></MainTabs>}</div>
        {/* <Spacer className={!props.hideTabs ? "" : ""} spacing="1rem" elements="2"> */}

        {/* </Spacer> */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  credential: state.LoginReducer
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      LogOutSuccess: global.Actions.LoginAction.LogOutSuccess
    },
    dispatch
  );
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LobbyHeader));
