/**
 * ------------------------------------------------------------------------------------------
 * [COMPONENT]
 * @function ContainmentLegend   -   Choropleth legend for the containment zone 
 *                                  
 *
 * #HOW TO CALL:
 *      <ContainmentLegend />
 * 
 * USED IN:
 * DashboardMap.js
 *
 * ------------------------------------------------------------------------------------------
 */

import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import { makeStyles } from "@material-ui/core/styles";

mapboxgl.accessToken = 'pk.eyJ1Ijoidmlzc2FyaW9uIiwiYSI6ImNrbzJsNXZsMjAycGIydm8yaTZqN2RnazIifQ.697-DKrs6BxhhJ3dQjYFbA';

const useStyles = makeStyles(theme => ({
    legend : {
        position: 'absolute',
        top: '100px',
        right: '40px',
        display: 'inline-block',
        zIndex: '999',
        padding: '10px',
        height: '170px',
        width: '140px',
        backgroundColor: "#fff",
        borderRadius: "20px",
        padding: "10px 20px 10px"
    },
    legendKey : {
        display: 'inline-block',
        borderRadius: '100%',
        width: '12px',
        height: '12px',
        marginRight: '5px'
    }
    
}));

const palette = ["#EB1919", "#FF8080", "#FFE380", "#7EC7AE", "#218173"];
const values = ["Infected Zone", "Buffer Zone", "Surveillance Zone", "Protected Zone", "Free Zone"];

function ContainmentLegend(props) {
    const classes = useStyles();

    return(
        
        <div className={classes.legend}>
            <h3 style={{textAlign : "center", margin : "0px 0px 10px 0px"}}><b>Legend</b></h3>
            {values.map((entry, index) => (
                <div>
                    <span className={classes.legendKey} style={{backgroundColor : palette[index]}}/>
                    { entry }
                </div>
            ))}
        </div>
    )
}

ContainmentLegend.propTypes = {}

export default ContainmentLegend;