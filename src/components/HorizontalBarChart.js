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
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { useD3 } from '../hooks/useD3';
import './d3Tip.css';
 
 const years = ["2018", "2019", "2020"];

 const useStyle = makeStyles(theme => ({
     container: {
         display: 'inline-block',
         backgroundColor: theme.palette.white,
         borderRadius: '20px',
         paddingTop: '10px',
         height: '100%',
         width: '100%'
     },
     yearFilter: {
         float: 'right',
         width: '150px',
         marginRight: "20px"
     }
 }));
 
 function HorizontalBarChart (props) {
    const theme =  useTheme(); 
    const classes = useStyle(theme);
    const [chosenYears, setChosenYears] = useState([]);
    const containerRef = useRef(null);
    // Color palette for the years
    const palette = ["#FDBE85", "#FD8D3C", "#D94701"];

    useEffect(() => {
        if (props.year != undefined && props.isVisible && props.data.length > 0)
            setChosenYears([props.year]);
    }, [props.data]);

    // D3 code to be rendered inside svg
    const ref = useD3(
         (svg) => { 
         const height = containerRef.current.offsetHeight-80;
         const width = containerRef.current.offsetWidth-50;
         const margin = { top: 20, right: 30, bottom: 50, left: 80 };
        
         // TODO: update value when hooking up data
         const regions = [...new Set(props.data.map((place) => place.region))];

         const filteredData = props.data;

         console.log(props.data);
         
         const x = d3
             .scaleLinear()
             .domain([0, d3.max(filteredData, (d) => Math.max(d.production_2018, d.production_2019, d.production_2020))])
             .rangeRound([margin.left, width - margin.right]);
                                
        const y = d3
             .scaleBand()
             .domain(regions)
             .rangeRound([margin.top, height-margin.bottom])
             .padding(0.1);                        
        
        const ySubgroup = d3
            .scaleBand()                        
            .domain(chosenYears)
            .range([0, y.bandwidth()])
            .padding([0.05])
        
        const colorScale = d3
            .scaleOrdinal()
            .domain(years)
            .range(palette);
        
        // X-axis
        svg
            .select(".x-axis")
            .attr("transform", "translate(0," + (height-margin.bottom) + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format(".2s")).tickSizeOuter(0));
        
        // Y-axis
        svg
            .select(".y-axis")
            .attr("transform", "translate(" + margin.left + " , 0)")
            .call(d3.axisLeft(y).tickSizeOuter(0));
        
        // Create a tooltip 
        var tip = d3Tip()
                    .attr('class', 'd3-tip')
                    .direction('e')
                    .offset([0, 5])
                    .html((d) => {
                        return d.hogCount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 
                    });

        svg.call(tip);

        svg
            .select(".x-axis-label")
            .selectAll("text")
            .data(["Hog Production (in metric tons)"])
            .join("text")
            .attr("x", width/2)
            .attr("y", height-margin.bottom+40)
            .text((d) => d)
            .attr("text-anchor", "middle")

        // Create legends
        svg
            .select(".legend-dot")
            .selectAll("circle")
            .data(chosenYears)
            .join("circle")
            .attr("cx", (d,i) => width / chosenYears.length / 2 * i + margin.left + 20)
            .attr("cy", margin.top - 10) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 5)
            .style("fill", (d) => colorScale(d));

        // Add one dot in the legend for each name.
        svg
            .select(".legend-name")
            .selectAll("text")
            .data(chosenYears)
            .join("text")
            .attr("x", (d,i) =>  width / chosenYears.length / 2 * i + margin.left + 30)
            .attr("y", margin.top - 8) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", (d) => colorScale(d))
            .text((d) => d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");
        
        svg
            .select(".plot-area")
            .selectAll("g")
            .data(filteredData)
            .join("g")
            .attr("transform", (d) => {
                return `translate(0, ${y(d.region)})`
            })
            .selectAll("rect")
            .data((d) => {
                return chosenYears.map((key) => {
                    return { key: key, hogCount: d["production_"+key] }; 
                })
            })
            .join("rect")
            .attr("x", margin.left)
            .attr("y", (d) => {
                return ySubgroup(d.key)
            })
            .attr("height", ySubgroup.bandwidth())
            .attr("width", (d) => x(d.hogCount) - margin.left)
            .attr("fill", (d) => colorScale(d.key))
            .on('mouseover', function(d,i) { 
                tip.show(i, this) 
            })
            .on('mouseout', tip.hide);
        },
        [props.data.length, chosenYears]
    );

    const handleChange = (event) => {
        setChosenYears(event.target.value.sort());
    };

    const MenuProps = {
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
        },
        transformOrigin: {
            vertical: "top",
            horizontal: "left"
        },
        getContentAnchorEl: null
    };
    
    return (
        <div ref={containerRef} className={classes.container}>
            <div>
                <FormControl className={classes.yearFilter}>
                    <InputLabel id="mutiple-checkbox-label">Select Year/s</InputLabel>
                    <Select
                        labelId="mutiple-checkbox-label"
                        id="mutiple-checkbox"
                        multiple
                        value={chosenYears}
                        onChange={handleChange}
                        input={<Input />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}>
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                            <Checkbox checked={chosenYears.indexOf(year) > -1} />
                            <ListItemText primary={year} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <svg
                ref={ref}
                style={{
                    height: '100%',
                    width: '100%',
                    marginRight: "0px",
                    marginLeft: "0px",
                }}
            >
            <g className="plot-area" />
            <g className="legend-name" />
            <g className="legend-dot" />
            <g className="x-axis" />
            <g className="x-axis-label" />
            <g className="y-axis" />
            </svg>
        </div>
    );
 }
 
 
HorizontalBarChart.propTypes = {
    data: PropTypes.array,
    year: PropTypes.string, 
    isUpdate: PropTypes.bool
}
 
export default HorizontalBarChart;