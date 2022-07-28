


import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

function Password(props) {

    const { info, handleChange,name,label } = props;
    return (
        <Grid item xs={12}>
            <TextField
                onChange={handleChange} error={info[name] === '' ? true : false}
                variant="outlined" required fullWidth name={name} label={label} type="password"
                id="password" autoComplete="current-password" value={info[name]===null ? '' :info[name]}
            />
        </Grid>
    )
}


export default Password;