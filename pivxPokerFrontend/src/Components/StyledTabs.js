import {  withStyles } from '@mui/styles';
import Tabs from '@mui/material/Tabs';
import React from 'react';

const StyledTabs = withStyles({
    indicator: {
      marginLeft:'auto',
      marginRight:'auto',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      color: '#fff',
      '& > span': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: '#662D91',
      },
      
    },
  })((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);
  export default StyledTabs;