/**
 * ------------------------------------------------------------------------------------------
 * [COMPONENT]
 * @function MenuBlock     -   Shared component for menu blocks.
 *                                  
 *
 * #HOW TO CALL:
 *      <MenuBlock     items=[]
 *                     defaultFocus="" />
 *
 *    @prop  { array }      items                   -   array of menu items containing label and icon
 *                                                      data format:
 *                                                          [ { id: (from 1 to n), label: '', icon: (imported svg file)] } ]
 *    @prop  { function }   updateCurrentHeaderId   -   function called to pass the current id to the parent class
 *    @prop  { integer }    defaultFocus            -   id of the default focused menu block
 *                                                  
 *
 * USED IN:
 * SideBar.js
 *
 * ------------------------------------------------------------------------------------------
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import _ from 'lodash';
import { Button, Grid, Tooltip } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        paddingTop: '20px'
    },
    button: {
        width: '45%',
        height: '50px',
        backgroundColor: theme.palette.neutralGreen,
        padding: 0,
        '&:hover': {
            backgroundColor: theme.palette.lightGreen,
        },
    },
    buttonFocus: {
        width: '45%',
        height: '50px',
        padding: 0,
        backgroundColor: theme.palette.lightGreen,
        '&:hover': {
            backgroundColor: theme.palette.lightGreen,
        },
    },
    label: {
        // Aligns the content of the button vertically.
        flexDirection: 'column',
        fontSize: '10px',
        textTransform: 'capitalize',
        color: theme.palette.black
    },
    icon1: {
        width: '28px !important',
        height: '28px !important',
        marginRight: '10px'
    },
    icon2: {
        width: '28px !important',
        height: '28px !important',
        marginRight: '10px'
    },

}));

/**
 * This functions returns a single-select dropdown as a component.
 * @param { property }   props   -   property of the component
 */
function MenuBlock(props) {
    const classes = useStyles();
    const menuBlocks = _.get(props, ['items'], []);
    const [menuFocus, setMenuFocus] = useState(_.get(props, ['defaultFocus'], 0));

    const handleButtonClicked = (focus) => {
        setMenuFocus(focus);
        props.updateCurrentMenuID(focus);
    };

    return (
        <div className={classes.root}>
            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
            >
                {menuBlocks.map(block => {
                    return (
                        <Tooltip
                            id={"tooltip-ID-" + block.id}
                            title={block.description}
                            placement="right-start"
                        >
                            <Button
                                id={"menu-block-" + block.id}
                                key={block.id}
                                classes={{ 
                                    root: menuFocus === block.id ? classes.buttonFocus : classes.button, 
                                    label: classes.label }}
                                variant="contained"
                                color="primary"
                                onClick={() => handleButtonClicked(block.id)}
                            >
                                <div style={{display: 'flex'}}>
                                    <img className={block.id == 1 ? classes.icon1 : classes.icon2} src={block.icon} />
                                    <div style={{marginTop:'5px'}} >
                                        {block.label}
                                    </div>
                                </div>
                            </Button>
                        </Tooltip>
                    )
                })}
            </Grid>
        </div> 
    );
}

MenuBlock.propTypes = {
    items: PropTypes.array,
    defaultFocus: PropTypes.number,
    updateCurrentMenuID: PropTypes.func
}

export default MenuBlock;
