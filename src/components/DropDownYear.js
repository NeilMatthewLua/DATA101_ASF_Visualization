import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Input, InputLabel, MenuItem, FormControl, ListItemText, ListSubheader, Select, Tooltip  } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    dropdownSelect: {
        width: '70%',
        position: 'absolute',
        marginTop: '100px',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    helpIcon: {
        marginTop: '100px',
        float: 'right',
        width: '20px !important',
        height: '20px !important'
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left"
  },
  getContentAnchorEl: null
};

function DropDownYear(props) {
    const classes = useStyles();

    const years = [
        "2018",
        "2019",
        "2020"
    ]

    return (
        <div>
            <FormControl className={classes.dropdownSelect}>
                <InputLabel id="dropdown-year">Year</InputLabel>
                <Select
                    labelId="dropdown-year-label"
                    id="dropdown-year"
                    value={props.yearList}
                    onChange={props.handleChange}
                    input={<Input />}
                    renderValue={(selected) => selected}
                    MenuProps={MenuProps}
                >
                    {years.map((year) => (
                        <MenuItem key={year} value={year}>
                            <ListItemText primary={year} />
                        </MenuItem>
                    ))} 
                </Select>
            </FormControl>
            <Tooltip 
                id={`tooltip-ID-${props.type}`}
                title={"ADD TOOLTIP HERE"}
                placement="right-start"
            >
                <HelpOutline className={classes.helpIcon}/>
            </Tooltip>
        </div>
    )
}

export default DropDownYear;