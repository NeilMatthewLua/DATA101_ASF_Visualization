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
    },
    chartTitle: {
        textAlign: 'center'
    }
}));

function SidebarChart (props) {
    const theme =  useTheme(); 
    const classes = useStyle(theme);
    // Color palette for the years
    const palette = ["#FDBE85", "#FD8D3C", "#D94701"]; 

    // D3 code to be rendered inside svg
    const ref = useD3(
        (svg) => {
        const rectangleWidth = 40; 
        const height = 380;
        const width = 550;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        const x = d3
            .scaleBand()
            .domain(props.data.map((d) => d.year))
            .rangeRound([margin.left, width - margin.right])
            .paddingInner(0.6);

        const y1 = d3
            .scaleLinear()
            .domain([0, d3.max(props.data, (d) => d.sales)])
            .rangeRound([height - margin.bottom, margin.top]);
        
        const colorScale = d3
            .scaleOrdinal()
            .domain(props.data.map((d => d.year)))
            .range(palette);

        const xAxis = (g) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
            d3
            .axisBottom(x)
            .tickValues(
                d3
                .ticks(...d3.extent(x.domain()), 3)
                .filter((v) => x(v) !== undefined)
            )
            .tickSizeOuter(0)
        );

        const y1Axis = (g) =>
        g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y1).ticks(null, "s"))
            .call((g) =>
            g
                .append("text")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(props.data.y1)
            );

        svg.select(".x-axis").call(xAxis);
        svg.select(".y-axis").call(y1Axis);

        svg
            .select(".plot-area")
            .selectAll(".bar")
            .data(props.data)
            .join("rect")
            .attr("fill", (d) => colorScale(d.year))
            .attr("class", "bar")
            .attr("x", (d) => x(d.year))
            .attr("width", x.bandwidth())
            .attr("y", (d) => y1(d.sales))
            .attr("height", (d) => y1(0) - y1(d.sales));
        },
        [props.data.length]
      );
    
      return (
        <div className={classes.container}>
            <h4 className={classes.chartTitle}>{props.regionName} Hog Production</h4>
            <svg
                ref={ref}
                style={{
                    height: 380,
                    width: 550,
                    marginRight: "0px",
                    marginLeft: "0px",
                }}
            >
            <g className="plot-area" />
            <g className="x-axis" />
            <g className="y-axis" />
            </svg>
        </div>
      );
}


SidebarChart.propTypes = {
    data: PropTypes.array,
    regionName: PropTypes.string
}

export default SidebarChart;