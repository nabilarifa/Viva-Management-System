import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import postData1 from '../methods/postMethod';
// import Button from '@material-ui/core/Button';
const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: "2%",

  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: "14",
  },
  pos: {
    marginBottom: 12,
  },
  inp: {
    minWidth: '80%'
  }

});
/// THIS COMPONENT IS RENDERING INFINITE TIME
export default function QuestionCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  console.log('HOIIIII')
  const [text, setText] = React.useState([]);
  const teacherMode = props.teacherMode;
  useEffect(async () => {
    const reqBody = {
      id: props.id
    }
    const url = "/exam/getViva";
    const res = await postData1(url, reqBody);
    setText(res.body);

  })
  return (
    <>
    {  text.map(element => (
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textPrimary" gutterBottom>
              {element.question}
            </Typography>
            {teacherMode &&
              <Typography className={classes.title} color="textPrimary" gutterBottom>
                {element.comment}
              </Typography>
            }
          </CardContent>
          {teacherMode &&
            <CardActions>
              <TextField id="standard-basic" label="Write a comment. . ." className={classes.inp} />
              <Button color="primary" size="small">Comment</Button>
            </CardActions>
          }
        </Card>

      ))
    }
    </>
  )

}
