import { withStyles, makeStyles } from '@mui/styles';
import Slider from '@mui/material/Slider';
import React from 'react';

const PrettoSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
    '& *': {
      color: '#52af77'
    }
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',

    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit'
    }
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)'
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  }
})(Slider);

export default PrettoSlider;
