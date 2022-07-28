

import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';





function MyTextField(props) {
    const { vivaInfo, handleChange, name, label } = props.state;
    return (
        <Grid item xs={12} sm={6}>
            <TextField
                error={vivaInfo[name] === '' ? true : false}
                variant="outlined" name={name} onChange={handleChange} value={vivaInfo[name]===null ? '' :vivaInfo[name]}
                required fullWidth label={label} autoFocus />
        </Grid>
    )
}



function NameTitle(props) {
    const { label1, label2 } = props.myLabel;
    const { name1, name2 } = props.state;

    return (
        <Grid item xs={12}>
            <Grid container spacing={2}>
                <MyTextField state={{ ...props.state, name: name1, label: label1 }} />
                <MyTextField state={{ ...props.state, name: name2, label: label2 }} />
            </Grid>
        </Grid>
    )

}


export default NameTitle;