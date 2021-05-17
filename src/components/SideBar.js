import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuBlock from "./MenuBlock";
import ContainmentIcon from '../assets/focus.svg';
import HogCountIcon from '../assets/pig.svg';
import { Button } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
    root: {
        width: '25%',
        height: '50%',
        marginLeft: '30px',
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
        borderRadius: '10px',
        transform: 'translate(-50%, -50%)',
        '&:hover': {
            backgroundColor: theme.palette.lightGreen,
        },
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
};

function SideBar() {
    const classes = useStyles();
    const [menuID, setMenuID] = useState(0);
    const [regionsList, setRegionChange] = useState([]);

    const menuBlockItems = [
        { id: 1, label: 'Containment Zones', icon: ContainmentIcon, description: 'ADD TOOLTIP HERE', active: true },
        { id: 2, label: 'Hog Count', icon: HogCountIcon, description: 'ADD TOOLTIP HERE', active: true},
    ]
    
    //TODO Consider getting data from BE
    const regions = [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
      ];
      
    const updateCurrentMenuID = (id) => {
        setMenuID(id);
        console.log("🚀 ~ file: SideBar.js ~ line 16 ~ updateCurrentMenuID ~ id", id);
    }

    const handleRegionChange = (event) => {
        setRegionChange(event.target.value);
    };

    const handleVisualize = () => {
        console.log("🚀 ~ Clicked Visualize");
    }

    return (
        <div id="SideBar" className={classes.root}>
            <MenuBlock 
                items={menuBlockItems} 
                defaultFocus={1}
                updateCurrentMenuID={updateCurrentMenuID}
            />
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel>
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    multiple
                    value={regionsList}
                    onChange={handleRegionChange}
                    input={<Input />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                {regions.map((region) => (
                    <MenuItem key={region} value={region}>
                    <Checkbox checked={regionsList.indexOf(region) > -1} />
                    <ListItemText primary={region} />
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            <Button 
                class={classes.button}
                variant="contained" color="primary"
                onClick={() => handleVisualize()}
            >
                Visualize
            </Button>
        </div>
    )
}

export default SideBar;