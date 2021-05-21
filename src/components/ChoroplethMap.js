import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import { makeStyles } from "@material-ui/core/styles";
import ChoroplethLegend from './ChoroplethLegend';

mapboxgl.accessToken = 'pk.eyJ1Ijoidmlzc2FyaW9uIiwiYSI6ImNrbzJsNXZsMjAycGIydm8yaTZqN2RnazIifQ.697-DKrs6BxhhJ3dQjYFbA';

const useStyles = makeStyles(theme => ({
    mapContainer: {
        height: '80vh',
        width: '100%',
        borderStyle: 'solid'
    },
    sidebar: {
        backgroundColor: 'rgba(35, 55, 75, 0.9)',
        color: '#ffffff',
        padding: '6px 12px',
        fontFamily: 'monospace',
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        margin: '12px',
        borderRadius: '4px'
    }
}));

const stops = {
    "2018": [
        [0, 21879],
        [21880, 43759],
        [43760, 65639],
        [65640, 87519],
        [87520, 109400]
    ],
    "2019": [
        [0, 22319],
        [22320, 44639],
        [44640, 66959],
        [66960, 89279],
        [89280, 111603]
    ],
    "2020": [
        [0, 22820],
        [22821, 45641],
        [45642, 68462],
        [68463, 91283],
        [91284, 114106]
    ],
}

function ChoroplethMap(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lat, setLat] = useState(12.45);
    const [lng, setLng] = useState(122.6);
    const [zoom, setZoom] = useState(5);
    const classes = useStyles();

    const createStops = (year) => {
        const maxVals = { '2018': 110000, '2019': 112000, '2020': 114000};
        var list = [];
        for (let i = 0; i < 5; i++) {
            let lb = (i * maxVals[year] / 5).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            let ub = ((i + 1) * maxVals[year] / 5 - 1).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            list.push(lb + " - " + ub);
        }
        return list;
    } 

    const bounds = [
        [111.39419733396409, 2.4205353885351153], // Southwest coordinates
        [132.10478702271024, 23.622907720786323] // Southwest coordinates
    ];

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/vissarion/ckowziiyp0vfv18pjhdv5s425',
            center: [lng, lat],
            zoom: zoom,
            minZoom: 7,
            maxZoom: 13,
            maxBounds: bounds,
        });
    }, []);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
        map.current.on('click', (e) => {
            var regionData = map.current.queryRenderedFeatures(e.point)[0]?.properties;
            if (regionData) {
                props.onClickRegion(regionData);
                console.log(regionData);
            }
        });
    }, [map.current]);

    useEffect(() => {
        let layerIDs = ["hogcount_2018", "hogcount_2019", "hogcount_2020"];

        if (props.year != undefined) {
            layerIDs.forEach((id) => {
                console.log(props.year)
                if ("hogcount_" + props.year == id) {
                    map.current.setLayoutProperty(id, 'visibility', 'visible'); 
                } else {
                    map.current.setLayoutProperty(id, 'visibility', 'none');
                }
            })
        }
    }, [props.year]);



    return(
        // <div>
        //     <div className={classes.sidebar}>
        //     Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        //     </div>
        // {/* </div> */}
        <div>
            <div ref={mapContainer}  className={classes.mapContainer}/>
            <ChoroplethLegend values={props.year ? createStops(props.year) : []}/>
        </div>
    )
}

ChoroplethMap.propTypes = {
    year: PropTypes.number
}

export default ChoroplethMap;