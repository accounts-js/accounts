import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Container } from './Container';
import { AppBar } from './AppBar';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
}));

interface UnauthenticatedContainerProps {
  children: React.ReactNode;
}

export const UnauthenticatedContainer = ({ children }: UnauthenticatedContainerProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <nav>
        <AppBar />
      </nav>

      <Container maxWidth="sm">{children}</Container>
    </div>
  );
};
