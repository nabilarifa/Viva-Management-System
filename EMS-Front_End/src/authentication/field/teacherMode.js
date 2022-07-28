


import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

function TeacherMode(props) {

    const { info , handleChange } = props;
    return (
        <Grid item xs={12}>
            <FormControlLabel
                control={<Checkbox onChange={handleChange} name="teacherMode" color="primary" />}
                label="Teacher's account." checked={info.teacherMode}
            />
        </Grid>
    )
}


export default TeacherMode;