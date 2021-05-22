import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import { makeStyles } from "@material-ui/core/styles";
import ChoroplethLegend from './ChoroplethLegend';

mapboxgl.accessToken = 'pk.eyJ1Ijoidmlzc2FyaW9uIiwiYSI6ImNrbzJsNXZsMjAycGIydm8yaTZqN2RnazIifQ.697-DKrs6BxhhJ3dQjYFbA';

const useStyles = makeStyles({
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
});

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
    const [toolTip, setToolTip] = useState(null);
    const [legendValues, setLegendValues] = useState([]);
    const classes = useStyles();

    // Create the stop values for the legend based on max values per year
    const createStops = (year) => {
        const maxVals = { '2018': 110000, '2019': 112000, '2020': 114000};
        var list = [];
        if (year >= 2018 && year <= 2020) {
            for (let i = 0; i < 5; i++) {
                let lb = (i * maxVals[year] / 5).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                let ub = ((i + 1) * maxVals[year] / 5 - 1).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                list.push(lb + " - " + ub);
            }
        }
        return list;
    } 

    const bounds = [
        [111.39419733396409, 2.4205353885351153], // Southwest coordinates
        [132.10478702271024, 23.622907720786323] // Southwest coordinates
    ];

    useEffect(() => {
        if (map.current) return; // wait for map to initialize
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/vissarion/ckowziiyp0vfv18pjhdv5s425',
            center: [lng, lat],
            zoom: zoom,
            minZoom: 7,
            maxZoom: 13,
            maxBounds: bounds,
        });

        map.current.on('load', (e) => {
            // Create highlight onclick
            map.current.on('click', function (e) {
                // set bbox as 5px reactangle area around clicked point
                var bbox = [
                    [e.point.x - 5, e.point.y - 5],
                    [e.point.x + 5, e.point.y + 5]
                ];
                var features = map.current.queryRenderedFeatures(bbox, {
                    layers: ["hogcount_2018", "hogcount_2019", "hogcount_2020"]
                });
                
                // Run through the selected features and set a filter
                // to match features with unique FIPS codes to activate
                // the `counties-highlighted` layer.
                var filter = features.reduce(
                        function (memo, feature) {
                            memo.push(feature.properties.Region);
                        return memo;
                    },
                    ['in', "Region"]
                );
                console.log(filter);
                map.current.setFilter('highlight', filter);
                map.current.setLayoutProperty('highlight', 'visibility', 'visible'); 
                console.log(map.current.getLayer('highlight'));   
            });
        });
    }, []);

    useEffect(() => {
        if (!map.current || !map.current.isStyleLoaded()) return; 

        let layerIDs = ["hogcount_2018", "hogcount_2019", "hogcount_2020"];

        console.log(map.current.getLayer('highlight'));
        if(props.menu == 1) {
            map.current.setLayoutProperty('municities', 'visibility', 'visible'); 
            layerIDs.forEach((id) => {
                map.current.setLayoutProperty(id, 'visibility', 'none');
            })
            map.current.setLayoutProperty('regions', 'visibility', 'none'); 
            map.current.setLayoutProperty('asf_2020', 'visibility', 'none'); 
            map.current.setLayoutProperty('highlight', 'visibility', 'none');
        }
        else {
            map.current.setLayoutProperty('regions', 'visibility', 'visible'); 
            layerIDs.forEach((id) => {
                map.current.setLayoutProperty(id, 'visibility', 'none');
            })
            map.current.setLayoutProperty('municities', 'visibility', 'none'); 
            map.current.setLayoutProperty('asf_2020', 'visibility', 'none');
        }
    }, [map.current, props.menu]);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        
        let layerIDs = ["hogcount_2018", "hogcount_2019", "hogcount_2020"];

        if (map.current.isStyleLoaded()) {
            if(props.menu == 1) {
                map.current.setLayoutProperty('municities', 'visibility', 'visible'); 
                layerIDs.forEach((id) => {
                    map.current.setLayoutProperty(id, 'visibility', 'none');
                })
                map.current.setLayoutProperty('regions', 'visibility', 'none'); 
                map.current.setLayoutProperty('asf_2020', 'visibility', 'none'); 
            }
            else {
                map.current.setLayoutProperty('regions', 'visibility', 'visible'); 
                layerIDs.forEach((id) => {
                    map.current.setLayoutProperty(id, 'visibility', 'none');
                })
                map.current.setLayoutProperty('municities', 'visibility', 'none'); 
                map.current.setLayoutProperty('asf_2020', 'visibility', 'none'); 
            }
        }

        if(toolTip != null) {
            toolTip.remove();
        }
    }, [props.menu])

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });

        console.log("🚀 ~ file: ChoroplethMap.js ~ line 156 ~ useEffect ~ props.menu", props.menu)
        if (props.menu == 1) {
            // On map click
            map.current.on('click', (e) => {
                // Retrieve layer details
                var regionData = map.current.queryRenderedFeatures(e.point, { layers: ['hog_count','asf_2020']});

                // Check queried data
                if (regionData[1]) {
                    console.log("🚀 ~ file: ChoroplethMap.js ~ line 163 ~ map.current.on ~ regionData", regionData)
                    // Update data to be used for sidebar chart
                    props.onClickRegion(regionData[0].properties);

                    // Add a tooltip
                    var description = "";
                    description += "<div><b>Region Name:</b> " + regionData[1].properties.Region + "</div>";
                    description += "<div><b>Municipality:</b> " + regionData[1].properties.Municipality + "</div>";
                    description += "<div><b>Zone Category:</b> " + regionData[1].properties['Zone Category'] + "</div>";
                    
                    var popup = new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(description)
                    .addTo(map.current);
                    
                    setToolTip(popup);
                }
            });
        }
        else {
            // On map click
            map.current.on('click', (e) => {
                // Retrieve layer details
                var regionData = map.current.queryRenderedFeatures(e.point, { layers: ['hogcount_2018', 'hogcount_2019', 'hogcount_2020' ]});
                console.log("🚀 ~ file: ChoroplethMap.js ~ line 161 ~ map.current.on ~ regionData", regionData)
    
                // Check queried data
                if (regionData[0]) {
                    // Update data to be used for sidebar chart
                    props.onClickRegion(regionData[0].properties);
                    console.log("🚀 ~ file: ChoroplethMap.js ~ line 195 ~ map.current.on ~ regionData[0].properties", regionData[0].properties)
                    var selectedYear = regionData[0].layer.id.split("_")[1];
                    // Add a tooltip
                    var description = "";
                    description += "<div><b>Region Name:</b> " + regionData[0].properties.Region + "</div>";
                    description += "<div><b>Hog production (in metric tons):</b> " + regionData[0].properties["production_"+selectedYear].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</div>";
                    
                    var popup = new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(description)
                    .addTo(map.current);
                    
                    setToolTip(popup);
                }
            });

            map.current.on('mouseenter', 'hogcount_2018', function () {
                map.current.getCanvas().style.cursor = 'pointer';
            });
            map.current.on('mouseenter', 'hogcount_2019', function () {
                map.current.getCanvas().style.cursor = 'pointer';
            });
            map.current.on('mouseenter', 'hogcount_2020', function () {
                map.current.getCanvas().style.cursor = 'pointer';
            });
                 
            // Change it back to a pointer when it leaves.
            map.current.on('mouseleave', 'hogcount_2018', function () {
                map.current.getCanvas().style.cursor = '';
            });
            map.current.on('mouseleave', 'hogcount_2019', function () {
                map.current.getCanvas().style.cursor = '';
            });
            map.current.on('mouseleave', 'hogcount_2020', function () {
                map.current.getCanvas().style.cursor = '';
            });
        }
    }, [map.current]);

    // Set visibility of layer based on chosen year for visualization
    useEffect(() => {
        let layerIDs = ["hogcount_2018", "hogcount_2019", "hogcount_2020"];

        if (props.menu == 1) {
            if(props.chartData.length > 0 && map.current.isStyleLoaded()) {
                console.log("🚀 ~ file: ChoroplethMap.js ~ line 170 ~ useEffect ~ props.chartData", props.chartData)
                map.current.setLayoutProperty(
                    'asf_2020',
                    'visibility',
                    'visible'
                );
                map.current.setFilter('asf_2020', ['match', ['get', 'Region'], props.chartData, true, false]);
            }
        }
        else {
            if (props.year != undefined && map.current.isStyleLoaded()) {
                layerIDs.forEach((id) => {
                    if ("hogcount_" + props.year == id) {
                        map.current.setLayoutProperty(id, 'visibility', 'visible'); 
                        setLegendValues(createStops(props.year));
                    } else {
                        map.current.setLayoutProperty(id, 'visibility', 'none');
                    }
                })
            } else {
                setLegendValues([]);
            }
        }
    }, [props.isUpdate]);

    

    return(
        <div>
            <div ref={mapContainer}  className={classes.mapContainer}/>
            {
                props.menu == 1 ?
                    null
                :
                    <ChoroplethLegend values={legendValues}/>
            }
        </div>
    )
}

ChoroplethMap.propTypes = {
    year: PropTypes.string
}

export default ChoroplethMap;