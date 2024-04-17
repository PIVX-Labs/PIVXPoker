import { useRef } from "react";
import QRCode from "react-qr-code";
import { AiOutlineClose, AiOutlineCopy } from "react-icons/ai";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import handleToast, { success } from "Components/toast";
import Button from "Components/Button";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import modalStyle from "jss/modalStyle";

const useStyles = makeStyles(modalStyle);

const DepositModal = ({ depositModal, setDepositModal, credential }) => {
  const reference = useRef();
  const classes = useStyles();
  const copyAddress = () => {
    const tmp_tag = document.createElement("input");
    tmp_tag.value = credential.loginUserDepositAddress;
    reference.current.appendChild(tmp_tag);
    tmp_tag.select();
    document.execCommand("copy");
    reference.current.removeChild(tmp_tag);
    handleToast("Address copied!", success);
  };
  const copyAddress1 = () => {
    const tmp_tag = document.createElement("input");
    tmp_tag.value = credential.loginUserShieldDepositAddress;
    reference.current.appendChild(tmp_tag);
    tmp_tag.select();
    document.execCommand("copy");
    reference.current.removeChild(tmp_tag);
    handleToast("Address copied!", success);
  };
  // function mpwLink(amount){
  //   let url = 'https://mypivxwallet.org/?pay=' + credential.loginUserDepositAddress + '&amount=' + amount + '&desc=PIVX.Poker%20Account%20Top-Up';
  //   window.open(url, '_blank').focus();
  // }
  return (
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={depositModal}
        onClose={() => setDepositModal(!depositModal)}
        closeAfterTransition
     
        className={classes.modal}
      >
        <Fade in={depositModal}>
          <div className={classes.modal_paper}>
            <h4 className={classes.modal_title}>
              Deposit
              <Button
                simple
                round
                justIcon
                className={classes.modal_close}
                onClick={() => setDepositModal(false)}
              >
                <AiOutlineClose />
              </Button>
            </h4>
            <Grid container spacing={3}>
              <Grid item className={classes.modal_center}>
                Deposit PIVX to the address below
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item className={classes.modal_center}>
                <QRCode
                  value={
                    credential.loginUserDepositAddress
                      ? credential.loginUserDepositAddress
                      : ""
                  }
                  size={128}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item className={classes.modal_center}>
                <span className={classes.modal_address}>
                  {credential.loginUserDepositAddress}
                </span>{" "}
                <Button color="pivx1" round justIcon onClick={copyAddress}>
                  <AiOutlineCopy />
                </Button>
              </Grid>
              <Grid item className={classes.modal_center}>
                <span className={classes.modal_address}>
                  {credential.loginUserShieldDepositAddress}
                </span>{" "}
                <Button color="pivx1" round justIcon onClick={copyAddress1}>
                  <AiOutlineCopy />
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item className={classes.modal_center}>
                  Or deposit easily with MPW!
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item className={classes.modal_center}>
                  <br/>
                  <Button color="pivx1" round onClick={() => {
                        let url = 'https://app.mypivxwallet.org/?pay=' + credential.loginUserDepositAddress + '&amount=1&desc=PIVX.Poker%20Account%20Top-Up';
                        window.open(url, '_blank').focus();
                  }}>
                    1 Pivx
                  </Button>
                  <Button color="pivx1" round onClick={() => {
                        let url = 'https://app.mypivxwallet.org/?pay=' + credential.loginUserDepositAddress + '&amount=10&desc=PIVX.Poker%20Account%20Top-Up';
                        window.open(url, '_blank').focus();
                  }}>
                    10 Pivx
                  </Button>
                  <Button color="pivx1" round onClick={() => {
                        let url = 'https://app.mypivxwallet.org/?pay=' + credential.loginUserDepositAddress + '&amount=100&desc=PIVX.Poker%20Account%20Top-Up';
                        window.open(url, '_blank').focus();
                  }}>
                    100 Pivx
                  </Button>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item className={classes.modal_center}>
                1 PIVX = 100M satoshi
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item className={classes.modal_center}>
                1 confirmation required.
              </Grid>
            </Grid>
            <div ref={reference}></div>
          </div>
        </Fade>
      </Modal>
  );
};

export default DepositModal;
