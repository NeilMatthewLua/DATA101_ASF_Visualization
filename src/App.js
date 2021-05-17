import './App.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import SidebarChart from './components/SidebarChart';

const useStyle = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.lightBlue,
    height: '100vh',
    width: '100vw',
    maxWidth: '100%',
    maxHeight: '100%',
    paddingTop: '10px'
  }, 
  titleText: {
    color: theme.palette.white,
    textAlign: 'center'
  }
}));

const data = [
  {year: 2017, sales: 360000},
  {year: 2018, sales: 687300},
  {year: 2020, sales: 608100},
]

function App() {
  const theme =  useTheme(); 
  const classes = useStyle(theme);
  const [chartData, setChartData] = useState(data);

  return (
    <div className={classes.root}>
      <h1 className={classes.titleText}>
        Interactive ASF Tracker
      </h1>
      <SidebarChart regionName={"Region XII"} data={chartData}/>
    </div>
  );
}

export default App;
