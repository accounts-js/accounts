import React from 'react';
import {
  makeStyles,
  Container,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Grid,
  TextField,
  CardActions,
  Button,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  card: {
    marginTop: theme.spacing(3),
  },
  cardHeader: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  cardContent: {
    padding: theme.spacing(3),
  },
  cardActions: {
    padding: theme.spacing(3),
  },
}));

export const Security = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Typography variant="h5">Security</Typography>
      <Card className={classes.card}>
        <CardHeader subheader="Change password" className={classes.cardHeader} />
        <Divider />
        <CardContent className={classes.cardContent}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Old password"
                variant="outlined"
                fullWidth={true}
                id="old-password"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="New password"
                variant="outlined"
                fullWidth={true}
                id="new-password"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Confirm new password"
                variant="outlined"
                fullWidth={true}
                id="confirm-new-password"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions className={classes.cardActions}>
          <Button variant="contained">Update password</Button>
        </CardActions>
      </Card>
    </Container>
  );
};
