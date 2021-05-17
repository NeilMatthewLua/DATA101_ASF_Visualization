import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuBlock from "./MenuBlock";
import ContainmentIcon from '../assets/focus.svg';
import HogCountIcon from '../assets/pig.svg';

const useStyles = makeStyles(theme => ({
    root: {
        width: '25%',
        height: '50%',
        marginLeft: '30px',
        borderRadius: '20px',
        backgroundColor: theme.palette.white
    },
}));

function SideBar() {
    const classes = useStyles();
    const [menuID, setMenuID] = useState(0);

    const menuBlockItems = [
        { id: 1, label: 'Containment Zones', icon: ContainmentIcon, description: 'ADD TOOLTIP HERE', active: true },
        { id: 2, label: 'Hog Count', icon: HogCountIcon, description: 'ADD TOOLTIP HERE', active: true},
    ]
    
    const updateCurrentMenuID = (id) => {
        setMenuID(id);
        console.log("🚀 ~ file: SideBar.js ~ line 16 ~ updateCurrentMenuID ~ id", id);
    }

    return (
        <div id="SideBar" className={classes.root}>
            <MenuBlock 
                items={menuBlockItems} 
                defaultFocus={1}
                updateCurrentMenuID={updateCurrentMenuID}
            />
        </div>
    )
}

export default SideBar;