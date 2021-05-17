import './App.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.lightBlue,
    height: '100vh',
    width: '100vw',
    paddingTop: '10px'
  }, 
  titleText: {
    color: theme.palette.white,
    textAlign: 'center'
  }
}));

function App() {
  const theme =  useTheme(); 
  const classes = useStyle(theme); 

  return (
    <div className={classes.root}>
      <h1 className={classes.titleText}>
        Interactive ASF Tracker
      </h1>
    </div>
  );
}

export default App;
