import './App.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import SideBar from './components/SideBar'
import Map from './components/Map'
import MuniMap from './components/MuniMap'
import SidebarChart from './components/SidebarChart';
import HorizontalBarChart from './components/HorizontalBarChart';
import { Grid } from '@material-ui/core';
import axios from 'axios'; 

const useStyle = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.lightBlue,
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    padding: '20px'
  }, 
  titleText: {
    color: theme.palette.white,
    marginTop: '0px',
    textAlign: 'center'
  },
  content: {
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    padding: "0px 40px"
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
    // justifyContent: 'space-between'
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
  },
}));

const data = [
  {year: 2017,  hogCount: 360000},
  {year: 2018,  hogCount: 687300},
  {year: 2020,  hogCount: 600300},
];

const data2 = [
  {name:"Region 1", count2018: 360000,  count2019: 687300, count2020: 600300},
  {name:"Region 2", count2018: 460000,  count2019: 687300, count2020: 600300},
  {name:"Region 3", count2018: 560000,  count2019: 687300, count2020: 600300},
  {name:"Region 4", count2018: 260000,  count2019: 687300, count2020: 600300},
  {name:"Region 5", count2018: 160000,  count2019: 687300, count2020: 600300},
  {name:"Region 6", count2018: 460000,  count2019: 687300, count2020: 600300},
  // {region:"Region VII", count2018: 560000,  count2019: 687300, count2020: 600300},
  // {region:"Region VIII", count2018: 260000,  count2019: 687300, count2020: 600300},
  // {region:"Region IX", count2018: 360000,  count2019: 687300, count2020: 600300},
  // {region:"Region X", count2018: 360000,  count2019: 687300, count2020: 600300},
  // {region:"Region XI", count2018: 370000,  count2019: 687300, count2020: 600300},
  // {region:"Region XII", count2018: 380000,  count2019: 687300, count2020: 600300},
  // {region:"Region XIII", count2018: 860000,  count2019: 687300, count2020: 600300},
  // {region:"Region XIV", count2018: 960000,  count2019: 687300, count2020: 600300},
  // {region:"Region XV", count2018: 260000,  count2019: 687300, count2020: 600300},
  // {region:"Region XVI", count2018: 460000,  count2019: 687300, count2020: 600300},
  {name:"ARMM", count2018: 560000,  count2019: 687300, count2020: 600300},
]

function App() {
  const theme =  useTheme(); 
  const classes = useStyle(theme);
  const [sidebarChartData, setSidebarChartData] = useState(data);
  const [selectedRegionsBarChart, setSelectedRegionsBarChart] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [menuID, setMenuID] = useState(1);
  const [yearData, setSelectYear] = useState();
  const [hogCountView, setHogCountView] = useState();

  const handleBarChartVisualize = async () => {
    await axios.post("/api/hogcount", {
      regions: selectedRegionsBarChart
    })
    .then((res) => {
      setChartData(res.data);
    });
  }

  return (
    <div className={classes.root}>
      <h1 className={classes.titleText}>
        Interactive ASF Tracker
      </h1>
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <div className={classes.sidebar}>
            <SideBar 
              onRegionChange={setSelectedRegionsBarChart}
              onYearChange={setSelectYear}
              onHogViewChange={setHogCountView} 
              onMenuChange={setMenuID}
              onVisualize={handleBarChartVisualize}
            />
            <SidebarChart 
              regionName={"Region XII"} 
              data={sidebarChartData}
            />
          </div>
        </Grid>
        <Grid item xs={7}>
          { 
            menuID == 1 ?
              <MuniMap />  
            :
              !hogCountView ?
                <Map/> 
              :  
                <HorizontalBarChart  
                  data={chartData} 
                  year={yearData}
                />
          }
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
