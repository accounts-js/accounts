import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  formError: {
    color: 'red',
  },
});

interface Props {
  error: string;
}

const FormError = ({ error }: Props) => {
  const classes = useStyles();

  return <Typography className={classes.formError}>{error}</Typography>;
};

export default FormError;
