import { connect } from 'react-redux';
import React, { useRef } from 'react';
import { withRouter } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import io from 'socket.io-client';
import Button from '../../Components/Button';
import PokerTable from '../../images/poker-table.png';
import PokerTableMobile from '../../images/poker-table-mobile.png';
import PrettoSlider from '../../Components/PrettoSlider';
import {
  showKilo,
  showPotChips,
  showDot,
  showTurnTime,
  showTableSize,
  showMaxTimeBank
} from '../../shared/printConfig';
import { AiFillWechat, AiOutlineClose, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { MdMenu } from 'react-icons/md';
import '../../css/games.css';
import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { getCards, getCardSrc } from '../../Components/cards';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '../../Components/Chip';
import gameStyle from '../../jss/pages/cashGameStyle';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { chips, ranks } from '../../shared/constants';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import handleToast, { success } from '../../Components/toast';

const useStyles = makeStyles(gameStyle);
const CashGame = ({ match, history, status, credential, PIVXChange, LogOutSuccess }) => {
  const reference = useRef();
  const classes = useStyles();
  const { apiConfig } = global;
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up('lg'));
  const md = useMediaQuery(theme.breakpoints.up('md'));
  const sm = useMediaQuery(theme.breakpoints.up('sm'));
  const xs = useMediaQuery(theme.breakpoints.up('xs'));
  const [winnerText, setWinnerText] = useState('');
  const [resultText, setResultText] = useState('');
  const [passwordModal, setPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [seat, setSeat] = useState('');
  const [socket, setSocket] = useState('');
  const [chatOpen, setChatOpen] = useState(!status.mobileView);
  let [message, setMessage] = useState('');
  let [messageList, setMessageList] = useState([]);
  const [table, setTable] = useState('');
  const [mySeat, setMySeat] = useState(-1);
  const [progress, setProgress] = useState(100);
  const [call, setCall] = useState(0);
  const [callStatus, setCallStatus] = useState('');
  const [raise, setRaise] = useState(0);
  const [minRaise, setMinRaise] = useState(0);
  const [maxRaise, setMaxRaise] = useState(0);
  const [standMenu, setStandMenu] = React.useState(null);
  const [mainMenu, setMainMenu] = React.useState(null);
  const [eventPositions, setEventPositions] = React.useState([]);
  const [buyInModal, setBuyInModal] = useState(false);
  const [buyIn, setBuyIn] = useState(0);
  const [loading, setLoading] = useState(0);
  const [infoModal, setInfoModal] = useState(false);
  const gotoLobby = () => {
    history.push('/lobby');
  };
  const logout = () => {
    socket.emit('cash:leave', match.params.room, (res) => {
      if (res == true) {
        LogOutSuccess();
        history.push('/');
      }
    });
  };
  const changeStand = () => {
    setStandMenu(null);
    socket.emit('cash:stand', match.params.room, (res) => {
      setTable((table) => {
        const players = table.players.map((ele) => ele);
        players[mySeat].stand = res;
        return {
          ...table,
          players
        };
      });
    });
  };
  const leaveTable = () => {
    setStandMenu(null);
    socket.emit('cash:leave', match.params.room, (res) => {
      if (res == true) {
        setTable((table) => {
          const players = table.players.map((ele) => ele);
          players[mySeat] = null;

          setMySeat(-1);

          return {
            ...table,
            players
          };
        });
      }
    });
  };
  const setBehavior = (behavior) => {
    socket.emit('cash:behavior', match.params.room, behavior, (behavior) => {
      setTable((table) => {
        const newPlayers = JSON.parse(JSON.stringify(table.players));
        newPlayers[mySeat].behavior = behavior;
        return {
          ...table,
          players: newPlayers
        };
      });
    });
  };
  const bet = (status, amount) => {
    socket.emit('cash:bet', match.params.room, { status, amount });
  };
  const requestJoinTable = (key) => {
    if (!credential.loginToken) {
      handleToast('Please login to join the game!');
      return;
    }
    if (
      !table.players.find((ele) =>
        ele != null ? ele.user.id === credential.loginUserId : false
      ) &&
      table.players[key] === null
    ) {
      setSeat(key);
      if (table.privacy) {
        setPasswordModal(true);
      } else {
        setBuyInModal(true);
      }
    }
  };
  const joinTable = () => {
    setPasswordModal(false);
    setBuyInModal(false);
    if (!credential.loginToken) {
      handleToast('Please login to join the game!');
    }
    if (
      !table.players.find((ele) =>
        ele != null ? ele.user.id === credential.loginUserId : false
      ) &&
      table.players[seat] === null
    ) {
      socket.emit('cash:join', match.params.room, seat, password, buyIn, (res) => {
        if (res.status) {
          setTable(res.cashGame);
          PIVXChange(res.pivx);
          let id = res.cashGame.players.findIndex(
            (ele) => ele != null && ele.user.id == credential.loginUserId
          );
          console.log('cash:join emit');

          if (id > -1) {
            setMySeat(id);
          }
        } else handleToast(res.message);
      });
    }
  };
  const sendMessage = (e) => {
    console.log(e.target.input_message.value);
    e.preventDefault();
    if (e.target.input_message.value != '') {
      socket.emit('chat:send', 'cash_' + match.params.room, e.target.input_message.value);
      setMessage('');
    }
  };
  const gameChat = (
    <div className="game-chat">
      <form
        className={classes.chatForm}
        onSubmit={(e) => {
          sendMessage(e);
        }}
      >
        <div className="message-view">
          {messageList.map((msg, i) => (
            <div key={i}>
              <span className={credential.loginUserId == msg.sender.id ? ' text-success ' : ''}>
                {msg.sender.username}:{' '}
                <span className={credential.loginUserId == msg.sender.id ? ' text-success ' : ''}>
                  {msg.message}
                </span>{' '}
              </span>
            </div>
          ))}
        </div>
        <div className="input-group chat-input-box">
          <input
            type="text"
            className="form-control"
            name="input_message"
            placeholder="Type message here...."
            aria-label="Type message here...."
            aria-describedby="basic-addon2"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <div className="input-group-append">
            <span className="input-group-text bg-white" id="basic-addon2">
              <i className="fa text-success fa-paper-plane" aria-hidden="true"></i>
            </span>
          </div>
        </div>

        {/* <input className="message-box" name="message" value={message} onChange={e => setMessage(e.target.value)}></input> */}
      </form>
    </div>
  );
  const raiseInc = () => {
    setRaise((prev) => {
      return prev < maxRaise ? prev + 1 : prev;
    });
  };
  const raiseDec = () => {
    setRaise((prev) => {
      return prev > minRaise ? prev - 1 : prev;
    });
  };
  const copyLink = () => {
    const tmp_tag = document.createElement('input');
    tmp_tag.value = apiConfig.app + '/games/cash/' + table.id;
    reference.current.appendChild(tmp_tag);
    tmp_tag.select();
    document.execCommand('copy');
    reference.current.removeChild(tmp_tag);
    handleToast('Address copied!', success);
  };
  useEffect(() => {
    if (credential.loginToken) {
      setSocket(
        io(apiConfig.endPoint, {
          auth: {
            token: credential.loginToken
          }
        })
      );
    } else {
      setSocket(io(apiConfig.endPoint));
    }
  }, [credential.loginToken]);
  useEffect(() => {
    if (table) setLoading(table.players.filter((ele) => ele != null && !ele.stand).length);
    return () => {};
  }, [table?.players]);
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        // when connection started
        console.log('connect');
      });
      socket.on('message', (res) => {
        if (res.message) {
          handleToast(res.message, success);
        }
        if (res.pivx) {
          PIVXChange(res.pivx);
        }
      });

      socket.emit('cash:enter', match.params.room, (res) => {
        setTable(res.cashGame);
        setBuyIn(res.cashGame.buyIn[0]);
        console.log(res.cashGame);
        let id = res.cashGame.players.findIndex(
          (ele) => ele != null && ele.user.id == credential.loginUserId
        );

        console.log('enter emit');
        if (id > -1) {
          setMySeat(id);
          if (res.cashGame.allowedBet) {
            setCall(res.cashGame.allowedBet.call);
            setMinRaise(res.cashGame.allowedBet.minRaise);
            setMaxRaise(res.cashGame.allowedBet.maxRaise);
            setRaise(res.cashGame.allowedBet.minRaise);
            setCallStatus(res.cashGame.allowedBet.status);
          }
        }
      });
      socket.on('connect_error', (err) => {
        console.error('cash:error');
        console.error(err.message);
      });
      socket.on('cash:join', ({ playerNo, player }) => {
        console.log('cash join');
        setTable((table) => {
          const newPlayers = JSON.parse(JSON.stringify(table.players));
          newPlayers[playerNo] = player;
          return {
            ...table,
            players: newPlayers
          };
        });
      });
      socket.on('cash:start', ({ cashGame }) => {
        console.log('cash start');
        console.log(cashGame.players);
        let id = cashGame.players.findIndex(
          (ele) => ele != null && ele.user.id == credential.loginUserId
        );
        if (
          id > -1 &&
          !cashGame.players[id].fold &&
          cashGame.players[id].ready &&
          !cashGame.players[id].stand
        ) {
          setMySeat(id);
          socket.emit('cash:showMyCards', match.params.room, ({ cards }) => {
            setTable((table) => {
              const players = JSON.parse(JSON.stringify(table.players));
              console.log(cards);
              players[id].cards = cards;
              console.log(players);
              return {
                ...table,
                players
              };
            });
          });
        }
        setTable(cashGame);

        setProgress(100);
      });
      socket.on('cash:turn', ({ position, time, amount }) => {
        console.log('cash:turn');
        setTable((table) => {
          const newPlayers = table.players.map((ele) => {
            if (ele != null) {
              ele.turn = false;
            }
            return ele;
          });
          if (newPlayers[position] != null) newPlayers[position].turn = true;
          if (amount) {
            setCall(amount.call);
            setMinRaise(amount.minRaise);
            setMaxRaise(amount.maxRaise);
            setRaise(amount.minRaise);
            setCallStatus(amount.status);
          }

          setProgress((table.turnTime * 1000 - time) / (table.turnTime * 10));
          return {
            ...table,
            players: newPlayers
          };
        });
      });
      socket.on('cash:bet', ({ position, bet, balance, fold, allIn, stand, pot, raise, call }) => {
        console.log('cash:bet');
        console.log({
          position,
          bet,
          balance,
          fold,
          allIn,
          stand,
          pot,
          raise
        });
        setTable((table) => {
          const newPlayers = JSON.parse(JSON.stringify(table.players));
          newPlayers[position].bet = bet;
          newPlayers[position].balance = balance;
          newPlayers[position].fold = fold;
          newPlayers[position].allIn = allIn;
          newPlayers[position].stand = stand;
          newPlayers[position].pot = pot;
          newPlayers[position].turn = false;
          newPlayers[position].raise = raise;
          newPlayers[position].call = call;
          console.log(newPlayers[position]);
          return {
            ...table,
            players: newPlayers
          };
        });
        setEventPositions([position]);
      });
      socket.on('cash:stand', ({ position }) => {
        setTable((table) => {
          const newPlayers = JSON.parse(JSON.stringify(table.players));
          newPlayers[position].stand = 1;
          console.log('cash:stand');
          console.log(position);
          console.log(newPlayers);
          return {
            ...table,
            players: newPlayers
          };
        });
        setEventPositions([position]);
      });
      socket.on('cash:card', ({ tableCards, pot }) => {
        console.log(tableCards);
        setTimeout(() => {
          setEventPositions([]);
        }, 500);

        setTable((table) => {
          const newPlayers = table.players.map((ele) => {
            if (ele != null) {
              ele.bet = 0;
              return ele;
            } else {
              return ele;
            }
          });

          return {
            ...table,
            tableCards,
            pot,
            players: newPlayers
          };
        });
      });
      socket.on('cash:open', (cashGame) => {
        console.log('open');
        console.log(cashGame);
        setTable(cashGame);
      });
      socket.on('cash:result', (cashGame, status0, status1) => {
        console.log('result');
        console.log(cashGame);
        setWinnerText(status0);
        setResultText(status1);
        setTable(cashGame);
      });

      socket.on('cash:closed', () => {
        history.push('/lobby');
      });
      socket.on('cash:sit', ({ position }) => {
        setTable((table) => {
          console.log('tabletabletabletable', table);
          const newPlayers = JSON.parse(JSON.stringify(table.players));
          newPlayers[position].stand = false;
          console.log('cash:sit');
          return {
            ...table,
            players: newPlayers
          };
        });
      });
      socket.on('cash:leave', ({ position }) => {
        setTable((table) => {
          const newPlayers = JSON.parse(JSON.stringify(table.players));
          newPlayers[position] = null;
          console.log('cash:leave');
          return {
            ...table,
            players: newPlayers
          };
        });
      });
      socket.on('cash:playersOut', (positions) => {
        console.log('cash:out');
        console.log(positions);
        setEventPositions(positions);
        setTable((table) => {
          const newPlayers = table.players.map((ele) => {
            return ele;
          });
          for (let i = 0; i < positions.length; i++) {
            newPlayers[positions[i]] = null;
          }

          console.log(newPlayers);
          return {
            ...table,
            players: newPlayers
          };
        });
      });
      socket.on('chat:receive', (message) => {
        setMessageList((list) => {
          return [...list, message];
        });
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);
  useEffect(() => {
    setChatOpen(!status.mobileView);
  }, [status.mobileView]);
  console.log('table', table);

  return (
    <div className="game-page">
      <div className="header-icons"></div>
      <div className={classes.root}>
        <Drawer
          variant="persistent"
          anchor={'left'}
          open={chatOpen}
          onClose={() => setChatOpen(!chatOpen)}
          classes={{
            paper: classes.drawerPaper
          }}
          className={classes.drawer}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {gameChat}
          <Button
            justIcon
            size="sm"
            onClick={() => setChatOpen(!chatOpen)}
            color="tumblr"
            style={{
              position: 'absolute',
              right: '-31px',
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px',
              borderTopLeftRadius: '0px',
              borderBottomLeftRadius: '0px',
              padding: '4px'
            }}
          >
            <AiFillWechat />
          </Button>
        </Drawer>

        <div
          className={clsx(
            classes.content,
            {
              [classes.contentShift]: chatOpen
            },
            classes[`table_${table.tableSize}`]
          )}
        >
          <div className={classes.menu_bar}>
            <Button justIcon onClick={(event) => setMainMenu(event.currentTarget)}>
              <MdMenu />
            </Button>
            <Menu
              id="main-menu"
              anchorEl={mainMenu}
              className={classes.playerMenu}
              keepMounted
              open={Boolean(mainMenu)}
              onClose={() => setMainMenu(null)}
            >
              <MenuItem onClick={gotoLobby}>Lobby</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
            <div className={classes.balance_pad}>
              <span>
                Balance : {showDot(credential.loginUserPivx)} <small>satoshi</small>
              </span>
              {table && table.players[mySeat] && table.players[mySeat].balance ? (
                <span>
                  In Play : {showDot(table.players[mySeat].balance)} <small>satoshi</small>
                </span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={classes.title_bar}>
            <span onClick={() => setInfoModal(true)}>{table.name}</span>
          </div>
          <div className={classes.table_pad}>
            {table
              ? table.players.map((ele, key) => {
                  if (ele == null)
                    return (
                      <div
                        key={key}
                        className={clsx(
                          {
                            'right-hand': key < Math.ceil(table.tableSize / 2) && key != 0,
                            stand: ele != null && ele.stand
                          },
                          'users-on-board'
                        )}
                      >
                        <Button
                          color="pivx3"
                          className="user-avatar"
                          justIcon
                          round
                          onClick={() => requestJoinTable(key)}
                        >
                          +
                        </Button>
                        {eventPositions.includes(key) ? (
                          <div
                            className={clsx(
                              classes.eventPlayer,
                              'animate__animated animate__fadeOutUp animate__slow'
                            )}
                          >
                            Out
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    );
                  else {
                    return (
                      <div
                        key={key}
                        className={clsx(
                          {
                            'right-hand': key < Math.ceil(table.tableSize / 2) && key != 0,
                            stand: ele != null && ele.stand
                          },
                          'users-on-board'
                        )}
                        onClick={(event) => {
                          if (key == mySeat) setStandMenu(event.currentTarget);
                        }}
                      >
                        <div className="chips-pad">
                          <div className="chip-stacks">
                            {showPotChips(ele.bet, chips).map((ele1, key1) => (
                              <div key={key1} className="chip-stack">
                                {ele1.map((ele2, key2) => (
                                  <Chip weight={ele2} key={key2} />
                                ))}
                              </div>
                            ))}
                          </div>
                          <div className="chips-amount total">{ele.bet > 0 ? ele.bet : ''}</div>
                        </div>

                        {ele.ready == true &&
                        ele.fold == false &&
                        ele.stand == false &&
                        ele.cards != null ? (
                          ele.win ? (
                            <div className="player-cards animate__animated animate__heartBeat animate__repeat-3 animate__slower">
                              <div className="cards">
                                {getCards(getCardSrc(ele.cards[0] + ''), 'choosen-card')}
                              </div>
                              <div className="cards">
                                {getCards(getCardSrc(ele.cards[1] + ''), 'choosen-card')}
                              </div>
                            </div>
                          ) : (
                            <div className="player-cards animate__animated animate__fadeInUp">
                              <div className="cards">
                                {getCards(getCardSrc(ele.cards[0] + ''), 'choosen-card')}
                              </div>
                              <div className="cards">
                                {getCards(getCardSrc(ele.cards[1] + ''), 'choosen-card')}
                              </div>
                            </div>
                          )
                        ) : (
                          ''
                        )}

                        <div className="user-info">
                          <span>{ele.user.username}</span>
                          <span className={classes.balance}> {showKilo(ele.balance)}</span>
                        </div>
                        {ele.turn && ele.ready && !ele.stand ? (
                          <div className={classes.progressBar}>
                            <LinearProgress variant="determinate" value={progress} />
                          </div>
                        ) : (
                          ''
                        )}
                        {ele.avatar ? (
                          <img
                            src={`${apiConfig.api}/uploads/avatars/${ele.avatar}`}
                            alt="A"
                            className={clsx(classes.userAvatar, 'user-avatar')}
                          />
                        ) : (
                          <Avatar
                            className="user-avatar"
                            color="rgba(27,78,136,1)"
                            name={ele.user.username}
                            size={lg ? 55 : md ? 45 : sm ? 40 : xs ? 35 : 55}
                            round="80px"
                          />
                        )}

                        {key == table.dealer ? (
                          <Avatar
                            className="user-dealer"
                            name="D"
                            size={lg ? 20 : md ? 20 : sm ? 15 : xs ? 12 : 20}
                            color="green"
                            round="80px"
                          />
                        ) : (
                          ''
                        )}
                        {
                          //   ele.user.id === credential.loginUserId ? (
                          //   <Avatar
                          //     className="user-me"
                          //     name="You"
                          //     size={lg ? 20 : md ? 20 : sm ? 15 : xs ? 12 : 20}
                          //     color="blue"
                          //     round="80px"
                          //     />
                          // ) : (
                          //   ""
                          // )
                        }
                        {eventPositions.includes(key) ? (
                          <div
                            className={clsx(
                              classes.eventPlayer,
                              'animate__animated animate__fadeOutUp animate__slow'
                            )}
                          >
                            {ele.stand
                              ? 'Stand'
                              : ele.fold
                              ? 'Fold'
                              : ele.allIn
                              ? 'All In'
                              : ele.raise
                              ? 'Raise'
                              : ele.call
                              ? 'Call'
                              : 'Check'}
                          </div>
                        ) : (
                          ''
                        )}
                        {ele.win ? (
                          <div
                            className={clsx(
                              classes.eventPlayer,
                              classes.winEvent,
                              'animate__animated animate__fadeOutUp animate__slower'
                            )}
                          >
                            {ranks[ele.rank]}
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    );
                  }
                })
              : ''}
            <Menu
              id="simple-menu"
              anchorEl={standMenu}
              className={classes.playerMenu}
              keepMounted
              open={Boolean(standMenu)}
              onClose={() => setStandMenu(null)}
            >
              <MenuItem onClick={changeStand}>
                {table &&
                mySeat > -1 &&
                table.players[mySeat] != null &&
                table.players[mySeat].stand
                  ? 'Sit'
                  : 'Stand'}
              </MenuItem>
              <MenuItem onClick={leaveTable}>Leave</MenuItem>
            </Menu>
            <div className={classes.status_pad}>
              {loading == 0 ? (
                "Click '+' to join the table"
              ) : loading == 1 ? (
                <React.Fragment>
                  <CircularProgress color="primary" />
                  <br />
                  Waiting for players
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {winnerText}
                  <br />
                  {resultText}
                </React.Fragment>
              )}
            </div>
            <div className={classes.table_cards + ' table-cards'}>
              <div className="card-center-possition">
                {table.tableCards
                  ? table.tableCards.map((ele, key) => (
                      <React.Fragment key={key}>
                        {getCards(
                          getCardSrc(ele + ''),
                          'card-size animate__animated animate__flipInY'
                        )}
                      </React.Fragment>
                    ))
                  : ''}
              </div>
              <div className="chips-pad">
                <div className="chip-stacks">
                  {showPotChips(table.pot, chips).map((ele, key) => (
                    <div key={key} className="chip-stack">
                      {ele.map((ele2, key2) => (
                        <Chip weight={ele2} key={key2} />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="chips-amount total">{table.pot > 0 ? table.pot : ''}</div>
              </div>
            </div>
            <Hidden xsDown>
              <img className={classes.background} src={PokerTable} alt="Table" />
            </Hidden>
            <Hidden smUp>
              <img className={classes.background} src={PokerTableMobile} alt="Table" />
            </Hidden>
          </div>
          {table &&
          table.playing &&
          mySeat > -1 &&
          table.players[mySeat] != null &&
          !table.players[mySeat].stand ? (
            table.players[mySeat].turn ? (
              <div className={classes.control_pad}>
                <Button color="warning" onClick={() => bet('fold')}>
                  Fold
                </Button>
                {callStatus == 'allIn' ? (
                  <Button color="danger" onClick={() => bet('allIn')}>
                    All In
                  </Button>
                ) : callStatus == 'allIn_minRaise' ? (
                  <React.Fragment>
                    <Button color="info" onClick={() => bet('call', call)}>
                      {call - table.players[mySeat].bet > 0
                        ? 'Call ' + (call - table.players[mySeat].bet)
                        : 'Check'}
                    </Button>
                    <Button color="danger" onClick={() => bet('allIn')}>
                      All In
                    </Button>
                  </React.Fragment>
                ) : callStatus == 'allIn_maxRaise' ? (
                  <React.Fragment>
                    <Button color="info" onClick={() => bet('call', call)}>
                      {call - table.players[mySeat].bet > 0 ? 'Call ' + call : 'Check'}
                    </Button>
                    <Button
                      justIcon
                      round
                      size="sm"
                      className={classes.simpleButton}
                      onClick={raiseDec}
                    >
                      <AiOutlineMinus />
                    </Button>
                    <PrettoSlider
                      value={raise}
                      onChange={(e, val) => setRaise(val)}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      getAriaValueText={(val) => val}
                      min={minRaise}
                      max={maxRaise}
                      color={'primary'}
                      className={classes.slider}
                    />
                    <Button
                      justIcon
                      round
                      size="sm"
                      className={classes.simpleButton}
                      onClick={raiseInc}
                    >
                      <AiOutlinePlus />
                    </Button>
                    {raise == maxRaise ? (
                      <Button color="danger" onClick={() => bet('allIn')}>
                        All In
                      </Button>
                    ) : (
                      <Button color="primary" onClick={() => bet('call', raise)}>
                        Raise ({raise})
                      </Button>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Button color="info" onClick={() => bet('call', call)}>
                      {call - table.players[mySeat].bet > 0 ? 'Call ' + call : 'Check'}
                    </Button>
                    <Button
                      justIcon
                      round
                      size="sm"
                      className={classes.simpleButton}
                      onClick={raiseDec}
                    >
                      <AiOutlineMinus />
                    </Button>
                    <PrettoSlider
                      value={raise}
                      onChange={(e, val) => setRaise(val)}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      getAriaValueText={(val) => val}
                      min={minRaise}
                      max={maxRaise}
                      color={'primary'}
                      className={classes.slider}
                    />
                    <Button
                      justIcon
                      round
                      size="sm"
                      className={classes.simpleButton}
                      onClick={raiseInc}
                    >
                      <AiOutlinePlus />
                    </Button>
                    <Button color="primary" onClick={() => bet('call', raise)}>
                      Raise ({raise})
                    </Button>
                  </React.Fragment>
                )}
              </div>
            ) : (
              <div className={classes.control_pad}>
                {!table.players[mySeat].behavior ? (
                  <Button color="warning" onClick={() => setBehavior(true)}>
                    Check
                  </Button>
                ) : (
                  <Button color="info" onClick={() => setBehavior(false)}>
                    Stop Check
                  </Button>
                )}
              </div>
            )
          ) : (
            ''
          )}

          {!chatOpen ? (
            <Button
              justIcon
              onClick={() => setChatOpen(true)}
              color="behance"
              style={{
                position: 'absolute',
                left: '0px',
                borderTopRightRadius: '10px',
                borderBottomRightRadius: '10px',
                borderTopLeftRadius: '0px',
                borderBottomLeftRadius: '0px',
                padding: '4px'
              }}
            >
              <AiFillWechat />
            </Button>
          ) : (
            ''
          )}
        </div>
        {table && table.privacy ? (
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={passwordModal}
            onClose={() => setPasswordModal(!passwordModal)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
            className={classes.modal}
          >
            <Fade in={passwordModal}>
              <div className={classes.modal_paper}>
                <h4 className={classes.modal_title}>
                  Join Table
                  <Button
                    simple
                    round
                    justIcon
                    className={classes.modal_close}
                    onClick={() => setPasswordModal(false)}
                  >
                    <AiOutlineClose />
                  </Button>
                </h4>
                <Grid container spacing={3}>
                  <Grid item className={classes.modal_center}>
                    <h5></h5>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item className={classes.modal_center}>
                    Your Balance : {credential.loginUserPivx}
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} className={classes.modal_center}>
                    <Button
                      justIcon
                      round
                      size="sm"
                      style={{ marginRight: '10px' }}
                      className={classes.simpleButton}
                      onClick={() =>
                        setBuyIn((prev) => {
                          return buyIn > table.buyIn[0] ? buyIn - 1 : buyIn;
                        })
                      }
                    >
                      <AiOutlineMinus />
                    </Button>
                    <PrettoSlider
                      value={buyIn}
                      onChange={(e, val) => setBuyIn(val)}
                      valueLabelDisplay="on"
                      aria-labelledby="range-slider"
                      getAriaValueText={(val) => val}
                      min={table.buyIn[0]}
                      max={
                        table.buyIn[1] > credential.loginUserPivx
                          ? credential.loginUserPivx
                          : table.buyIn[1]
                      }
                      color={'primary'}
                      className={classes.modal_slider}
                      style={{ width: '70%' }}
                    />
                    <Button
                      justIcon
                      round
                      size="sm"
                      className={classes.simpleButton}
                      style={{ marginLeft: '10px' }}
                      onClick={() =>
                        setBuyIn((prev) => {
                          return buyIn <
                            (table.buyIn[1] > credential.loginUserPivx
                              ? credential.loginUserPivx
                              : table.buyIn[1])
                            ? buyIn + 1
                            : buyIn;
                        })
                      }
                    >
                      <AiOutlinePlus />
                    </Button>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item className={classes.modal_center}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        InputProps={{
                          value: password,
                          onChange: (e) => setPassword(e.target.value)
                        }}
                      />{' '}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={3} className="mt-3">
                  <Button color="primary" style={{ margin: 'auto auto' }} onClick={joinTable}>
                    O K
                  </Button>
                </Grid>
              </div>
            </Fade>
          </Modal>
        ) : table ? (
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={buyInModal}
            onClose={() => setBuyInModal(!buyInModal)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
            className={classes.modal}
          >
            <Fade in={buyInModal}>
              <div className={classes.modal_paper}>
                <h4 className={classes.modal_title}>
                  Join Table
                  <Button
                    simple
                    round
                    justIcon
                    className={classes.modal_close}
                    onClick={() => setBuyInModal(false)}
                  >
                    <AiOutlineClose />
                  </Button>
                </h4>
                <Grid container spacing={3}>
                  <Grid item className={classes.modal_center}>
                    <h5></h5>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item className={classes.modal_center}>
                    Your Balance : {credential.loginUserPivx}
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} className={classes.modal_center}>
                    <Button
                      justIcon
                      round
                      size="sm"
                      style={{ marginRight: '10px' }}
                      className={classes.simpleButton}
                      onClick={() =>
                        setBuyIn((prev) => {
                          return buyIn > table.buyIn[0] ? buyIn - 1 : buyIn;
                        })
                      }
                    >
                      <AiOutlineMinus />
                    </Button>
                    <PrettoSlider
                      value={buyIn}
                      onChange={(e, val) => setBuyIn(val)}
                      valueLabelDisplay="on"
                      aria-labelledby="range-slider"
                      getAriaValueText={(val) => val}
                      min={table.buyIn[0]}
                      max={
                        table.buyIn[1] > credential.loginUserPivx
                          ? credential.loginUserPivx
                          : table.buyIn[1]
                      }
                      color={'primary'}
                      className={classes.modal_slider}
                      style={{ width: '70%' }}
                    />
                    <Button
                      justIcon
                      round
                      size="sm"
                      className={classes.simpleButton}
                      style={{ marginLeft: '10px' }}
                      onClick={() =>
                        setBuyIn((prev) => {
                          return buyIn <
                            (table.buyIn[1] > credential.loginUserPivx
                              ? credential.loginUserPivx
                              : table.buyIn[1])
                            ? buyIn + 1
                            : buyIn;
                        })
                      }
                    >
                      <AiOutlinePlus />
                    </Button>
                  </Grid>
                </Grid>
                <Grid container spacing={3} className="mt-3">
                  <Button color="primary" style={{ margin: 'auto auto' }} onClick={joinTable}>
                    O K
                  </Button>
                </Grid>
              </div>
            </Fade>
          </Modal>
        ) : (
          ''
        )}
        {table ? (
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={infoModal}
            onClose={() => setInfoModal(!infoModal)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
            className={classes.modal}
          >
            <Fade in={infoModal}>
              <div className={classes.small_modal_paper}>
                <h4 className={classes.modal_title}>
                  Table Summary
                  <Button
                    simple
                    round
                    justIcon
                    className={classes.modal_close}
                    onClick={() => setInfoModal(false)}
                  >
                    <AiOutlineClose />
                  </Button>
                </h4>
                <h4>{table.name}</h4>
                <Grid container spacing={3}>
                  <Grid item xs={6} className={classes.modal_label}>
                    Host:
                  </Grid>
                  <Grid item xs={6} className={classes.modal_field}>
                    {table.creator.username}
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={6} className={classes.modal_label}>
                    Blinds:
                  </Grid>
                  <Grid item xs={6} className={classes.modal_field}>
                    {table.blinds}/{table.blinds == 2 ? 5 : table.blinds * 2}
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={6} className={classes.modal_label}>
                    Turn Time:
                  </Grid>
                  <Grid item xs={6} className={classes.modal_field}>
                    {showTurnTime(table.turnTime)}
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={6} className={classes.modal_label}>
                    Max Time Bank:
                  </Grid>
                  <Grid item xs={6} className={classes.modal_field}>
                    {showMaxTimeBank(table.maxTimeBank)}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={6} className={classes.modal_label}>
                    Players:
                  </Grid>
                  <Grid item xs={6} className={classes.modal_field}>
                    {table.players.filter((ele) => ele != null).length}/{table.tableSize}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={6} className={classes.modal_label}>
                    Limit:
                  </Grid>
                  <Grid item xs={6} className={classes.modal_field}>
                    {table.limit ? 'Pot Limit' : 'No Limit'}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={6} className={classes.modal_label}>
                    Buy In:
                  </Grid>
                  <Grid item xs={6} className={classes.modal_field}>
                    {table.buyIn[0]} ~ {table.buyIn[1]}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item className={classes.modal_center}>
                    <Button color="pivx" onClick={copyLink}>
                      Invite Link
                    </Button>
                  </Grid>
                </Grid>
                <div ref={reference}></div>
              </div>
            </Fade>
          </Modal>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { LobbyReducer, LoginReducer } = state;
  return { status: LobbyReducer, credential: LoginReducer };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      PIVXChange: global.Actions.LoginAction.PIVXChange,
      LogOutSuccess: global.Actions.LoginAction.LogOutSuccess
    },
    dispatch
  );
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CashGame));
