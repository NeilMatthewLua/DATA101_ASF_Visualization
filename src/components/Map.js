import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { makeStyles } from "@material-ui/core/styles";

mapboxgl.accessToken = 'pk.eyJ1IjoibmVpbGx1YSIsImEiOiJja254enBmdnExYnRxMnFta2UycHd3Z25mIn0.1uM0ALoj_VBfrM0IZ8rRNg';

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

function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lat, setLat] = useState(12.45);
    const [lng, setLng] = useState(122.6);
    const [zoom, setZoom] = useState(5);
    const classes = useStyles();


    const bounds = [
        [111.39419733396409, 2.4205353885351153], // Southwest coordinates
        [132.10478702271024, 23.622907720786323] // Southwest coordinates
    ];

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/neillua/ckouvwv0s2k7k18lnryyc26tv',
            center: [lng, lat],
            zoom: zoom,
            maxBounds: bounds,
            // attributionControl: false
        })
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return(
        // <div>
        //     <div className={classes.sidebar}>
        //     Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        //     </div>
        // {/* </div> */}
        <div ref={mapContainer}  className={classes.mapContainer}/>
    )
}

export default Map;