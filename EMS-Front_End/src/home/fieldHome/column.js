


import '../style.css'
import {Grid } from '@material-ui/core';
import Exam from './exam';

export default function GridColumn(props) {
    const { exams,state } = props.data;
    let details = {...props.data};
    delete details.exams;
    const component = exams.map((exam) => <Exam key={exam._id} data={{ ...details, exam: exam}}/>)
    
    return (
        <Grid item>
            {component}
        </Grid>
    )
}