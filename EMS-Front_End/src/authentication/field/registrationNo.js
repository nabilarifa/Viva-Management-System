


import Grid from '@material-ui/core/Grid';
import {TextField}from '@material-ui/core';


export default function RegistrationNo(props) {
    const {info, handleChange} = props;
    return (
        <Grid item xs={12}>
            <TextField
                onChange={handleChange} error={info.email === '' ? true : false}
                variant="outlined" required fullWidth id="registrationNo" label="Registration No." name="registrationNo" autoComplete="registrationNo"
                value={info.RegistrationNo===null ? '' :info.RegistrationNo}
            />
        </Grid>
    )
}
