/**
 * ------------------------------------------------------------------------------------------
 * [COMPONENT]
 * @function DropDownRegion   -   Dropdown for region selection
 *                                  
 *
 * #HOW TO CALL:
 *      <DropDownRegion menu
 *                      regionList
 *                      handleChange />
 *
 *    @prop { Number }     menu               - menu ID of the chosen function (i.e. containment zone, hog count)
 *    @prop { Array }      regionList         - chosen regions to display for CONTAIMENT ZONE, HOG COUNT BAR CHART
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
  autoFocus: false,
  getContentAnchorEl: null
};

function DropDownRegion(props) {
    const classes = useStyles();

    const lookup = {
        'All Regions' : -1,
        'NCR' : 0,  
        'Region I' : 1,
        'Region II' : 2,
        'Region III' : 3,
        'Region IV-A' : 4,
        'Region IV-B' : 5,
        'Region V' : 6,
        'CAR' : 7,
        'Region VI' : 8,
        'Region VII' : 9,
        'Region VIII' : 10,
        'Region IX' : 11,
        'Region X' : 12,
        'Region XI' : 13,
        'Region XII' : 14,
        'Region XIII' : 15,
        'ARMM' : 16
    };

    const allRegions = {id: -1, name: 'All Regions'}

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
    
    const filterList = () => {
        var index = props.regionList.indexOf('All Regions');
        if (index > -1 ) {
            return props.regionList.slice(1, props.regionList.length);
        }
        else {
            return props.regionList;
        }
    }

    return (
        <div className={classes.root}>
            <FormControl className={classes.dropdownSelect}>
                <InputLabel id="dropdown-region">Region/s</InputLabel>
                <Select
                    labelId="dropdown-region-label"
                    id="dropdown-region"
                    multiple
                    value={filterList()}
                    onChange={props.handleChange}
                    input={<Input />}
                    renderValue={(selected) => selected.sort((a, b) => (lookup[a] > lookup[b]) ? 1 : -1).join(', ')}
                    MenuProps={MenuProps}
                >
                    <MenuItem key={allRegions.id} value={allRegions.name}>
                        <Checkbox checked={props.regionList.indexOf(allRegions.name) > -1}/>
                        <ListItemText primary={allRegions.name} />
                    </MenuItem>

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
                title={"Select the regions you want to visualize"}
                placement="right-start"
                >
                <HelpOutline className={classes.helpIcon}/>
            </Tooltip>
        </div>
    )
}

DropDownRegion.propTypes = {
    menu: PropTypes.number,
    regionList: PropTypes.array,
    handleChange: PropTypes.func,
}

export default DropDownRegion;