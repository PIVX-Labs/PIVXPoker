import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import io from "socket.io-client";
import BackgroundPageWrapper from "../../StyledComponents/BackgroundPageWrapper";
import LobbyHeader from "./LobbyHeader";
import LobbyTable from "./CashTable";
import Tournament from "./Tournament";
import SitInGo from "./SitnGo";
import handleToast, { success } from "../../Components/toast";
import SecurityModal from "Pages/LobbyPage/Modals/SecurityModal";
import ProfileModal from "Pages/LobbyPage/Modals/ProfileModal";
import WithdrawalModal from "Pages/LobbyPage/Modals/WithdrawalModal";
import DepositModal from "Pages/LobbyPage/Modals/DepositModal";
import AffiliateModal from "Pages/LobbyPage/Modals/AffiliateModal";
import FeedbackModal from "Pages/LobbyPage/Modals/FeedbackModal";
const LobbyPage = (props) => {
  const { apiConfig, ApiCall } = global;

  const [socket, setSocket] = useState("");
  const [cashGames, setCashGames] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [sitGames, setSitGames] = useState([]);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [affiliateModal, setAffiliateModal]=useState(false);
  const [securityModal, setSecurityModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);



  useEffect(() => {
    if (props.credential.loginToken) {
      setSocket(
        io(apiConfig.endPoint, {
          auth: {
            token: props.credential.loginToken,
          },
        })
      );
      if (!props.credential.loginUserDepositAddress) {
        (async () => {
          try {
            const response = await ApiCall(
              apiConfig[apiConfig.currentEnv],
              apiConfig.wallet.url,
              apiConfig.wallet.method,
              props.credential.loginToken
            );
            if (response.status === 200) {
              props.depositAddressChange(response.data.wallet);
            } else {
              handleToast(response.data.error);
            }
          } catch (error) {
            if (error.response) handleToast(error.response.data.error);
            else handleToast("Request Failed!");
          }
        })();
      }
    } else {
      setSocket(io(apiConfig.endPoint));
    }
  }, [props.credential.loginToken]);
  useEffect(() => {
    if (props.credential.loginToken) {
      setSocket(
        io(apiConfig.endPoint, {
          auth: {
            token: props.credential.loginToken,
          },
        })
      );
      if (!props.credential.loginUserShieldDepositAddress) {
        (async () => {
          try {
            const response = await ApiCall(
              apiConfig[apiConfig.currentEnv],
              apiConfig.wallet.url,
              apiConfig.wallet.method,
              props.credential.loginToken
            );
            if (response.status === 200) {
              props.DepositShieldAddressChange(response.data.wallet);
            } else {
              handleToast(response.data.error);
            }
          } catch (error) {
            if (error.response) handleToast(error.response.data.error);
            else handleToast("Request Failed!");
          }
        })();
      }
    } else {
      setSocket(io(apiConfig.endPoint));
    }
  }, [props.credential.loginToken]);
  useEffect(() => {
    if (socket) {
      //The res comes from mainHandler.js
      socket.on("connect", () => {
        // when connection started
        console.log("connect");
        socket.emit("lobby", (res) => {
          console.log("emit lobby")
          console.log(res)
          props.PIVXChange(res.pivx);
          setCashGames(
            res.cashGames.map((ele) => {
              ele.current =
                ele.players.findIndex(
                  (ele1) => ele1 === props.credential.loginUserId
                ) > -1
                  ? true
                  : false;
              return ele;
            })
          );
          setTournaments(
            
            res.tournaments.map((ele) => {
              ele.current =
                ele.players.findIndex(
                  (ele1) => ele1 === props.credential.loginUserId
                ) > -1
                  ? true
                  : false;
              return ele;
            })
          );
          setSitGames(
            res.sitGames.map((ele) => {
              ele.current =
                ele.players.findIndex(
                  (ele1) => ele1 === props.credential.loginUserId
                ) > -1
                  ? true
                  : false;
              return ele;
            })
          );
        });
      });
      socket.on("connect_error", (err) => {
        console.error(err.message);
      });
      socket.on("message", (res) => {
        if (res.message) {
          handleToast(res.message, success);
        }
        if (res.pivx) {
          props.PIVXChange(res.pivx);
        }
      });
      socket.on("cash:lobby", (res) => {
        setCashGames(
          res.cashGames.map((ele) => {
            ele.current =
              ele.players.findIndex(
                (ele1) => ele1 === props.credential.loginUserId
              ) > -1
                ? true
                : false;
            return ele;
          })
        );
      });
      socket.on("sit:lobby", (res) => {
        setSitGames(
          res.sitGames.map((ele) => {
            ele.current =
              ele.players.findIndex(
                (ele1) => ele1 === props.credential.loginUserId
              ) > -1
                ? true
                : false;
            return ele;
          })
        );
      });



          //ISSUE WAS TO DO WITH THE WEIRD SOCKET CONNECTION TRYING TO CONNECT FROM THE EMIT ON TOURNAMENT GAME HANDLER 
          //issue still exists and its something to do with it not passing the right data or not grabbing from the right data
          //Make sure to pay attention to socket.on vs socket.emit
          //emit feeds to the router


      socket.on("tournament:lobby", (res) => {
        console.log("tournament:lobby")
        console.log(res.TournamentGames)
        setTournaments(
          res.TournamentGames.map((ele) => {
            ele.current =
              ele.players.findIndex(
                (ele1) => ele1 === props.credential.loginUserId
              ) > -1
                ? true
                : false;
            return ele;
          })
        );
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <BackgroundPageWrapper>
      <LobbyHeader
        setDepositModal={setDepositModal}
        setWithdrawalModal={setWithdrawalModal}
        setProfileModal={setProfileModal}
        setSecurityModal={setSecurityModal}
        setAffiliateModal={setAffiliateModal}
        setFeedbackModal={setFeedbackModal}
      />
      {props.currentTab === props.tabList[0] ? (
        <LobbyTable cashGames={cashGames} socket={socket} />
      ) : props.currentTab === props.tabList[1] ? (
        <SitInGo sitGames={sitGames} socket={socket} />
      ) : props.currentTab === props.tabList[2] ? (
        <Tournament tournaments={tournaments} socket={socket} />
      ) : null}

      <DepositModal
        depositModal={depositModal}
        setDepositModal={setDepositModal}
        credential={props.credential}
      />
      <WithdrawalModal
        withdrawalModal={withdrawalModal}
        setWithdrawalModal={setWithdrawalModal}
        credential={props.credential}
        PIVXChange={props.PIVXChange}
        walletAddressChange={props.walletAddressChange}
      />
      <ProfileModal
        profileModal={profileModal}
        setProfileModal={setProfileModal}
        credential={props.credential}
        photoChange={props.photoChange}
      />
      <SecurityModal
        securityModal={securityModal}
        setSecurityModal={setSecurityModal}
        credential={props.credential}
      />
      <AffiliateModal
        affiliateModal={affiliateModal}
        setAffiliateModal={setAffiliateModal}
        credential={props.credential}
      />
      <FeedbackModal
      feedbackModal={feedbackModal}
      setFeedbackModal={setFeedbackModal}
      SetEmail={props.SetEmail}
      credential={props.credential}
      />
    </BackgroundPageWrapper>
  );
};

const mapStateToProps = (state) => ({
  currentTab: state.LobbyReducer.currentTab,
  tabList: state.LobbyReducer.tabList,
  credential: state.LoginReducer,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      PIVXChange: global.Actions.LoginAction.PIVXChange,
      walletAddressChange: global.Actions.LoginAction.WalletAddressChange,
      depositAddressChange: global.Actions.LoginAction.DepositAddressChange,
      photoChange: global.Actions.LoginAction.PhotoChange,
      SetEmail:global.Actions.LoginAction.SetEmail,
    },
    dispatch
  );
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LobbyPage)
);
