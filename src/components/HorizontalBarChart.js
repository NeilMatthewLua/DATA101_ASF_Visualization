/**
 * ------------------------------------------------------------------------------------------
 * [COMPONENT]
 * @function HorizontalBarChart   -   Vertical Bar chart component shown in the chart view for hog count
 *                                  
 *
 * #HOW TO CALL:
 *      <Snapshot       data
 *                      selectedRegions />
 *
 *    @prop { Array }  data            - data to be rendered in the bart chart 
 *    @prop { Array }  selectedRegions - regions chosen to be rendered 
 * USED IN:
 * App.js
 *
 * ------------------------------------------------------------------------------------------
 */
 import React, { useState, useEffect } from 'react';
 import PropTypes from 'prop-types';
 import { useTheme, makeStyles } from '@material-ui/core/styles';
 import * as d3 from 'd3';
 import { useD3 } from '../hooks/useD3';
 
 const useStyle = makeStyles(theme => ({
     container: {
         display: 'inline-block',
         backgroundColor: theme.palette.white,
         borderRadius: '20px',
         padding: '10px',
         marginLeft: '50px'
     }
 }));
 
 function HorizontalBarChart (props) {
     const theme =  useTheme(); 
     const classes = useStyle(theme);
     // Color palette for the years
     const palette = ["#FDBE85", "#FD8D3C", "#D94701"]; 
 
     // D3 code to be rendered inside svg
     const ref = useD3(
         (svg) => { 
         const height = 800;
         const width = 550;
         const margin = { top: 20, right: 30, bottom: 30, left: 80 };
 
         const x = d3
             .scaleLinear()
             .domain([0, d3.max(props.data, (d) => Math.max(d.count2018, d.count2019, d.count2020))])
             .rangeRound([margin.left, width - margin.right]);
             
        const regions = [...new Set(props.data.map(place => {
                                    return place.region
                                }))];
        console.log(regions)                    
        const y = d3
             .scaleBand()
             .domain(regions)
             .rangeRound([margin.top, height-margin.top])
             .padding(0.1);
        
        const years = ["2018", "2019", "2020"];                        
        
        const ySubgroup = d3
            .scaleBand()                        
            .domain(years)
            .range([0, y.bandwidth()])
            .padding([0.05])
        
        const colorScale = d3
            .scaleOrdinal()
            .domain(years)
            .range(palette);
                                    
        svg
            .append("g")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format(".2s")));
        
        svg
            .append("g")
            .attr("transform", "translate(" + margin.left + " , 0)")
            .call(d3.axisLeft(y));
        
        svg
            .select(".plot-area")
            .selectAll("g")
            .data(props.data)
            .join("g")
            .attr("transform", (d) => {
                return `translate(0, ${y(d.region)})`
            })
            .selectAll("rect")
            .data((d) => {
                return years.map((key) => {
                    return { key: key, hogCount: d["count"+key] }; 
                })
            })
            .join("rect")
            .attr("x", margin.left)
            .attr("y", (d) => {
                return ySubgroup(d.key)
            })
            .attr("height", ySubgroup.bandwidth())
            .attr("width", (d) => x(d.hogCount) - margin.left)
            .attr("fill", (d) => colorScale(d.key));
        },
         [props.data.length]
       );
     
       return (
         <div className={classes.container}>
             <svg
                 ref={ref}
                 style={{
                     height: 800,
                     width: 550,
                     marginRight: "0px",
                     marginLeft: "0px",
                 }}
             >
             <g className="plot-area" />
             </svg>
         </div>
       );
 }
 
 
HorizontalBarChart.propTypes = {
    data: PropTypes.array,
    selectedRegions: PropTypes.array
 }
 
 export default HorizontalBarChart;