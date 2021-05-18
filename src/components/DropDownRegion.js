import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Checkbox, Input, InputLabel, MenuItem, FormControl, ListItemText, ListSubheader, Select, Tooltip  } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    dropdownSelect: {
        width: '70%',
        position: 'absolute',
        marginTop: '40px',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    helpIcon: {
        position: 'absolute',
        top: '50%',
        right: '0px',
        transform: 'translate(-50%, -50%)',
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

function DropDownRegion(props) {
    const classes = useStyles();

    //TODO Consider getting data from BE
    const islandRegions = [
        {
            island: 'Luzon', 
            regions: [
                {name: 'Region 1', id: 1},
                {name: 'Region 2', id: 2},
                {name: 'Region 3', id: 3}
            ]
        },
        {
            island: 'Visayas', 
            regions: [
                {name: 'Region 4', id: 4},
                {name: 'Region 5', id: 5},
                {name: 'Region 6', id: 6}
            ]
        },
        {
            island: 'Mindanao', 
            regions: [
                {name: 'Region 7', id: 7},
                {name: 'Region 8', id: 8},
                {name: 'Region 9', id: 9}
            ]
        },
    ];

    const regionLuzon = [
        { name: 'Region 1', id: 1 },
        { name: 'Region 2', id: 2 },
        { name: 'Region 3', id: 3 },
    ]

    const regionVisayas = [
        { name: 'Region 4', id: 4 },
        { name: 'Region 5', id: 5 },
        { name: 'Region 6', id: 6 },
    ]

    const regionMindanao = [
        { name: 'Region 7', id: 7 },
        { name: 'Region 8', id: 8 },
        { name: 'Region 9', id: 9 },
    ]

    return (
        <div>
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