

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
        justifyContent: 'space-around',
        display: "flex"
    },
    column: {
        justifyContent: 'space-around',
        display: 'flex',
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        width: 130,
        hieght: 60,
        color: theme.palette.text.secondary,
    },
}));


export default function SectionTop(props) {
    const classes = useStyles();
    return (
        <Grid container item className={classes.root}>
            <Grid item className={classes.column}>
                <Paper className={classes.paper}> Upcoming </Paper>
            </Grid>
            <Grid item className={classes.column}>
                <Paper className={classes.paper}> Running </Paper>
            </Grid>
            <Grid item className={classes.column}>
                <Paper className={classes.paper}> Finished </Paper>
            </Grid>
        </Grid>
    )
}