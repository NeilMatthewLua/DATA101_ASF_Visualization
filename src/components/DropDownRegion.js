import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Checkbox, Input, InputLabel, MenuItem, FormControl, ListItemText, ListSubheader, Select, Tooltip } from '@material-ui/core';
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
    },
    disableClick: {
        pointerEvents: 'none',
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

    const regionLuzonNCR = [
        { id: 0, name: 'NCR' },
        { id: 1, name: 'Region I' },
        { id: 2, name: 'Region II' },
        { id: 3, name: 'Region III' },
        { id: 4, name: 'Region IV-A' },
        { id: 5, name: 'Region IV-B' },
        { id: 6, name: 'Region V' },
        { id: 7, name: 'CAR' },
    ]

    const regionLuzon = [
        { id: 1, name: 'Region I' },
        { id: 2, name: 'Region II' },
        { id: 3, name: 'Region III' },
        { id: 4, name: 'Region IV-A' },
        { id: 5, name: 'Region IV-B' },
        { id: 6, name: 'Region V' },
        { id: 7, name: 'CAR' },
    ]

    const regionVisayas = [
        { id: 8, name: 'Region VI' },
        { id: 9, name: 'Region VII' },
        { id: 10, name: 'Region VIII' },
    ]

    const regionMindanao = [
        { id: 11, name: 'Region IX' },
        { id: 12, name: 'Region X' },
        { id: 13, name: 'Region XI' },
        { id: 14, name: 'Region XII' },
        { id: 15, name: 'Region XIII' },
        { id: 16, name: 'ARMM' }
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
                    <ListSubheader disableSticky className={classes.disableClick}>Luzon</ListSubheader>
                    {
                        props.menu == 1 ? 
                            regionLuzonNCR.map((region) => (
                                <MenuItem key={region.id} value={region.name}>
                                    <Checkbox checked={props.regionList.indexOf(region.name) > -1}/>
                                    <ListItemText primary={region.name} />
                                </MenuItem>
                            )) 
                        :
                            regionLuzon.map((region) => (
                                <MenuItem key={region.id} value={region.name}>
                                    <Checkbox checked={props.regionList.indexOf(region.name) > -1}/>
                                    <ListItemText primary={region.name} />
                                </MenuItem>
                            )) 
                    }
                    <ListSubheader disableSticky className={classes.disableClick}>Visayas</ListSubheader>
                    {regionVisayas.map((region) => (
                        <MenuItem key={region.id} value={region.name}>
                            <Checkbox checked={props.regionList.indexOf(region.name) > -1}/>
                            <ListItemText primary={region.name} />
                        </MenuItem>
                    ))} 
                    <ListSubheader disableSticky className={classes.disableClick}>Mindanao</ListSubheader>
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