import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { AiOutlineClose } from 'react-icons/ai';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import handleToast, { success } from 'Components/toast';
import Button from 'Components/Button';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import modalStyle from 'jss/modalStyle';

const useStyles = makeStyles(modalStyle);

const WithdrawalModal = ({
  withdrawalModal,
  setWithdrawalModal,
  credential,
  PIVXChange,
  walletAddressChange
}) => {
  const classes = useStyles();
  const { apiConfig, ApiCall } = global;
  const [pivx, setPIVX] = useState(0);
  const [password, setPassword] = useState('');
  const requestWithdrawal = async () => {
    if (pivx < 10000000) {
      handleToast('More than 100,000,000 satoshi allowed to withdraw!');
      return;
    }
    if (credential.loginUserWalletAddress == '') {
      handleToast('Iuput your wallet address!');
      return;
    }
    const payLoad = {
      pivx,
      wallet: credential.loginUserWalletAddress,
      password
    };
    try {
      const response = await ApiCall(
        apiConfig[apiConfig.currentEnv],
        apiConfig.withdrawal.url,
        apiConfig.withdrawal.method,
        credential.loginToken,
        payLoad
      );
      if (response.status === 200) {
        handleToast(response.data.message, success);
        PIVXChange(response.pivx);
      } else {
        handleToast(response.data.error);
      }
    } catch (error) {
      if (error.response) handleToast(error.response.data.error);
      else handleToast('Request Failed!');
    }
    setPassword('');
  };
  const cancelModal = () => {
    setPassword('');
    setWithdrawalModal(false);
  };
  return (
    <Modal
      aria-labelledby="transition-withdrawal-title"
      aria-describedby="transition-withdrawal-description"
      open={withdrawalModal}
      onClose={cancelModal}
      closeAfterTransition
      className={classes.modal}
    >
      <Fade in={withdrawalModal}>
        <div className={classes.modal_paper}>
          <h4 className={classes.modal_title}>
            Withdrawal
            <Button simple round justIcon className={classes.modal_close} onClick={cancelModal}>
              <AiOutlineClose />
            </Button>
          </h4>
          <Grid container spacing={3}>
            <Grid item className={classes.modal_center}>
              Input your PIVX wallet address and the amount to withdraw below
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={4} className={classes.modal_label}>
              Address:
            </Grid>
            <Grid item xs={8} className={classes.modal_field}>
              <FormControl className={classes.formControl}>
                <TextField
                  id="standard-password-input"
                  label="Address"
                  type="text"
                  autoComplete="wallet address"
                  InputProps={{
                    value: credential.loginUserWalletAddress,
                    onChange: (e) => {
                      walletAddressChange(e.target.value);
                    }
                  }}
                />{' '}
              </FormControl>
            </Grid>
          </Grid>{' '}
          <Grid container spacing={3}>
            <Grid item xs={4} className={classes.modal_label}>
              PIVX ( satoshi ):
            </Grid>
            <Grid item xs={8} className={classes.modal_field}>
              <FormControl className={classes.formControl}>
                <TextField
                  id="standard-pivx-input"
                  label="Amount"
                  type="number"
                  autoComplete="satoshi"
                  InputProps={{
                    value: pivx,
                    onChange: (e) => setPIVX(e.target.value)
                  }}
                />{' '}
              </FormControl>
            </Grid>
          </Grid>{' '}
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
                  autoComplete=""
                  InputProps={{
                    value: password,
                    onChange: (e) => setPassword(e.target.value)
                  }}
                />{' '}
              </FormControl>
            </Grid>
          </Grid>{' '}
          <Grid container spacing={3} className="mt-3">
            <Button color="pivx1" style={{ margin: 'auto auto' }} onClick={requestWithdrawal}>
              Withdrawal
            </Button>
          </Grid>
        </div>
      </Fade>
    </Modal>
  );
};

export default WithdrawalModal;
