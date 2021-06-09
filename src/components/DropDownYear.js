/**
 * ------------------------------------------------------------------------------------------
 * [COMPONENT]
 * @function DropDownYear   -   Dropdown for region selection
 *                                  
 *
 * #HOW TO CALL:
 *      <DropDownYear   yearList
 *                      handleChange />
 *
 *    @prop { Array }      yearList           - chosen years to display for HOG COUNT CHOROPLETH, HOG COUNT BAR CHART
 *    @prop { Function }   handleChange       - function handler to display which region data
 * 
 * USED IN:
 * SideBar.js
 *
 * ------------------------------------------------------------------------------------------
 */

import React from "react";
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import { Input, InputLabel, MenuItem, FormControl, ListItemText, Select, Tooltip  } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    dropdownSelect: {
        width: '70%',
        marginTop: '20px',
        marginRight: '5px'
    },
    helpIcon: {
        marginTop: '45px',
        float: 'right',
        width: '20px !important',
        height: '20px !important'
    },
    root: {
        display: 'flex',
        justifyContent: 'center'
    }
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
        <div className={classes.root}>
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
                title={"Select the year you want to visualize"}
                placement="right-start"
            >
                <HelpOutline className={classes.helpIcon}/>
            </Tooltip>
        </div>
    )
}

DropDownYear.propTypes = {
    menu: PropTypes.number,
    regionList: PropTypes.array,
    handleChange: PropTypes.func,
}

export default DropDownYear;