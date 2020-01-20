import React from 'react';
import {
  makeStyles,
  Hidden,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  logo: {
    paddingLeft: theme.spacing(4),
    maxWidth: '100%',
    width: 175,
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
    color: theme.palette.secondary.main,
    backgroundColor: 'transparent !important',
  },
}));

interface DrawerProps {
  open: boolean;
  onDrawerToggle: () => void;
  onLogout: () => void;
}

export const Drawer = ({ open, onDrawerToggle, onLogout }: DrawerProps) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

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
    <React.Fragment>
      <Hidden smUp implementation="css">
        <MuiDrawer
          variant="temporary"
          anchor="left"
          open={open}
          onClose={onDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </MuiDrawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <MuiDrawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </MuiDrawer>
      </Hidden>
    </React.Fragment>
  );
};
