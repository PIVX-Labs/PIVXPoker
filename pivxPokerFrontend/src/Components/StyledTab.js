import Tab from '@mui/material/Tab';
import {  withStyles } from '@mui/styles';
import React from 'react';
const StyledTab = withStyles((theme) => ({
    root: {
      textTransform: 'none',
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      '& span':{
        color:"black!important",
      },
      '&:focus': {
        opacity: 1,
        outline:'none!important',
      },
    },
  }))((props) => <Tab disableRipple {...props} />);
  export default StyledTab;