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
        console.log("🚀 ~ file: DashboardMap.js ~ line 86 ~ muniListener ~ regionData", regionData)

        // Check queried data
        if (regionData[0] && regionData[1]) {
            // Update data to be used for sidebar chart
            props.onClickRegion(regionData[regionData.length-1].properties);

            // Add a tooltip
            var description = "";
            description += "<div><b>Region Name:</b> " + regionData[0].properties.Region + "</div>";
            description += "<div><b>Municipality:</b> " + regionData[0].properties.Municipality + "</div>";
            description += "<div><b>Zone Category:</b> " + regionData[0].properties['Zone Category'] + "</div>";
            
            var toolTips = document.getElementsByClassName('toolTip');
            for (let i = 0; i < toolTips.length; i++) {
                toolTips[i].remove();
            }
            new mapboxgl.Popup({
                className: 'toolTip',
                closeOnMove: true
            })
            .setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map.current);
        }
    }

    const regionListener = (e) => {
        // Retrieve layer details
        var regionData = map.current.queryRenderedFeatures(e.point, { layers: ['hogcount_2018', 'hogcount_2019', 'hogcount_2020' ]});

        // Check queried data
        if (regionData[0]) {
            // Update data to be used for sidebar chart
            props.onClickRegion(regionData[0].properties);
            var selectedYear = regionData[0].layer.id.split("_")[1];

            // Add a tooltip
            var description = "";
            description += "<div><b>Region Name:</b> " + regionData[0].properties.Region + "</div>";
            description += "<div><b>Hog production (in metric tons):</b> " + regionData[0].properties["production_"+selectedYear].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</div>";
            
            var toolTips = document.getElementsByClassName('toolTip');
            for (let i = 0; i < toolTips.length; i++) {
                toolTips[i].remove();
            }
            new mapboxgl.Popup({
                className: 'toolTip',
                closeOnMove: true
            })
            .setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map.current);
        }
    }

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

            if (props.menu == 1) {
                map.current.setLayoutProperty('regions', 'visibility', 'none'); 
                map.current.setLayoutProperty('municities', 'visibility', 'visible'); 
            }
            else if (props.menu == 2) {
                map.current.setLayoutProperty('regions', 'visibility', 'visible'); 
                map.current.setLayoutProperty('municities', 'visibility', 'none'); 
            }

            // Create highlight onclick
            map.current.on('click', (e) => {
                // set bbox as 5px reactangle area around clicked point
                var bbox = [
                    [e.point.x - 5, e.point.y - 5],
                    [e.point.x + 5, e.point.y + 5]
                ];

                var muniFeatures = map.current.queryRenderedFeatures(bbox, {
                    layers: ["asf_2020"]
                });
                
                var regionFeatures = map.current.queryRenderedFeatures(bbox, {
                    layers: ["hogcount_2018", "hogcount_2019", "hogcount_2020"]
                });
                    
                var regionFilter = regionFeatures.reduce(
                        function (memo, feature) {
                            memo.push(feature.properties.Region);
                        return memo;
                    },
                    ['in', "Region"]
                );

                var muniFilter = muniFeatures.reduce(
                        function (munimemo, munifeature) {
                            munimemo.push(munifeature.properties.Municipality);
                        return munimemo;
                    },
                    ['in', "Municipality"]
                );
                
                map.current.setFilter('highlight', regionFilter);
                map.current.setLayoutProperty('highlight', 'visibility', 'visible'); 
                
                map.current.setFilter('highlightmuni', muniFilter);
                map.current.setLayoutProperty('highlightmuni', 'visibility', 'visible'); 
                // }
                
                // Set pointers 
                map.current.on('mouseenter', 'hogcount_2018', function () {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseenter', 'hogcount_2019', function () {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseenter', 'hogcount_2020', function () {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseenter', 'asf_2020', function () {
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
                map.current.on('mouseleave', 'asf_2020', function () {
                    map.current.getCanvas().style.cursor = '';
                });
            })
        });

    }, []);

    useEffect(() => {
        if (!map.current || !map.current.isStyleLoaded()) return; 
        
        var toolTips = document.getElementsByClassName('toolTip');
        if(toolTips.length > 0) {
            for (let i = 0; i < toolTips.length; i++) {
                toolTips[i].remove();
            }
        }
        
        setLegendValues([]);
        
        map.current.off(regionListener, 'click');
        map.current.off(muniListener, 'click');

        let layerIDs = ["hogcount_2018", "hogcount_2019", "hogcount_2020"];

        console.log(map.current.getLayer('highlight'));

        layerIDs.forEach((id) => {
            map.current.setLayoutProperty(id, 'visibility', 'none');
        })
        map.current.setLayoutProperty('asf_2020', 'visibility', 'none');
        if(props.menu == 1) {
            map.current.setLayoutProperty('municities', 'visibility', 'visible'); 
            map.current.setLayoutProperty('regions', 'visibility', 'none'); 
            map.current.setLayoutProperty('highlight', 'visibility', 'none');
        }
        else {
            map.current.setLayoutProperty('highlightmuni', 'visibility', 'none');
            map.current.setLayoutProperty('regions', 'visibility', 'visible'); 
            map.current.setLayoutProperty('municities', 'visibility', 'none'); 
        }

        map.current.off(regionListener, 'click');
        map.current.off(muniListener, 'click');

    }, [props.menu]);


    // Set visibility of layer based on chosen year for visualization
    useEffect(() => {
        let layerIDs = ["hogcount_2018", "hogcount_2019", "hogcount_2020"];
        
        if (!map.current || !map.current.isStyleLoaded()) return; // wait for map to initialize
        
        if (props.menu == 1) {
            if(props.chartData.length > 0 && map.current.isStyleLoaded()) {
                map.current.off(regionListener, 'click');
                map.current.off(muniListener, 'click');
                map.current.setLayoutProperty(
                    'asf_2020',
                    'visibility',
                    'visible'
                );
                map.current.setFilter('asf_2020', ['match', ['get', 'Region'], props.chartData, true, false]);
                map.current.on('click', (e) => muniListener(e));
            }
        }
        else {
            if (props.year != undefined && map.current.isStyleLoaded()) {
                map.current.off(regionListener, 'click');
                map.current.off(muniListener, 'click');
                layerIDs.forEach((id) => {
                    if ("hogcount_" + props.year == id) {
                        map.current.setLayoutProperty(id, 'visibility', 'visible'); 
                        setLegendValues(createStops(props.year));
                    } else {
                        map.current.setLayoutProperty(id, 'visibility', 'none');
                    }
                })
                map.current.on('click', (e) => regionListener(e));
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