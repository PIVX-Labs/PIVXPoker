import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { AiOutlineClose } from "react-icons/ai";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import handleToast, { success } from "Components/toast";
import Button from "Components/Button";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import modalStyle from "jss/modalStyle";

const useStyles = makeStyles(modalStyle);

const FeedbackModal = ({ feedbackModal, setFeedbackModal, credential,SetEmail}) => {
  const classes = useStyles();
  const { apiConfig, ApiCall } = global;
  const [content, setContent] = useState("");
  const requestFeedback = async () => {
    if (!content) {
      handleToast("Please leave us some feedback!");
      return;
    }
    if (!credential.loginUserEmail) {
      handleToast("Please iuput your email address!");
      return;
    }
    const payLoad = {
      content,
      email:credential.loginUserEmail
    };
    try {
      const response = await ApiCall(
        apiConfig[apiConfig.currentEnv],
        apiConfig.postFeedback.url,
        apiConfig.postFeedback.method,
        credential.loginToken,
        payLoad
      );
      if (response.status === 200) {
        handleToast("Successfully left!", success);
      } else {
        handleToast(response.data.error);
      }
    } catch (error) {
      if (error.response){
        handleToast(error.response.data.errors[0].param+" "+error.response.data.errors[0].msg);
      } 
      else handleToast("Request Failed!");
    }
  };
  const cancelModal = () => {
    setFeedbackModal(false);
  };
  return (
    <Modal
        aria-labelledby="transition-feedback-title"
        aria-describedby="transition-feedback-description"
        open={feedbackModal}
        onClose={cancelModal}
        closeAfterTransition
    
        className={classes.modal}
      >
        <Fade in={feedbackModal}>
          <div className={classes.small_modal_paper}>
            <h4 className={classes.modal_title}>
              Feedback
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
              <Grid item className={classes.modal_center}>
              <FormControl className={classes.formControl}>
              <TextField
                id="standard-feedback-input"
                label="Feedback"
                type="text"
                multiline
                autoComplete=""
                InputProps={{
                  value: content,
                  onChange: (e) => setContent(e.target.value),
                }}
              />{" "}
            </FormControl>

              </Grid>
            </Grid>{" "}
            <Grid container spacing={3}>
              <Grid item className={classes.modal_center}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="standard-email-input"
                    label="Email"
                    type="email"
                    autoComplete=""
                    InputProps={{
                      value: credential.loginUserEmail,
                      onChange: (e) => SetEmail(e.target.value),
                    }}
                  />{" "}
                </FormControl>
              </Grid>
            </Grid>{" "}
            <Grid container spacing={3} className="mt-3">
              <Button
                color="pivx1"
                style={{ margin: "auto auto" }}
                onClick={requestFeedback}
              >
                Submit
              </Button>
            </Grid>
          </div>
        </Fade>
      </Modal>
  );
};

export default FeedbackModal;
