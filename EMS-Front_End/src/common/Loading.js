import { CircularProgress } from "@material-ui/core"
import { Center } from "../utils/styles"

const Loading = ({ loading }) => {
  return (
    <Center>
      <CircularProgress />
    </Center>
  )
};

export default Loading;