import React from 'react';
import { makeStyles, Container as MuiContainer } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      marginTop: 64,
    },
  },
}));

interface ContainerProps {
  children: React.ReactElement;
  maxWidth?: 'sm' | 'md';
}

export const Container = ({ children, maxWidth }: ContainerProps) => {
  const classes = useStyles();

  return (
    <MuiContainer maxWidth={maxWidth} className={classes.container}>
      {children}
    </MuiContainer>
  );
};
