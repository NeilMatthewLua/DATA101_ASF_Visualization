import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Checkbox, Input, InputLabel, MenuItem, FormControl, ListItemText, ListSubheader, Select, Tooltip, Grid  } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    dropdownSelect: {
        width: '70%',
        marginTop: '10px',
        marginRight: '5px'
    },
    helpIcon: {
        marginTop: '35px',
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

function DropDownRegion(props) {
    const classes = useStyles();

    const regionLuzon = [
        { id: 1, name: 'Region 1' },
        { id: 2, name: 'Region 2' },
        { id: 3, name: 'Region 3' },
    ]

    const regionVisayas = [
        { id: 4, name: 'Region 4' },
        { id: 5, name: 'Region 5' },
        { id: 6, name: 'Region 6' },
    ]

    const regionMindanao = [
        { id: 7, name: 'Region 7' },
        { id: 8, name: 'Region 8' },
        { id: 9, name: 'Region 9' },
        { id: 10, name: 'ARMM' }
    ]

    return (
        <div className={classes.root}>
            <FormControl className={classes.dropdownSelect}>
                <InputLabel id="dropdown-region">Region/s</InputLabel>
                <Select
                    labelId="dropdown-region-label"
                    id="dropdown-region"
                    multiple
                    value={props.regionList}
                    onChange={props.handleChange}
                    input={<Input />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    <ListSubheader disableSticky>Luzon</ListSubheader>
                    {regionLuzon.map((region) => (
                        <MenuItem key={region.id} value={region.name}>
                            <Checkbox checked={props.regionList.indexOf(region.name) > -1}/>
                            <ListItemText primary={region.name} />
                        </MenuItem>
                    ))} 
                    <ListSubheader disableSticky>Visayas</ListSubheader>
                    {regionVisayas.map((region) => (
                        <MenuItem key={region.id} value={region.name}>
                            <Checkbox checked={props.regionList.indexOf(region.name) > -1}/>
                            <ListItemText primary={region.name} />
                        </MenuItem>
                    ))} 
                    <ListSubheader disableSticky>Mindanao</ListSubheader>
                    {regionMindanao.map((region) => (
                        <MenuItem key={region.id} value={region.name}>
                            <Checkbox checked={props.regionList.indexOf(region.name) > -1}/>
                            <ListItemText primary={region.name} />
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

export default DropDownRegion;