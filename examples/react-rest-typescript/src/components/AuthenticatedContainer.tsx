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
import { useHistory, useLocation } from 'react-router';
import { Container } from './Container';
import { AppBar } from './AppBar';
import { accountsClient } from '../accounts';
import { useAuth } from './AuthContext';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  logo: {
    paddingLeft: theme.spacing(4),
    maxWidth: '100%',
    width: 175,
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
  drawerContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
  },
  toolbar: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
  },
  list: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  listItemText: {
    '& span': {
      fontWeight: 500,
    },
  },
  listItemSelected: {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent !important',
  },
}));

interface AuthenticatedContainerProps {
  children: React.ReactNode;
}

export const AuthenticatedContainer = ({ children }: AuthenticatedContainerProps) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { fetchUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onLogout = async () => {
    await accountsClient.logout();
    await fetchUser();
    history.push('/login');
  };

  const drawer = (
    <div className={classes.drawerContainer}>
      <div>
        <div className={classes.toolbar}>
          <img src="/logo.png" alt="Logo" className={classes.logo} />
        </div>
        <Divider />
        <List className={classes.list}>
          <ListItem
            classes={{ selected: classes.listItemSelected }}
            button
            onClick={() => history.push('/')}
            selected={location.pathname === '/'}
          >
            <ListItemText className={classes.listItemText} primary="Account details" />
          </ListItem>
          <ListItem
            classes={{ selected: classes.listItemSelected }}
            button
            onClick={() => history.push('/emails')}
            selected={location.pathname === '/emails'}
          >
            <ListItemText className={classes.listItemText} primary="Emails" />
          </ListItem>
          <ListItem
            classes={{ selected: classes.listItemSelected }}
            button
            onClick={() => history.push('/security')}
            selected={location.pathname === '/security'}
          >
            <ListItemText className={classes.listItemText} primary="Security" />
          </ListItem>
        </List>
      </div>
      <List className={classes.list}>
        <ListItem button onClick={onLogout}>
          <ListItemText className={classes.listItemText} primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <nav className={classes.drawer}>
        <AppBar onDrawerToggle={onDrawerToggle} onLogout={onLogout} />
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
