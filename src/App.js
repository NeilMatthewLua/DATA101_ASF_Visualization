import './App.css';
import React, { useState, useEffect } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import SideBar from './components/SideBar';
import DashboardMap from './components/DashboardMap';
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
    padding: "0px 40px"
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
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
  const [sidebarChartData, setSidebarChartData] = useState(null);
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
    } else if (!hogCountView) {
    // Update map
      setUpdateMap(!updateMap);
    }
  }

  useEffect(() => {
    setSidebarChartData(null);
    if (menuID == 1) {
      setHogCountView(false);
    }
  }, [menuID, hogCountView]);

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
            {
              ((sidebarChartData != null) && !hogCountView) ?
                <SidebarChart 
                  data={sidebarChartData}
                />
              :
                null
            }
          </div>
        </Grid>
        <Grid item xs={7}>
          { 
            !hogCountView ?
              <DashboardMap
                menu={menuID} 
                year={yearData}
                chartData={selectedRegionsBarChart} 
                onClickRegion={setSidebarChartData}
                isUpdate={updateMap}/> 
            :  
              <HorizontalBarChart  
                data={chartData} 
                year={yearData}
                isVisible={hogCountView}
              />
          }
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
