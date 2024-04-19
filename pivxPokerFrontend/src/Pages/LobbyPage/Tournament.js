import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import handleToast, { success } from '../../Components/toast';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useHistory } from 'react-router-dom';
//datePicker
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import {
  blindsList,
  turnTimeList,
  tournamentTableSizeList,
  tournamentBlindList,
  tournamentStartingStack
} from '../../shared/constants';
import {
  AiOutlineClose,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiTwotoneLock,
  AiOutlineCheck
} from 'react-icons/ai';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '../../Components/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { showKilo, showTurnTime, showTableSize, showDot } from '../../shared/printConfig';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import lobbyStyle from '../../jss/pages/lobbyStyle';

const useStyles = makeStyles(lobbyStyle);

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TableHeadRow = styled.div`
  display: flex;
  width: 100%;
  background-color: #2d3746;
  color: #ffffff;
  justify-content: flex-start;
  cursor: pointer;
`;
const TableItem = styled.div`
  text-transform: uppercase;
  font-size: 0.75rem;
  padding: 0.75rem 0;
  font-family: Montserrat, Helvetica Neue, sans-serif;
  text-align: center;
  width: 20%;
  color: white;
`;

export const TableHeadItem = styled(TableItem)`
  color: #ffffff;
  background: #662d91;
  box-shadow: 2px 3px 1px rgba(0, 0, 0, 0.4);
  text-transform: uppercase;
  width: 100%;
  text-align: center;
`;

const PanelTableRow = styled(TableHeadRow)`
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  :hover {
    background: #2a1b42;
  }
`;

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
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

const headings = ['Name', 'Buy In', 'Prize Pool', 'Players', 'Status'];

const TournamentTable = (props) => {
  const history = useHistory();

  const { apiConfig } = global;
  const classes = useStyles();
  const [createModal, setCreateModal] = React.useState(false);
  const [sort, setSort] = useState('');
  const [turnTime, setTurnTime] = useState(turnTimeList[0]);
  const [tableSize, setTableSize] = useState(9);
  const [startTime, setStartTime] = useState(Date.UTC());
  const [startingStack, setStartingStack] = useState(500);
  const [limit, setLimit] = useState(false);
  const [blindSchedule, setBlindSchedule] = useState(4);
  const [buyIn, setBuyIn] = useState(100);
  const [privacy, setPrivacy] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tableItems, setTableItems] = useState(props.tournaments);
  const [firstPlace, setFirstPlace] = useState(Math.floor(buyIn * tableSize * 0.95));
  const [secondPlace, setSecondPlace] = useState(0);
  const [thirdPlace, setThirdPlace] = useState(0);
  const handleSort = (text) => {
    if (sort.name === text) {
      setSort({
        name: text,
        type: !sort.type
      });
    } else {
      setSort({
        name: text,
        type: true
      });
    }
  };
  useEffect(() => {
    setFirstPlace(Math.floor(buyIn * tableSize * 0.95));
  }, [tableSize, buyIn]);

  useEffect(() => {
    console.log(props);
    setTableItems(props.tournaments);
    //console.log(props.tournaments);
  }, [props.tournaments]);

  useEffect(() => {
    const data = JSON.parse(JSON.stringify(tableItems));
    if (data.length > 0) {
      data.sort((a, b) => {
        if (sort.name === 'Name') {
          var x = a.name.toLowerCase();
          var y = b.name.toLowerCase();
          if (sort.type) {
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          } else {
            if (x < y) {
              return 1;
            }
            if (x > y) {
              return -1;
            }
            return 0;
          }
        } else if (sort.name === 'Buy In') {
          var x = a.buyIn;
          var y = b.buyIn;
          if (sort.type) {
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          } else {
            if (x < y) {
              return 1;
            }
            if (x > y) {
              return -1;
            }
            return 0;
          }
        } else if (sort.name === 'Prize Pool') {
          var x = a.firstPlace + a.secondPlace + a.thirdPlace;
          var y = b.firstPlace + b.secondPlace + b.thirdPlace;
          if (sort.type) {
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          } else {
            if (x < y) {
              return 1;
            }
            if (x > y) {
              return -1;
            }
            return 0;
          }
        } else if (sort.name === 'Players') {
          var x = parseInt(a.playersCount);
          var y = parseInt(b.playersCount);
          if (sort.type) {
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          } else {
            if (x < y) {
              return 1;
            }
            if (x > y) {
              return -1;
            }
            return 0;
          }
        } else if (sort.name === 'Status') {
          var x = a.status;
          var y = b.status;
          if (sort.type) {
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          } else {
            if (x < y) {
              return 1;
            }
            if (x > y) {
              return -1;
            }
            return 0;
          }
        } else return 1;
      });
      setTableItems(data);
    }
  }, [sort]);
  const createTable = () => {
    if (!name) {
      handleToast('Please specify a name');
      return;
    }
    console.log({
      name,
      turnTime,
      startTime,
      tableSize,
      startingStack,
      blindSchedule,
      firstPlace,
      secondPlace,
      thirdPlace,
      limit,
      buyIn,
      privacy,
      password
    });
    props.socket.emit(
      'tournament:create',
      {
        name,
        turnTime,
        startTime,
        tableSize,
        startingStack,
        blindSchedule,
        firstPlace,
        secondPlace,
        thirdPlace,
        limit,
        buyIn,
        privacy,
        password
      },
      (res) => {
        if (res.status == true) {
          props.PIVXChange(res.pivx);
          history.push('/games/tournament/' + res.id);
        } else {
          handleToast(res.message);
        }
        setCreateModal(false);
      }
    );
  };
  const goToGames = (id) => {
    history.push('/games/tournament/' + id);
  };
  return (
    <TableWrapper>
      <TableHeadRow>
        {headings.map((text, i) => (
          <TableHeadItem key={i} onClick={(e) => handleSort(text)}>
            {text}
            {sort.name === text ? (
              sort.type === true ? (
                <AiOutlineArrowUp />
              ) : (
                <AiOutlineArrowDown />
              )
            ) : (
              ''
            )}
          </TableHeadItem>
        ))}
      </TableHeadRow>
      {tableItems
        ? tableItems
            .map((ele) => {
              const item = {};
              item.id = ele.id;
              item.privacy = ele.privacy;
              item.current = ele.current;
              item.name = ele.name;
              item.buyIn = showKilo(ele.buyIn);
              item.prizePool = showKilo(ele.firstPlace + ele.secondPlace + ele.thirdPlace);
              item.tableSize = ele.playersCount + '/' + ele.tableSize;
              item.status = ele.status;
              item.limit = ele.limit;
              item.playing = ele.playing ? 'Playing' : ele.closed ? 'Closed' : 'Registering';
              return item;
            })
            .map((item, i) => (
              <PanelTableRow key={item.id}>
                <TableItem onClick={() => goToGames(item.id)}>
                  {item.current ? <AiOutlineCheck /> : ''} {item.privacy ? <AiTwotoneLock /> : ''}{' '}
                  {item.name + ' '}
                  {item.limit ? (
                    <small
                      style={{
                        fontWeight: '100',
                        fontStyle: 'italic',
                        fontSize: '10px'
                      }}
                    >
                      ( Pot limited )
                    </small>
                  ) : (
                    ''
                  )}
                </TableItem>
                <TableItem onClick={() => goToGames(item.id)}>{item.buyIn}</TableItem>
                <TableItem onClick={() => goToGames(item.id)}>{item.prizePool}</TableItem>
                <TableItem onClick={() => goToGames(item.id)}>{item.tableSize}</TableItem>
                <TableItem onClick={() => goToGames(item.id)}>{item.playing}</TableItem>
              </PanelTableRow>
            ))
        : ''}
      <hr />
      <div style={{ textAlign: 'center' }}>
        <Button color="primary" round onClick={() => setCreateModal(true)}>
          Create Table
        </Button>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={createModal}
        onClose={() => setCreateModal(!createModal)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
        className={classes.modal}
      >
        <Fade in={createModal}>
          <div className={classes.modal_paper}>
            <h4 className={classes.modal_title}>
              Tournament
              <Button
                simple
                round
                justIcon
                className={classes.modal_close}
                onClick={() => setCreateModal(false)}
              >
                <AiOutlineClose />
              </Button>
            </h4>
            <TextField
              id="standard-full-width"
              label="Table Name"
              inputProps={{
                style: { fontSize: '30px' }
              }}
              style={{ margin: 8, fontSize: '30px' }}
              helperText="Max Length is 10 character"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                value: name,
                onChange: (e) => setName(e.target.value)
              }}
            />
            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                Table Size:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-tableSize-select-label">Tabel Size</InputLabel>
                  <Select
                    className={classes.modal_select}
                    labelId="demo-tableSize-select-label"
                    id="demo-tableSize-select"
                    value={tableSize}
                    onChange={(e) => setTableSize(e.target.value)}
                    style={{ minWidth: '120px' }}
                  >
                    {tournamentTableSizeList.map((ele, key) => (
                      <MenuItem className={classes.modal_select_item} key={key} value={ele}>
                        {showTableSize(ele)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                Start Time:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <FormControl className={classes.formControl}>
                  {/* <div style={{ paddingTop:"50px",minWidth: "520px" }}>
                    <DateTimePicker  id="demo-startTime-select" labelId="demo-startTime-select-label" value={startTime}  onChange={(e) => setStartTime(e.target.value)} />
                  </div> */}
                  <div>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DemoContainer components={['DateTimePicker']}>
                        <DateTimePicker label="Set start date" onChange={(e) => setStartTime(e)} />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                Turn Time:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-turnTime-select-label">Turn Time</InputLabel>
                  <Select
                    className={classes.modal_select}
                    labelId="demo-turnTime-select-label"
                    id="demo-turnTime-select"
                    value={turnTime}
                    onChange={(e) => setTurnTime(e.target.value)}
                    style={{ minWidth: '120px' }}
                  >
                    {turnTimeList.map((ele, key) => (
                      <MenuItem className={classes.modal_select_item} key={key} value={ele}>
                        {showTurnTime(ele)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                Starting Stack:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-tableSize-select-label">Starting Stack</InputLabel>
                  <Select
                    className={classes.modal_select}
                    labelId="demo-tableSize-select-label"
                    id="demo-tableSize-select"
                    value={startingStack}
                    onChange={(e) => setStartingStack(e.target.value)}
                    style={{ minWidth: '120px' }}
                  >
                    {tournamentStartingStack.map((ele, key) => (
                      <MenuItem className={classes.modal_select_item} key={key} value={ele}>
                        {ele}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                Limit:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-limit-select-label">Limit</InputLabel>
                  <Select
                    className={classes.modal_select}
                    labelId="demo-limit-select-label"
                    id="demo-limit-select"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    style={{ minWidth: '70px' }}
                  >
                    <MenuItem className={classes.modal_select_item} value={true}>
                      Pot Limit
                    </MenuItem>
                    <MenuItem className={classes.modal_select_item} value={false}>
                      No Limit
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                Blind Schedule:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-blind-select-label">Blind Schedule</InputLabel>
                  <Select
                    className={classes.modal_select}
                    labelId="demo-blind-select-label"
                    id="demo-blind-select"
                    value={blindSchedule}
                    onChange={(e) => setBlindSchedule(e.target.value)}
                    style={{ minWidth: '150px' }}
                  >
                    <MenuItem className={classes.modal_select_item} value={4}>
                      Very Fast
                    </MenuItem>
                    <MenuItem className={classes.modal_select_item} value={3}>
                      Fast
                    </MenuItem>
                    <MenuItem className={classes.modal_select_item} value={2}>
                      Normal
                    </MenuItem>
                    <MenuItem className={classes.modal_select_item} value={1}>
                      Slow
                    </MenuItem>
                    <MenuItem className={classes.modal_select_item} value={0}>
                      Very Slow
                    </MenuItem>
                  </Select>
                </FormControl>
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
                    {tournamentBlindList[blindSchedule].map((row, key) => (
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
                    value: buyIn,
                    onChange: (e) => setBuyIn(e.target.value)
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                Prize Pool:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                {showDot(Math.floor(buyIn * tableSize * 0.95))}
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
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                      value={firstPlace}
                      onChange={(e, val) => {
                        if (val > Math.floor(buyIn * tableSize * 0.95) - secondPlace - thirdPlace)
                          setFirstPlace(
                            Math.floor(buyIn * tableSize * 0.95) - secondPlace - thirdPlace
                          );
                        else setFirstPlace(val);
                      }}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      getAriaValueText={(val) => val}
                      min={0}
                      max={Math.floor(buyIn * tableSize * 0.95)}
                      color={'primary'}
                      className={classes.modal_slider}
                    />
                  </Grid>
                  <Grid item>
                    <Input
                      className={classes.sliderInput}
                      value={firstPlace}
                      margin="dense"
                      onChange={(event) => {
                        let val = Number(event.target.value);
                        if (val > Math.floor(buyIn * tableSize * 0.95) - secondPlace - thirdPlace)
                          setFirstPlace(
                            Math.floor(buyIn * tableSize * 0.95) - secondPlace - thirdPlace
                          );
                        else setFirstPlace(val);
                      }}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: Math.floor(buyIn * tableSize * 0.95),
                        type: 'number',
                        'aria-labelledby': 'input-slider'
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                2nd Place:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                      value={secondPlace}
                      onChange={(e, val) => {
                        if (val > Math.floor(buyIn * tableSize * 0.95) - firstPlace - thirdPlace)
                          setSecondPlace(
                            Math.floor(buyIn * tableSize * 0.95) - firstPlace - thirdPlace
                          );
                        else setSecondPlace(val);
                      }}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      getAriaValueText={(val) => val}
                      min={0}
                      max={Math.floor(buyIn * tableSize * 0.95)}
                      color={'primary'}
                      className={classes.modal_slider}
                    />
                  </Grid>
                  <Grid item>
                    <Input
                      className={classes.sliderInput}
                      value={secondPlace}
                      margin="dense"
                      onChange={(event) => {
                        let val = Number(event.target.value);
                        if (val > Math.floor(buyIn * tableSize * 0.95) - firstPlace - thirdPlace)
                          setSecondPlace(
                            Math.floor(buyIn * tableSize * 0.95) - firstPlace - thirdPlace
                          );
                        else setSecondPlace(val);
                      }}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: Math.floor(buyIn * tableSize * 0.95),
                        type: 'number',
                        'aria-labelledby': 'input-slider'
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                3rd Place:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                      value={thirdPlace}
                      onChange={(e, val) => {
                        if (val > Math.floor(buyIn * tableSize * 0.95) - firstPlace - secondPlace)
                          setThirdPlace(
                            Math.floor(buyIn * tableSize * 0.95) - firstPlace - secondPlace
                          );
                        else setThirdPlace(val);
                      }}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      getAriaValueText={(val) => val}
                      min={0}
                      max={Math.floor(buyIn * tableSize * 0.95)}
                      color={'primary'}
                      className={classes.modal_slider}
                    />
                  </Grid>
                  <Grid item>
                    <Input
                      className={classes.sliderInput}
                      value={thirdPlace}
                      margin="dense"
                      onChange={(event) => {
                        let val = Number(event.target.value);
                        if (val > Math.floor(buyIn * tableSize * 0.95) - firstPlace - secondPlace)
                          setThirdPlace(
                            Math.floor(buyIn * tableSize * 0.95) - firstPlace - secondPlace
                          );
                        else setThirdPlace(val);
                      }}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: Math.floor(buyIn * tableSize * 0.95),
                        type: 'number',
                        'aria-labelledby': 'input-slider'
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                Password Protected:
              </Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    className={classes.modal_checkbox}
                    checked={privacy}
                    onChange={(event) => setPrivacy(event.target.checked)}
                    name="checkedG"
                  />
                }
                label=""
              />{' '}
            </Grid>
            {privacy ? (
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
              <Button color="primary" style={{ margin: 'auto auto' }} onClick={createTable}>
                Create
              </Button>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </TableWrapper>
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      PIVXChange: global.Actions.LoginAction.PIVXChange
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(TournamentTable);
