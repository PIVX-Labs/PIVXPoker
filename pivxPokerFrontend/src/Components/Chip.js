import React from 'react';
import { makeStyles } from "@mui/styles";
import clsx from "clsx";


const chipStyle={
    chip: {
        width: '1.2em',
        height: '1em',
        borderRadius: '50%',
        border: '.15em dashed #fff',
        boxShadow: '1px -1px 10px #222',
        marginBottom:'-0.8em'
    },
    chip_1:{
        backgroundColor: '#eee',
        borderColor: '#22f'
    },
    chip_5:{
        backgroundColor: '#f22'
    },
    chip_25:{
        backgroundColor: '#2f2'
    },
    chip_100:{
        backgroundColor: '#111'
    },
    chip_500:{
        backgroundColor: '#82c'
    },
    chip_1000:{
        backgroundColor: '#aa2'
    },
    chip_5000:{
        backgroundColor: '#888'
    },
    chip_25000:{
        backgroundColor: '#8cc'
    },
    chip_100000:{
        backgroundColor: '#c88'
    },
    chip_500000:{
        backgroundColor: '#c8c'
    },
    chip_1000000:{
        backgroundColor: '#0aa'
    },
    chip_5000000:{
        backgroundColor: '#a00'
    },
    chip_25000000:{
        backgroundColor: '#0a0'
    },
    
};
const useStyles = makeStyles(chipStyle);
const Chip=(props)=>{

    const classes = useStyles();
    return (
        <div className={clsx(classes.chip, classes['chip_'+props.weight])} ></div>
    )
}
export default Chip;