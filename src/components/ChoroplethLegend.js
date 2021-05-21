import React, { useRef, useEffect, useState } from 'react';
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
        height: '150px',
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

const palette = ["#3bfeb8", "#13eba2", "#0ad48b", "#05ac72", "#218173"];

function ChoroplethLegend(props) {
    const classes = useStyles();

    return(
        
        <div className={classes.legend}>
            <h3 style={{textAlign : "center", margin : "0px 0px 10px 0px"}}><b>Legend</b></h3>
            {props.values.map((entry, index) => (
                <div>
                    <span className={classes.legendKey} style={{backgroundColor : palette[index]}}/>
                    { entry }
                </div>
            ))}
        </div>
    )
}

ChoroplethLegend.propTypes = {
    values: PropTypes.array
}

export default ChoroplethLegend;