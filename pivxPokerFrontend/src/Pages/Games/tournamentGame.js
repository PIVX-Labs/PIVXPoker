import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import React, { useRef } from 'react';
import { MdMenu } from 'react-icons/md';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';

import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { AiFillWechat, AiOutlineLogout, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import Button from '../../Components/Button';
import Chip from '../../Components/Chip';
import PrettoSlider from '../../Components/PrettoSlider';
import { getCardSrc, getCards } from '../../Components/cards';
import handleToast, { success } from '../../Components/toast';
import '../../css/games.css';
import PokerTableMobile from '../../images/poker-table-mobile.png';
import PokerTable from '../../images/poker-table.png';
import gameStyle from '../../jss/pages/cashGameStyle';
import { chips, ranks, tournamentBlindList } from '../../shared/constants';
import { showDot, showKilo, showPotChips, showTurnTime } from '../../shared/printConfig';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white + '!important'
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    }
  }
}))(TableRow);
const useStyles = makeStyles(gameStyle);
const TournamentGamesC = ({ match, history, status, credential, PIVXChange, LogOutSuccess }) => {
  const classes = useStyles();
  const { apiConfig } = global;
  const theme = useTheme();
  const reference = useRef();

  const lg = useMediaQuery(theme.breakpoints.up('lg'));
  const md = useMediaQuery(theme.breakpoints.up('md'));
  const sm = useMediaQuery(theme.breakpoints.up('sm'));
  const xs = useMediaQuery(theme.breakpoints.up('xs'));
  const [winnerText, setWinnerText] = useState('');
  const [resultText, setResultText] = useState('');
  const [password, setPassword] = useState('');
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
  const [infoModal, setInfoModal] = useState(false);
  const [eventPositions, setEventPositions] = React.useState([]);
  const [place, setPlace] = useState(0);
  const [closed, setClosed] = useState(false);
  const gotoLobby = () => {
    history.push('/lobby');
  };
  const logout = () => {
    socket.emit('tournament:leave', match.params.room, (res) => {
      if (res == true) {
        LogOutSuccess();
        history.push('/');
      }
    });
  };
  const changeStand = () => {
    setStandMenu(null);
    socket.emit('tournament:stand', match.params.room, (res) => {
      setTable((table) => {
        const players = table.players.map((ele) => ele);
        players[mySeat].stand = res;
        setTable({
          ...table,
          players
        });
      });
    });
  };
  const leaveTable = () => {
    setStandMenu(null);
    socket.emit('tournament:leave', match.params.room, (res) => {
      if (res == true) {
        setTable((table) => {
          const players = table.players.map((ele) => ele);
          players[mySeat] = null;
          setTable({
            ...table,
            players
          });
          setMySeat(-1);
        });
      }
    });
  };
  const copyLink = () => {
    const tmp_tag = document.createElement('input');
    tmp_tag.value = apiConfig.app + '/games/tournament/' + table.id;
    reference.current.appendChild(tmp_tag);
    tmp_tag.select();
    document.execCommand('copy');
    reference.current.removeChild(tmp_tag);
    handleToast('Address copied!', success);
  };
  const setBehavior = (behavior) => {
    socket.emit('tournament:behavior', match.params.room, behavior, (behavior) => {
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
    socket.emit('tournament:bet', match.params.room, { status, amount });
  };
  const joinTable = () => {
    if (!credential.loginToken) {
      handleToast('Please login to join the game!');
      return;
    }
    socket.emit('tournament:join', match.params.room, password, (res) => {
      console.log('=====JOIN=====');
      console.log(res.status);
      console.log(res.TournamentGame);
      if (res.status) {
        setTable(res.TournamentGame);
        PIVXChange(res.pivx);
        console.log('tournament:join emit');
      } else handleToast(res.message);
    });
  };

  const sendMessage = (e) => {
    console.log(e.target.input_message.value);
    e.preventDefault();
    if (e.target.input_message.value != '') {
      socket.emit('chat:send', 'tournament_' + match.params.room, e.target.input_message.value);
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
      socket.emit('tournament:enter', match.params.room, (res) => {
        console.log(res);
        setTable(res.TournamentGame);
        let id = res.TournamentGame.players.findIndex(
          (ele) => ele != null && ele.user.id == credential.loginUserId
        );

        console.log('enter emit');
        console.log(id);
        console.log(res.TournamentGame.allowedBet);
        if (id > -1) {
          setMySeat(id);
          if (res.TournamentGame.allowedBet) {
            setCall(res.TournamentGame.allowedBet.call);
            setMinRaise(res.TournamentGame.allowedBet.minRaise);
            setMaxRaise(res.TournamentGame.allowedBet.maxRaise);
            setRaise(res.TournamentGame.allowedBet.minRaise);
            setCallStatus(res.TournamentGame.allowedBet.status);
          }
        }
      });
      socket.on('connect_error', (err) => {
        console.error('tournament:error');
        console.error(err.message);
      });
      socket.on('tournament:join', ({ TournamentGame }) => {
        console.log('tournament join');
        console.log(TournamentGame);
        setTable((table) => {
          return {
            ...TournamentGame
          };
        });
      });
      socket.on('tournament:start', ({ TournamentGame }) => {
        console.log('tournament start');
        console.log(TournamentGame.players);
        let id = TournamentGame.players.findIndex(
          (ele) => ele != null && ele.user.id == credential.loginUserId
        );
        if (id > -1 && !TournamentGame.players[id].fold) {
          setMySeat(id);
          socket.emit('tournament:showMyCards', match.params.room, ({ cards }) => {
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
        setTable(TournamentGame);

        setProgress(100);
      });
      socket.on('tournament:turn', ({ position, time, amount }) => {
        console.log('tournament:turn');
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
      socket.on(
        'tournament:bet',
        ({ position, bet, balance, fold, allIn, stand, pot, raise, call }) => {
          console.log('tournament:bet');
          console.log({
            position,
            bet,
            balance,
            fold,
            allIn,
            stand,
            pot,
            raise,
            call
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
        }
      );
      socket.on('tournament:stand', ({ position }) => {
        setTable((table) => {
          const newPlayers = JSON.parse(JSON.stringify(table.players));
          newPlayers[position].stand = 1;
          console.log('tournament:stand');
          console.log(position);
          console.log(newPlayers);
          return {
            ...table,
            players: newPlayers
          };
        });
        setEventPositions([position]);
      });
      socket.on('tournament:card', ({ tableCards, pot }) => {
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
      socket.on('tournament:open', (TournamentGame) => {
        console.log('open');
        setTable(TournamentGame);
      });
      socket.on('tournament:result', (TournamentGame, status0, status1) => {
        console.log('result');
        setTable(TournamentGame);
        setWinnerText(status0);
        setResultText(status1);
      });

      socket.on('tournament:closed', () => {
        console.log('tournament:closed');
        history.push('/lobby');
      });
      socket.on('tournament:sit', ({ position }) => {
        setTable((table) => {
          const newPlayers = JSON.parse(JSON.stringify(table.players));
          newPlayers[position].stand = false;
          console.log('tournament:sit');
          return {
            ...table,
            players: newPlayers
          };
        });
      });
      socket.on('tournament:leave', ({ position }) => {
        setTable((table) => {
          const newPlayers = JSON.parse(JSON.stringify(table.players));
          newPlayers[position] = null;
          console.log('tournament:leave');
          return {
            ...table,
            players: newPlayers
          };
        });
      });
      socket.on('tournament:third', (positions) => {
        console.log('tournament:third');
        setTable((table) => {
          for (let i = 0; i < positions.length; i++) {
            if (table.players[positions[i]].user.id == credential.loginUserId) {
              setPlace(3);
            }
            table.players[positions[i]] = null;
          }
          return {
            ...table
          };
        });
      });
      socket.on('tournament:second', (positions) => {
        console.log('tournament:second');
        setTable((table) => {
          for (let i = 0; i < positions.length; i++) {
            if (table.players[positions[i]].user.id == credential.loginUserId) {
              setPlace(2);
            }
            table.players[positions[i]] = null;
          }
          return {
            ...table
          };
        });
      });
      socket.on('tournament:first', (position) => {
        console.log('tournament:first');
        setClosed(true);
        setTable((table) => {
          if (table.players[position].user.id == credential.loginUserId) {
            setPlace(1);
          }
          return {
            ...table
          };
        });
        setTimeout(() => {
          history.push('/lobby');
        }, 30000);
      });
      socket.on('tournament:playersOut', (positions) => {
        console.log('tournament:out');
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
      socket.on('tournament:ready', ({ time }) => {
        console.log(time);
        setTable((table) => {
          return {
            ...table,
            playing: true,
            ready: time
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
                  In Play : {showDot(table.buyIn)} <small>satoshi</small>
                </span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={classes.title_bar}>
            <span onClick={() => setInfoModal(true)}>{table.name}</span>
          </div>{' '}
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
                        <Button color="success" className="user-avatar" justIcon round>
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

                        {ele.fold == false && ele.cards != null ? (
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
                        {ele.turn ? (
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
                              'animate__animated animate__fadeOutUp  animate__slower'
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
              <React.Fragment>
                {winnerText}
                <br />
                {resultText}
              </React.Fragment>
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
              color="tumblr"
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

        {table && !table.playing ? (
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={table && !table.playing}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
            className={classes.modal}
          >
            <Fade in={table && !table.playing}>
              <div className={classes.modal_paper}>
                <h4 className={classes.modal_title}>
                  Sit & Go Table
                  <Button
                    simple
                    round
                    justIcon
                    className={classes.modal_close}
                    onClick={() => history.push('/lobby')}
                  >
                    <AiOutlineLogout />
                  </Button>
                </h4>
                <TextField
                  id="standard-full-width"
                  label="Table Name"
                  style={{ margin: 8, fontSize: '30px' }}
                  helperText="Max Length is 10 character"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  InputProps={{
                    style: { fontSize: '30px' },
                    value: table.name,
                    readOnly: true
                  }}
                />
                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Players:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="table-size"
                      label="Players"
                      style={{ margin: 8, minWidth: '120px' }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: table.players.length + '/' + table.tableSize,
                        readOnly: true
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Turn Time:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="turn-time"
                      label="Turn Time"
                      style={{ margin: 8, minWidth: '120px' }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: showTurnTime(table.turnTime),
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Starting Stack:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="starting-stack"
                      label="Starting Stack"
                      style={{ margin: 8, minWidth: '120px' }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: table.startingStack,
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Limit:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="limit"
                      label="Limit"
                      style={{ margin: 8, minWidth: '120px' }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: table.limit ? 'Pot Limit' : 'No Limit',
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Blind Schedule:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="blind-schedule"
                      label="Blind Schedule"
                      style={{ margin: 8, minWidth: '120px' }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: ['Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'][
                          table.blindSchedule
                        ],
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <TableContainer component={Paper} className={classes.tableContainer} nament>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell>Blind</StyledTableCell>
                          <StyledTableCell align="right">Duration</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {tournamentBlindList[table.blindSchedule].map((row, key) => (
                          <StyledTableRow key={key}>
                            <StyledTableCell component="th" scope="row">
                              {showKilo(row.blinds)}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.duration}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Buy In:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="standard-buyIn-width"
                      label="Buy In"
                      inputProps={{}}
                      type="number"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: table.buyIn,
                        readOnly: true
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Prize Pool:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    {showDot(table.firstPlace + table.secondPlace + table.thirdPlace)}
                  </Grid>
                </Grid>
                <Grid container spacing={5}>
                  <Grid item xs={4} className={classes.modal_label}>
                    <h4>Prizes</h4>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    1st Place:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="standard-first-place-width"
                      label="1st Place"
                      inputProps={{}}
                      type="text"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: showDot(table.firstPlace),
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    2nd Place:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="standard-second-place-width"
                      label="2nd Place"
                      inputProps={{}}
                      type="text"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: showDot(table.secondPlace),
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    3rd Place:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="standard-second-place-width"
                      label="3rd Place"
                      inputProps={{}}
                      type="text"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: showDot(table.thirdPlace),
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                {table.privacy ? (
                  <Grid container spacing={3}>
                    <Grid item xs={4} className={classes.modal_label}>
                      Password:
                    </Grid>
                    <Grid item xs={8} className={classes.modal_field}>
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
                ) : (
                  ''
                )}

                <Grid container spacing={3} className="mt-3">
                  {table.players.find((ele) =>
                    ele != null ? ele.user.id === credential.loginUserId : false
                  ) ? (
                    <Button color="primary" style={{ margin: 'auto auto' }} onClick={joinTable}>
                      Unregister
                    </Button>
                  ) : (
                    <Button color="primary" style={{ margin: 'auto auto' }} onClick={joinTable}>
                      Register
                    </Button>
                  )}
                </Grid>
              </div>
            </Fade>
          </Modal>
        ) : (
          ''
        )}
        {table ? (
          <Modal
            aria-labelledby="transition-info-modal-title"
            aria-describedby="transition-info-modal-description"
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
              <div className={classes.modal_paper}>
                <h4 className={classes.modal_title}>
                  Table Summary
                  <Button
                    simple
                    round
                    justIcon
                    className={classes.modal_close}
                    onClick={() => setInfoModal(false)}
                  >
                    <AiOutlineLogout />
                  </Button>
                </h4>
                <h4>{table.name}</h4>
                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Host:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="table-size"
                      label="Players"
                      style={{ margin: 8, minWidth: '120px' }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: table.creator.username,
                        readOnly: true
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Players:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="table-size"
                      label="Players"
                      style={{ margin: 8, minWidth: '120px' }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: table.players.length + '/' + table.tableSize,
                        readOnly: true
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Turn Time:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="turn-time"
                      label="Turn Time"
                      style={{ margin: 8, minWidth: '120px' }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: showTurnTime(table.turnTime),
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Starting Stack:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="starting-stack"
                      label="Starting Stack"
                      style={{ margin: 8, minWidth: '120px' }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: table.startingStack,
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Limit:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="limit"
                      label="Limit"
                      style={{ margin: 8, minWidth: '120px' }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: table.limit ? 'Pot Limit' : 'No Limit',
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Blind Schedule:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="blind-schedule"
                      label="Blind Schedule"
                      style={{ margin: 8, minWidth: '120px' }}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: ['Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'][
                          table.blindSchedule
                        ],
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell>Blind</StyledTableCell>
                          <StyledTableCell align="right">Duration</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {tournamentBlindList[table.blindSchedule].map((row, key) => (
                          <StyledTableRow key={key}>
                            <StyledTableCell component="th" scope="row">
                              {showKilo(row.blinds)}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.duration}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Buy In:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="standard-buyIn-width"
                      label="Buy In"
                      inputProps={{}}
                      type="number"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: table.buyIn,
                        readOnly: true
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    Prize Pool:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    {showDot(table.firstPlace + table.secondPlace + table.thirdPlace)}
                  </Grid>
                </Grid>
                <Grid container spacing={5}>
                  <Grid item xs={4} className={classes.modal_label}>
                    <h4>Prizes</h4>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    1st Place:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="standard-first-place-width"
                      label="1st Place"
                      inputProps={{}}
                      type="text"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: showDot(table.firstPlace),
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    2nd Place:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="standard-second-place-width"
                      label="2nd Place"
                      inputProps={{}}
                      type="text"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: showDot(table.secondPlace),
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4} className={classes.modal_label}>
                    3rd Place:
                  </Grid>
                  <Grid item xs={8} className={classes.modal_field}>
                    <TextField
                      id="standard-second-place-width"
                      label="3rd Place"
                      inputProps={{}}
                      type="text"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        value: showDot(table.thirdPlace),
                        readOnly: true
                      }}
                    />{' '}
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item className={classes.modal_center}>
                    <Button color="info" onClick={copyLink}>
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
        {table.ready > 0 ? (
          <Backdrop className={classes.backdrop} open={table.ready > 0}>
            <CircularProgress color="primary" />
            <div style={{ marginLeft: '20px' }}>
              {Math.floor(table.ready / 60) > 1
                ? Math.floor(table.ready / 60) + 'mins'
                : Math.floor(table.ready / 60) > 0
                ? Math.floor(table.ready / 60) + 'min'
                : ''}{' '}
              {(table.ready % 60) + ' secs to ready game!'}
            </div>
          </Backdrop>
        ) : (
          ''
        )}
        {place > 0 ? (
          <Backdrop
            className={classes.backdrop}
            open={place > 0}
            onClick={() => history.push('/lobby')}
          >
            <div class="firework-1"></div>
            <div class="firework-2"></div>
            <div class="firework-3"></div>
            <div class="firework-4"></div>
            <div class="firework-5"></div>
            <div class="firework-6"></div>
            <div class="firework-7"></div>
            <div class="firework-8"></div>
            <div class="firework-9"></div>
            <div class="firework-10"></div>
            <div class="firework-11"></div>
            <div class="firework-12"></div>
            <div class="firework-13"></div>
            <div class="firework-14"></div>
            <div class="firework-15"></div>
            <div class="congratulation">
              Congratulations! You take {place == 1 ? '1st' : place == 2 ? '2nd' : '3rd'} place.
            </div>
          </Backdrop>
        ) : closed ? (
          <Backdrop
            className={classes.backdrop}
            open={closed}
            onClick={() => history.push('/lobby')}
          >
            <div>Closed</div>
          </Backdrop>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TournamentGamesC));
