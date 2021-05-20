/**
 * ------------------------------------------------------------------------------------------
 * [COMPONENT]
 * @function SidebarChart   -   Bar chart component shown in the sidebar
 *                                  
 *
 * #HOW TO CALL:
 *      <Snapshot       data
 *                      regionName />
 *
 *    @prop { Array }  data       - data to be rendered in the bart chart 
 *    @prop { string } regionName - name of the region whose data is rendered
 * USED IN:
 * App.js
 *
 * ------------------------------------------------------------------------------------------
 */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { useD3 } from '../hooks/useD3';
import './d3Tip.css';

const useStyle = makeStyles(theme => ({
    container: {
        width: '72%',
        height: '50vh',
        display: 'inline-block',
        backgroundColor: theme.palette.white,
        borderRadius: '20px',
    },
    chartTitle: {
        textAlign: 'center',
        margin: '10px 0px 0px'
    }
}));

function SidebarChart (props) {
    const theme =  useTheme(); 
    const classes = useStyle(theme);
    const containerRef = useRef(null);
    // Color palette for the years
    const palette = ["#FDBE85", "#FD8D3C", "#D94701"]; 

    const barChart = document.getElementById("sideBarChart");
    console.log("🚀 ~ file: SidebarChart.js ~ line 47 ~ SidebarChart ~ barChart", barChart)
    var barHeight = 330;
    var barWidth = 350;

    useEffect(() => {
        console.log("🚀 ~ file: SidebarChart.js ~ line 47 ~ SidebarChart ~ barChart", barChart)
    }, [])
    if(barChart != null) {
        barHeight = barChart.offsetHeight;
        console.log("🚀 ~ file: SidebarChart.js ~ line 53 ~ SidebarChart ~ barHeight", barHeight)
        barWidth = barChart.offsetWidth;
        console.log("🚀 ~ file: SidebarChart.js ~ line 55 ~ SidebarChart ~ barWidth", barWidth)
    }

    // D3 code to be rendered inside svg
    const ref = useD3(
        (svg) => { 
        const height = containerRef.current.offsetHeight-50;
        const width = containerRef.current.offsetWidth-30;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        const x = d3
            .scaleBand()
            .domain(props.data.map((d) => d.year))
            .rangeRound([margin.left, width - margin.right])
            .paddingInner(0.6)
            .paddingOuter(0.2);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(props.data, (d) => d.hogCount)])
            .rangeRound([height - margin.bottom, margin.bottom]);
        
        const colorScale = d3
            .scaleOrdinal()
            .domain(props.data.map((d => d.year)))
            .range(palette);

        svg
            .append("g")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));
        
        svg
            .append("g")
            .attr("transform", "translate(" + margin.left + " , 0)")
            .call(d3.axisLeft(y).tickFormat(d3.format(".2s")).tickSizeOuter(0));

        // Create a tooltip 
        var tip = d3Tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html((d) => {
                        return d.hogCount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 
                    });

        svg.call(tip);

        svg
            .select(".plot-area")
            .selectAll(".bar")
            .data(props.data)
            .join("rect")
            .attr("fill", (d) => colorScale(d.year))
            .attr("class", "bar")
            .attr("x", (d) => x(d.year))
            .attr("width", x.bandwidth())
            .attr("y", (d) => y(d.hogCount))
            .attr("height", (d) => y(0) - y(d.hogCount))
            .on('mouseover', function(d,i) { 
                tip.show(i, this) 
            })
            .on('mouseout', tip.hide); 
        },
        [props.data.length]
      );
    
      return (
        <div id="sideBarChart" ref={containerRef} className={classes.container}>
            <h4 className={classes.chartTitle}>{props.regionName} Hog Production</h4>
            <svg
                ref={ref}
                style={{
                    display: 'block',
                    height: (containerRef.current) ? containerRef.current.offsetHeight-50 : 350,
                    width: (containerRef.current) ? containerRef.current.offsetWidth-30 : 300,
                    margin: '0 auto'
                }}
            >
            <g className="plot-area" />
            </svg>
        </div>
      );
}


SidebarChart.propTypes = {
    data: PropTypes.array,
    regionName: PropTypes.string
}

export default SidebarChart;