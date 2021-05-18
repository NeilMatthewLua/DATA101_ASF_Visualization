import React, { useState } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import MenuBlock from "./MenuBlock";
import DropDownRegion from "./DropDownRegion";
import DropDownYear from "./DropDownYear";
import ContainmentIcon from '../assets/focus.svg';
import HogCountIcon from '../assets/pig.svg';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        width: '350px',
        height: '350px',
        padding: '20px',
        borderRadius: '20px',
        position: 'relative',
        backgroundColor: theme.palette.white
    },
    button: {
        width: '70%',
        height: '10%',
        backgroundColor: theme.palette.neutralGreen,
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        borderRadius: '10px',
        '&:hover': {
            backgroundColor: theme.palette.lightGreen,
        },
    },
}));



function SideBar(props) {
    const classes = useStyles();
    const [menuID, setMenuID] = useState(1);
    const [regionList, setRegionChange] = useState([]);
    const [yearList, setYearChange] = useState();
    
    const menuBlockItems = [
        { id: 1, label: 'Containment Zones', icon: ContainmentIcon, description: 'ADD TOOLTIP HERE', active: true },
        { id: 2, label: 'Hog Count', icon: HogCountIcon, description: 'ADD TOOLTIP HERE', active: true},
    ];
    const updateCurrentMenuID = (id) => {
        setMenuID(id);
        console.log("🚀 ~ file: SideBar.js ~ line 16 ~ updateCurrentMenuID ~ id", id);
    };
    
    const handleRegionChange = (event) => {
        console.log("🚀 ~ file: SideBar.js ~ line 62 ~ SideBar ~ regionList", event.target.value)
        setRegionChange(event.target.value.sort((a, b) => (a.id > b.id) ? 1 : -1));
        props.onRegionChange(event.target.value.sort((a, b) => (a.id > b.id) ? 1 : -1));
        console.log("🚀 ~ file: SideBar.js ~ line 62 ~ SideBar ~ regionList", regionList)
    };

    const handleYearChange = (event) => {
        console.log("🚀 ~ file: SideBar.js ~ line 62 ~ SideBar ~ regionList", event.target.value)
        setYearChange(event.target.value);
        console.log("🚀 ~ file: SideBar.js ~ line 62 ~ SideBar ~ regionList", regionList)
    };

    const handleVisualize = () => {
        console.log("🚀 ~ Clicked Visualize");
    };

    return (
        <div id="SideBar" className={classes.root}>
            <MenuBlock 
                items={menuBlockItems} 
                defaultFocus={1}
                updateCurrentMenuID={updateCurrentMenuID}
            />

            <DropDownRegion 
                handleChange={handleRegionChange}
                regionList={regionList}
            />
            
            {menuID === 2 ?
                <DropDownYear 
                    handleChange={handleYearChange}
                    yearList={yearList}
                />
            :
                null
            }

            <Button 
                class={classes.button}
                variant="contained" 
                color="primary"
                onClick={() => handleVisualize()}
            >
                Visualize
            </Button>
        </div>
    )
}

SideBar.propTypes = {
    onRegionChange: PropTypes.func
}

export default SideBar;