import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@mui/styles';
import Button from 'Components/Button';
import handleToast from 'Components/toast';
import lobbyStyle from 'jss/pages/lobbyStyle';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const useStyles = makeStyles(lobbyStyle);

const ProfileModal = ({ profileModal, setProfileModal, credential, photoChange }) => {
  const classes = useStyles();
  const { apiConfig, ApiCall } = global;
  const [image, setImage] = useState(null);
  const [imageCrop, setImageCrop] = useState({
    src: credential.loginUserAvatar
      ? `${apiConfig.api}/uploads/avatars/${credential.loginUserAvatar}`
      : null,
    crop: { unit: 'px', aspect: 1 / 1, width: 200 }
  });
  const handleFileChange = (e) => {
    if (e.target.files[0])
      setImageCrop({
        ...imageCrop,
        src: URL.createObjectURL(e.target.files[0])
      });
  };

  const postProfile = () => {
    (async () => {
      let base64Image;
      if (image) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = imageCrop.crop.width;
        canvas.height = imageCrop.crop.height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          image,
          imageCrop.crop.x * scaleX,
          imageCrop.crop.y * scaleY,
          imageCrop.crop.width * scaleX,
          imageCrop.crop.height * scaleY,
          0,
          0,
          imageCrop.crop.width,
          imageCrop.crop.height
        );

        base64Image = canvas.toDataURL('image/jpeg');
      }
      const data = new FormData();
      data.append('avatar', base64Image);

      try {
        const response = await ApiCall(
          apiConfig[apiConfig.currentEnv],
          apiConfig.profile.url,
          apiConfig.profile.method,
          credential.loginToken,
          data
        );
        if (response.status === 200) {
          photoChange(response.data.profilePhoto);
        }
        setProfileModal(false);
      } catch (error) {
        console.log(error);
        if (error.response) handleToast(error.response.data.error);
        else handleToast('Failed!');
      }
    })();
  };

  return (
    <Modal
      aria-labelledby="transition-profile-title"
      aria-describedby="transition-profile-description"
      open={profileModal}
      onClose={() => setProfileModal(!profileModal)}
      closeAfterTransition
      className={classes.modal}
    >
      <Fade in={profileModal}>
        <div className={classes.small_modal_paper}>
          <h4 className={classes.modal_title}>
            My Profile
            <Button
              simple
              round
              justIcon
              className={classes.modal_close}
              onClick={() => setProfileModal(false)}
            >
              <AiOutlineClose />
            </Button>
          </h4>
          <Grid container spacing={3}>
            <Grid item className={classes.modal_center}>
              <div className={classes.imageCropUploader}>
                {imageCrop.src && (
                  <ReactCrop
                    crop={imageCrop.crop}
                    onChange={(arg) => setImageCrop({ ...imageCrop, crop: arg })}
                  >
                    <img src={imageCrop.src} alt="avatar" onLoad={(e) => setImage(e.target)} />
                  </ReactCrop>
                )}
                <br />
                <input type="file" id="file" accept="image/*" onChange={handleFileChange} onClick={() => {}} />
                <label htmlFor="file" className={classes.btn}>
                  Avatar
                </label>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item md={12} lg={8}>
              <Grid container>
                <Grid item xs={4}>
                  Username:
                </Grid>
                <Grid item xs={8} className={classes.modal_field}>
                  {'  ' + credential.loginUserName}
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12} lg={4}>
              <Grid container>
                <Grid item xs={4}>
                  Level:
                </Grid>
                <Grid item xs={8} className={classes.modal_field}>
                  {'  ' + credential.loginUserLevel}
                </Grid>
              </Grid>
            </Grid>
          </Grid>{' '}
          <Grid container spacing={3} className="mt-3">
            <Button color="pivx1" style={{ margin: 'auto auto' }} onClick={postProfile}>
              OK
            </Button>
            <Button
              color="pivx3"
              style={{ margin: 'auto auto' }}
              onClick={() => setProfileModal(false)}
            >
              Cancel
            </Button>
          </Grid>
        </div>
      </Fade>
    </Modal>
  );
};

export default ProfileModal;
