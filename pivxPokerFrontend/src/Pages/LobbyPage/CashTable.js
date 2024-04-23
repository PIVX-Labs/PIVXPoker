import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import handleToast, { success } from '../../Components/toast';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  blindsList,
  turnTimeList,
  cashTableSizeList,
  maxTimeBankList
} from '../../shared/constants';
import {
  AiOutlineClose,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiTwotoneLock,
  AiOutlineCheck
} from 'react-icons/ai';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '../../Components/Button';
import Checkbox from '@mui/material/Checkbox';
import { showKilo, showTurnTime, showTableSize, showMaxTimeBank } from '../../shared/printConfig';
import { makeStyles } from '@mui/styles';
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

const TableRow = styled(TableHeadRow)`
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  :hover {
    background: #2a1b42;
  }
`;

const headings = ['Name', 'Blinds', 'Buy In', 'Turn Time', 'Seats'];

const CashTable = (props) => {
  const history = useHistory();
  const { apiConfig } = global;
  const classes = useStyles();
  const [createModal, setCreateModal] = React.useState(false);
  const [sort, setSort] = useState('');
  const [blinds, setBlinds] = useState(blindsList[0]);
  const [turnTime, setTurnTime] = useState(turnTimeList[0]);
  const [tableSize, setTableSize] = useState(9);
  const [limit, setLimit] = useState(false);
  const [maxTimeBank, setMaxTimeBank] = useState(maxTimeBankList[0]);
  const [buyIn, setBuyIn] = useState([50, 500]);
  const [buyInRange, setBuyInRange] = useState([50, 500]);
  const [privacy, setPrivacy] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tableItems, setTableItems] = useState(props.cashGames);
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
    setTableItems(props.cashGames);
  }, [props.cashGames]);
  useEffect(() => {
    setBuyIn([blinds * 50, blinds * 500]);
    setBuyInRange([blinds * 50, blinds * 500]);
  }, [blinds]);

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
        } else if (sort.name === 'Blinds') {
          var x = a.blinds;
          var y = b.blinds;
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
          var x = a.buyIn[0];
          var y = b.buyIn[0];
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
        } else if (sort.name === 'Turn Time') {
          var x = a.turnTime;
          var y = b.turnTime;
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
        } else if (sort.name === 'Seats') {
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
      blinds,
      turnTime,
      tableSize,
      limit,
      maxTimeBank,
      buyIn,
      privacy,
      password
    });
    props.socket.emit(
      'cash:create',
      {
        name,
        blinds,
        turnTime,
        tableSize,
        limit,
        maxTimeBank,
        buyIn,
        privacy,
        password
      },
      (res) => {
        if (res.status == true) {
          props.PIVXChange(res.pivx);
          history.push('/games/cash/' + res.id);
        } else {
          handleToast(res.message);
        }
        setCreateModal(false);
      }
    );
  };
  const goToGames = (id) => {
    history.push('/games/cash/' + id);
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
              item.blinds =
                showKilo(ele.blinds) + '/' + showKilo(ele.blinds === 2 ? 5 : ele.blinds * 2);
              item.buyIn = showKilo(ele.buyIn[0]);
              item.turnTime = showTurnTime(ele.turnTime);
              item.tableSize = ele.playersCount + '/' + ele.tableSize;
              item.limit = ele.limit;
              return item;
            })
            .map((item, i) => (
              <TableRow key={item.id}>
                <TableItem onClick={() => goToGames(item.id)}>
                  {item.current ? <AiOutlineCheck /> : ''} {item.privacy ? <AiTwotoneLock /> : ''}{' '}
                  {item.name + ' '}
                  {item.limit ? (
                    <small style={{ fontWeight: '100', fontStyle: 'italic', fontSize: '10px' }}>
                      ( Pot limited )
                    </small>
                  ) : (
                    ''
                  )}
                </TableItem>
                <TableItem onClick={() => goToGames(item.id)}>{item.blinds}</TableItem>
                <TableItem onClick={() => goToGames(item.id)}>{item.buyIn}</TableItem>
                <TableItem onClick={() => goToGames(item.id)}>{item.turnTime}</TableItem>
                <TableItem onClick={() => goToGames(item.id)}>{item.tableSize}</TableItem>
              </TableRow>
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
        className={classes.modal}
      >
        <Fade in={createModal}>
          <div className={classes.modal_paper}>
            <h4 className={classes.modal_title}>
              Create Table
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
              helperText="Between 3 - 15 character"
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
                Blinds:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-blinds-select-label"></InputLabel>
                  <Select
                    className={classes.modal_select}
                    labelId="demo-blinds-select-label"
                    id="demo-blinds-select"
                    value={blinds}
                    style={{ minWidth: '70px' }}
                    onChange={(e) => setBlinds(e.target.value)}
                  >
                    {blindsList.map((ele, key) => (
                      <MenuItem className={classes.modal_select_item} key={key} value={ele}>
                        {showKilo(ele)} / {showKilo(ele == 2 ? 5 : ele * 2)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                Turn Time:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-turnTime-select-label"></InputLabel>
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
                Table Size:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-tableSize-select-label"></InputLabel>
                  <Select
                    className={classes.modal_select}
                    labelId="demo-tableSize-select-label"
                    id="demo-tableSize-select"
                    value={tableSize}
                    onChange={(e) => setTableSize(e.target.value)}
                    style={{ minWidth: '120px' }}
                  >
                    {cashTableSizeList.map((ele, key) => (
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
                Limit:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-limit-select-label"></InputLabel>
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
                Max Time Bank:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-maxTimeBank-select-label"></InputLabel>
                  <Select
                    className={classes.modal_select}
                    labelId="demo-maxTimeBank-select-label"
                    id="demo-maxTimeBank-select"
                    value={maxTimeBank}
                    onChange={(e) => setMaxTimeBank(e.target.value)}
                    style={{ minWidth: '150px' }}
                  >
                    {maxTimeBankList.map((ele, key) => (
                      <MenuItem className={classes.modal_select_item} key={key} value={ele}>
                        {showMaxTimeBank(ele)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4} className={classes.modal_label}>
                Buy In:
              </Grid>
              <Grid item xs={8} className={classes.modal_field}>
                <Slider
                  value={buyIn}
                  onChange={(e, val) => setBuyIn(val)}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  getAriaValueText={(val) => val}
                  min={buyInRange[0]}
                  max={buyInRange[1]}
                  color={'primary'}
                  className={classes.modal_slider}
                />
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

export default connect(null, mapDispatchToProps)(CashTable);
