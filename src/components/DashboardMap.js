/**
 * ------------------------------------------------------------------------------------------
 * [COMPONENT]
 * @function DashboardMap   -   Map of the dashboard
 *                                  
 *
 * #HOW TO CALL:
 *      <DashboardMap   menu
 *                      year 
 *                      chartData
 *                      onClickRegion
 *                      isUpdate />
 *
 *    @prop { Number }     menu                - menu ID of the chosen function (i.e. containment zone, hog count)
 *    @prop { Number }     year                - chosen year to visualize for HOG COUNT CHOROPLETH
 *    @prop { Array }      chartData           - chosen regions to display for CONTAIMENT ZONE, HOG COUNT BAR CHART
 *    @prop { Function }   onClickRegion       - function handler to display which region data on the side bar chart
 *    @prop { Bool }       isUpdate            - trigger state to handle map revisualization
 * 
 * USED IN:
 * App.js
 *
 * ------------------------------------------------------------------------------------------
 */

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

function DashboardMap(props) {
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

    const muniListener = (e) => {
        // Retrieve layer details
        var regionData = map.current.queryRenderedFeatures(e.point, { layers: ['asf_2020', 'hog_count'] });

        console.log("🚀 ~ file: ChoroplethMap.js ~ line 163 ~ map.current.on ~ regionData", regionData)
        // Check queried data
        if (regionData[0]) {
            // Update data to be used for sidebar chart
            props.onClickRegion(regionData[1].properties);

            // Add a tooltip
            var description = "";
            description += "<div><b>Region Name:</b> " + regionData[0].properties.Region + "</div>";
            description += "<div><b>Municipality:</b> " + regionData[0].properties.Municipality + "</div>";
            description += "<div><b>Zone Category:</b> " + regionData[0].properties['Zone Category'] + "</div>";
            
            var popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map.current);

            setToolTip(popup);
        }
    }

    const regionListener = (e) => {
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
    }

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
        
        let layerIDs = ["hogcount_2018", "hogcount_2019", "hogcount_2020"];

        map.current.on('load', () => {
            layerIDs.forEach((id) => {
                map.current.setLayoutProperty(id, 'visibility', 'none');
            })
            map.current.setLayoutProperty('asf_2020', 'visibility', 'none'); 
            
            if(props.menu == 1) {
                map.current.setLayoutProperty('municities', 'visibility', 'visible'); 
                map.current.setLayoutProperty('regions', 'visibility', 'none'); 
                
                console.log("🚀 MENU = 1 LOADS");
                // On map click
                map.current.on('click', (e) => muniListener(e));
            }
            else {
                map.current.setLayoutProperty('municities', 'visibility', 'none'); 
                map.current.setLayoutProperty('regions', 'visibility', 'visible'); 

                console.log("🚀 MENU = 2 LOADS");
                // On map click
                map.current.on('click', (e) => regionListener(e));
            }

                // map.current.addLayer(
                //     {
                //         'id': 'regions-highlighted',
                //         'type': 'fill',
                //         'source': 'regions',
                //         'source-layer': 'original',
                //         'paint': {
                //             'fill-outline-color': '#484896',
                //             // 'fill-color': '#6e599f',
                //             'fill-opacity': 0.75
                //         },
                //         'filter': ['in', 'Region', '']
                //     }
                // ); // Place polygon under these labels.
                     
                // map.current.on('click', function (e) {
                //     // set bbox as 5px reactangle area around clicked point
                //     var bbox = [
                //         [e.point.x - 5, e.point.y - 5],
                //         [e.point.x + 5, e.point.y + 5]
                //     ];
                //     var features = map.queryRenderedFeatures(bbox, {
                //         layers: ['regions']
                //     });
                     
                //     // Run through the selected features and set a filter
                //     // to match features with unique FIPS codes to activate
                //     // the `counties-highlighted` layer.
                //     var filter = features.reduce(
                //             function (memo, feature) {
                //                 memo.push(feature.properties.Region);
                //             return memo;
                //         },
                //         ['in', 'Region']
                //     );
                     
                //     map.setFilter('regions-highlighted', filter);
                // });
        })
    }, []);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        
        let layerIDs = ["hogcount_2018", "hogcount_2019", "hogcount_2020"];

        if (map.current.isStyleLoaded()) {
            if(props.menu == 1) {
                console.log("🚀 MENU = 1");
                map.current.off(regionListener, 'click');

                map.current.setLayoutProperty('municities', 'visibility', 'visible'); 
                layerIDs.forEach((id) => {
                    map.current.setLayoutProperty(id, 'visibility', 'none');
                })
                map.current.setLayoutProperty('regions', 'visibility', 'none'); 
                map.current.setLayoutProperty('asf_2020', 'visibility', 'none'); 

                map.current.on('click', (e) => muniListener(e));
            }
            else {
                console.log("🚀 MENU = 2");
                map.current.off(muniListener, 'click');

                map.current.setLayoutProperty('regions', 'visibility', 'visible'); 
                layerIDs.forEach((id) => {
                    map.current.setLayoutProperty(id, 'visibility', 'none');
                })
                map.current.setLayoutProperty('municities', 'visibility', 'none'); 
                map.current.setLayoutProperty('asf_2020', 'visibility', 'none');

                map.current.on('click', (e) => regionListener(e));
            }
        }
        
        if(toolTip != null) {
            toolTip.remove();
        }

    }, [props.menu])

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

DashboardMap.propTypes = {
    menu: PropTypes.number,
    year: PropTypes.number,
    chartData: PropTypes.array,
    onClickRegion: PropTypes.func,
    isUpdate: PropTypes.bool
}

export default DashboardMap;