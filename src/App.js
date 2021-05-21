import './App.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import SideBar from './components/SideBar';
import Map from './components/Map';
import MuniMap from './components/MuniMap';
import ChoroplethMap from './components/ChoroplethMap';
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

function App() {
  const theme =  useTheme(); 
  const classes = useStyle(theme);
  const [sidebarChartData, setSidebarChartData] = useState(data);
  const [selectedRegionsBarChart, setSelectedRegionsBarChart] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [menuID, setMenuID] = useState(1);
  const [yearData, setSelectYear] = useState();
  const [hogCountView, setHogCountView] = useState(false);
  const [updateMap, setUpdateMap] = useState(false);

  const handleBarChartVisualize = async () => {
    // Bar chart viz
    if (menuID == 2 && hogCountView) {
      await axios.post("/api/hogcount", {
        regions: selectedRegionsBarChart
      })
      .then((res) => {
        console.log(res);
        setChartData(res.data);
      });
    } else if (menuID == 2 && !hogCountView) {
    // Choropleth viz
      setUpdateMap(!updateMap);
    }
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
                <ChoroplethMap 
                  year={yearData} 
                  onClickRegion={setSidebarChartData}
                  isUpdate={updateMap}/> 
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
