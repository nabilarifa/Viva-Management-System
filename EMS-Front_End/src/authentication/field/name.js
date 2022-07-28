

import React  from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

function Name(props) {
    const {info, handleChange} = props;
    return (
        <Grid item xs={12}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        error={info.firstName === '' ? true : false}
                        value={info.firstName===null ? '' :info.firstName}
                        onChange={handleChange} autoComplete="fname" name="firstName" variant="outlined"
                        required fullWidth id="firstName" label="First Name" autoFocus />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        error={info.lastName === '' ? true : false}
                        value={info.lastName===null ? '' :info.lastName}
                        variant="outlined" required fullWidth id="lastName" label="Last Name" name="lastName"
                        autoComplete="lname" onChange={handleChange} />
                </Grid>
            </Grid>
        </Grid>
    )

}


export default Name;