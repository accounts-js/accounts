import React from 'react';
import ReactDOM from 'react-dom';
import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
  adaptV4Theme,
} from '@mui/material';
import Router from './Router';
import reportWebVitals from './reportWebVitals';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const theme = createTheme(
  adaptV4Theme({
    palette: {
      primary: {
        main: '#5e4b8e',
      },
      secondary: {
        main: '#5cbdbc',
      },
    },
  })
);

ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </StyledEngineProvider>
    ,
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
