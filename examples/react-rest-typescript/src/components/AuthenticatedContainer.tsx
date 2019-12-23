import React, { useState } from 'react';
import {
  makeStyles,
  Hidden,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { Container } from './Container';
import { AppBar } from './AppBar';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  logo: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    maxWidth: '100%',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
  },
}));

interface AuthenticatedContainerProps {
  children: React.ReactNode;
}

export const AuthenticatedContainer = ({ children }: AuthenticatedContainerProps) => {
  const classes = useStyles();
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <img src="/logo.png" className={classes.logo} />
      </div>
      <Divider />
      <List>
        <ListItem button onClick={() => history.push('/')}>
          <ListItemText primary="Account details" />
        </ListItem>
        <ListItem button onClick={() => history.push('/emails')}>
          <ListItemText primary="Emails" />
        </ListItem>
        <ListItem button onClick={() => history.push('/security')}>
          <ListItemText primary="Security" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <nav className={classes.drawer}>
        <AppBar onDrawerToggle={onDrawerToggle} />
      </nav>

      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={onDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>

      <Container>{children}</Container>
    </div>
  );
};
