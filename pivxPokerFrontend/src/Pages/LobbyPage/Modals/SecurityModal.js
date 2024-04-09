import { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { AiOutlineClose } from "react-icons/ai";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import handleToast, { success } from "Components/toast";
import Button from "Components/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import modalStyle from "jss/modalStyle";

const useStyles = makeStyles(modalStyle);

const SecurityModal = ({ securityModal, setSecurityModal, credential }) => {
  const classes = useStyles();
  const { apiConfig, ApiCall } = global;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const postPassword = async () => {
    if (newPassword !== confirmPassword) {
      handleToast("Password doesn't match!");
      return;
    }
    if (newPassword === "") {
      handleToast("Please input the new password!");
      return;
    }
    const payLoad = {
      password,
      newPassword,
    };
    try {
      const response = await ApiCall(
        apiConfig[apiConfig.currentEnv],
        apiConfig.changePassword.url,
        apiConfig.changePassword.method,
        credential.loginToken,
        payLoad
      );
      if (response.status === 200) {
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSecurityModal(false);
        handleToast(response.data.message, success);
      } else {
        handleToast(response.data.error);
      }
    } catch (error) {
      if (error.response) handleToast(error.response.data.error);
      else handleToast("Request Failed!");
    }
  };
  const cancelModal = () => {
    setNewPassword("");
    setPassword("");
    setConfirmPassword("");
    setSecurityModal(false);
  };
  return (
    <Modal
      aria-labelledby="transition-security-title"
      aria-describedby="transition-security-description"
      open={securityModal}
      onClose={cancelModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className={classes.modal}
    >
      <Fade in={securityModal}>
        <div className={classes.small_modal_paper}>
          <h4 className={classes.modal_title}>
            Security
            <Button
              simple
              round
              justIcon
              className={classes.modal_close}
              onClick={cancelModal}
            >
              <AiOutlineClose />
            </Button>
          </h4>
          <Grid container spacing={3}>
            <Grid item xs={4} className={classes.modal_label}>
              Current Password:
            </Grid>
            <Grid item xs={8} className={classes.modal_field}>
              <FormControl className={classes.formControl}>
                <TextField
                  id="standard-current-password-input"
                  label="Current Password"
                  type="password"
                  autoComplete=""
                  InputProps={{
                    value: password,
                    onChange: (e) => {
                      setPassword(e.target.value);
                    },
                  }}
                />{" "}
              </FormControl>
            </Grid>
          </Grid>{" "}
          <Grid container spacing={3}>
            <Grid item xs={4} className={classes.modal_label}>
              New Password:
            </Grid>
            <Grid item xs={8} className={classes.modal_field}>
              <FormControl className={classes.formControl}>
                <TextField
                  id="standard-new-password-input"
                  label="New Password"
                  type="password"
                  autoComplete=""
                  InputProps={{
                    value: newPassword,
                    onChange: (e) => setNewPassword(e.target.value),
                  }}
                />{" "}
              </FormControl>
            </Grid>
          </Grid>{" "}
          <Grid container spacing={3}>
            <Grid item xs={4} className={classes.modal_label}>
              Confirm Password:
            </Grid>
            <Grid item xs={8} className={classes.modal_field}>
              <FormControl className={classes.formControl}>
                <TextField
                  id="standard-confirm-password-input"
                  label="Confirm Password"
                  type="password"
                  autoComplete=""
                  InputProps={{
                    value: confirmPassword,
                    onChange: (e) => setConfirmPassword(e.target.value),
                  }}
                />{" "}
              </FormControl>
            </Grid>
          </Grid>{" "}
          <Grid container spacing={3} className="mt-3">
            <Button
              color="pivx1"
              style={{ margin: "auto auto" }}
              onClick={postPassword}
            >
              OK
            </Button>
            <Button
              color="pivx3"
              style={{ margin: "auto auto" }}
              onClick={cancelModal}
            >
              Cancel
            </Button>
          </Grid>
        </div>
      </Fade>
    </Modal>
  );
};

export default SecurityModal;
