


import React  from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

function Email(props) {
    
    const {info, handleChange} = props;
    return (
        <Grid item xs={12}>
            <TextField
                onChange={handleChange} error={info.email === '' ? true : false}
                variant="outlined" required fullWidth id="email" label="Email Address" name="email" autoComplete="email"
                value={info.email===null ? '' :info.email}
            />
        </Grid>
    )
}


export default Email;