import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import MenuBlock from "./MenuBlock";
import DropDownRegion from "./DropDownRegion";
import DropDownYear from "./DropDownYear";
import ContainmentIcon from '../assets/focus.svg';
import HogCountIcon from '../assets/pig.svg';
import { Button, Switch, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        width: '70%',
        height: '100%',
        padding: '5px',
        borderRadius: '20px',
        position: 'relative',
        backgroundColor: theme.palette.white
    },
    button: {
        width: '70%',
        padding: '0',
        backgroundColor: theme.palette.neutralGreen,
        border: 'none',
        borderRadius: '10px',
        '&:hover': {
            backgroundColor: theme.palette.lightGreen,
        },
        marginBottom: '10px'
    },
    middleSet: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center'
    }
}));



function SideBar(props) {
    const classes = useStyles();
    const [menuID, setMenuID] = useState(1);
    const [regionList, setRegionChange] = useState([]);
    const [yearChoice, setYearChange] = useState();
    const [checkedBar, setCheckedBar] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
      
    const menuBlockItems = [
        { id: 1, label: 'Containment Zones', icon: ContainmentIcon, description: 'ADD TOOLTIP HERE', active: true },
        { id: 2, label: 'Hog Count', icon: HogCountIcon, description: 'ADD TOOLTIP HERE', active: true},
    ];

    useEffect(() => {
        if (yearChoice == null && menuID != 1) {
            setIsButtonDisabled(true); 
        }
        else if ((menuID == 1 || menuID == 2 && checkedBar) && regionList.length == 0) {
            setIsButtonDisabled(true); 
        } else {
            setIsButtonDisabled(false);
        }
    }, [yearChoice, regionList, checkedBar]);
    
    const handleSwitchChange = (event) => {
        setCheckedBar(event.target.checked);
        props.onHogViewChange(event.target.checked);
    };
    
    const updateCurrentMenuID = (id) => {
        setMenuID(id);
        setCheckedBar(false);
        props.onMenuChange(id);
    };
    
    const handleRegionChange = (event) => {
        setRegionChange(event.target.value.sort((a, b) => (a.id > b.id) ? 1 : -1));
    };
    
    const handleYearChange = (event) => {
        setYearChange(event.target.value);
    };
    
    const handleVisualize = () => {
        props.onRegionChange(regionList);
        props.onYearChange(yearChoice);
        props.onVisualize();
    };

    return (
        <div id="SideBar" className={classes.root}>
            <MenuBlock 
                items={menuBlockItems} 
                defaultFocus={1}
                updateCurrentMenuID={updateCurrentMenuID}
            />

            {
                menuID === 2 ?
                        <div className={classes.middleSet}>
                            <Grid component="label" container alignItems="center" spacing={1} justify="center">
                                <Grid item>Map View</Grid>
                                <Grid item>
                                    <Switch 
                                        className={classes.switchView} 
                                        checked={checkedBar} 
                                        onChange={handleSwitchChange} 
                                        color="default" 
                                        name="switchView" 
                                    />
                                </Grid>
                                <Grid item>Bar Chart View</Grid>
                            </Grid>
                        </div>
                :
                    null
            }
            
            {
                menuID == 1  || menuID == 2 && checkedBar ? 
                    <DropDownRegion 
                        handleChange={handleRegionChange}
                        regionList={regionList}
                        menu={menuID}
                    />
                :
                    null
            }
            
            {
                menuID === 2 ?
                    <DropDownYear 
                        handleChange={handleYearChange}
                        yearList={yearChoice}
                    />
                :
                    null
            }

            <div className={classes.middleSet}>
                <Button 
                    className={classes.button}
                    // variant="contained"
                    onClick={() => handleVisualize()}
                    disabled={isButtonDisabled}
                >
                    Visualize
                </Button>
            </div>
        </div>
    )
}

SideBar.propTypes = {
    onRegionChange: PropTypes.func
}

export default SideBar;