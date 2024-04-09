import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'Components/Button';
import CustomTable from 'Components/CustomTable';
import StyledTab from 'Components/StyledTab';
import StyledTabs from 'Components/StyledTabs';
import TabPanel from 'Components/TabPanel';
import handleToast, { success } from 'Components/toast';
import modalStyle from 'jss/modalStyle';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineClose, AiOutlineCopy } from 'react-icons/ai';
const useStyles = makeStyles(modalStyle);

const AffiliateModal = ({ affiliateModal, setAffiliateModal, credential }) => {
  const reference = useRef();
  const classes = useStyles();
  const { apiConfig, ApiCall } = global;
  const [bonus, setBonus] = useState([]);
  const [downLines, setDownLines] = useState([]);
  const [tab, setTab] = useState(0);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  const cancelModal = () => {
    setAffiliateModal(false);
  };
  const copyLink = () => {
    const tmp_tag = document.createElement('textarea');
    tmp_tag.value = apiConfig.app + apiConfig.signUp.url + '/' + credential.loginUserName;
    reference.current.appendChild(tmp_tag);
    tmp_tag.setSelectionRange(0, 99999);
    tmp_tag.select();

    document.execCommand('copy');
    reference.current.removeChild(tmp_tag);
    handleToast('Invite Link copied!', success);
  };
  useEffect(() => {
    (async () => {
      try {
        const response = await ApiCall(
          apiConfig[apiConfig.currentEnv],
          apiConfig.getBonus.url,
          apiConfig.getBonus.method,
          credential.loginToken
        );
        if (response.status === 200) {
          setBonus(response.data.bonus);
          setDownLines(response.data.downLines);
        } else {
          handleToast(response.data.error);
        }
      } catch (error) {
        if (error.response) handleToast(error.response.data.error);
        else handleToast('Request Failed!');
      }
    })();
    return () => {};
  }, []);
  return (
    <Modal
      aria-labelledby="transition-withdrawal-title"
      aria-describedby="transition-withdrawal-description"
      open={affiliateModal}
      onClose={cancelModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
      className={classes.modal}
    >
      <Fade in={affiliateModal}>
        <div className={classes.small_modal_paper}>
          <h4 className={classes.modal_title}>
            Invite Friends
            <Button simple round justIcon className={classes.modal_close} onClick={cancelModal}>
              <AiOutlineClose />
            </Button>
          </h4>
          <Grid container spacing={3}>
            <Grid item className={classes.modal_center}>
              <span className={classes.modal_address}>
                {apiConfig.app + apiConfig.signUp.url + '/' + credential.loginUserName}
              </span>{' '}
              &nbsp;
              <Button
                color="pivx1"
                round
                justIcon
                onClick={copyLink}
                size={'sm'}
                style={{ padding: '2px 3px' }}
              >
                <AiOutlineCopy />
              </Button>
            </Grid>
          </Grid>
          <div ref={reference}></div>
          <Grid container spacing={3}>
            <Grid item className={classes.modal_center}>
              <StyledTabs
                variant="fullWidth"
                value={tab}
                onChange={handleChange}
                aria-label="styled tabs example"
              >
                <StyledTab label="Referrers" />
                <StyledTab label="Bonus" />
              </StyledTabs>
              <TabPanel value={tab} index={0}>
                <CustomTable
                  headCells={[
                    {
                      id: 'name',
                      numeric: false,
                      disablePadding: false,
                      label: 'Username'
                    },
                    {
                      id: 'bonus',
                      numeric: true,
                      disablePadding: false,
                      label: 'Bonus'
                    }
                  ]}
                  rows={downLines}
                  selectable={false}
                  toolbar={false}
                />
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <CustomTable
                  headCells={[
                    {
                      id: 'name',
                      numeric: false,
                      disablePadding: false,
                      label: 'Username'
                    },
                    {
                      id: 'table',
                      numeric: true,
                      disablePadding: false,
                      label: 'Table Id'
                    },
                    {
                      id: 'amount',
                      numeric: true,
                      disablePadding: false,
                      label: 'Amount'
                    }
                  ]}
                  rows={bonus}
                  selectable={false}
                  toolbar={false}
                />
              </TabPanel>
            </Grid>
          </Grid>

          <Grid container spacing={3} className="mt-3">
            <Button color="pivx1" style={{ margin: 'auto auto' }} onClick={cancelModal}>
              OK
            </Button>
          </Grid>
        </div>
      </Fade>
    </Modal>
  );
};

export default AffiliateModal;
