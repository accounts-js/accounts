import React from 'react';
import { Container as MuiContainer } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginTop: 64,
    },
  },
}));

interface ContainerProps {
  children: any;
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
