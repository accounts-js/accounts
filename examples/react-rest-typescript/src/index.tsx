import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import Router from './Router';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5e4b8e',
    },
    secondary: {
      main: '#5cbdbc',
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Router />
  </ThemeProvider>,
  document.getElementById('root') as HTMLElement
);
