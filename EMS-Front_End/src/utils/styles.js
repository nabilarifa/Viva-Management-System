import { Button } from '@material-ui/core';
import styled from 'styled-components';
export const StyledButton = styled(Button)`
    margin-left: 100px;
    padding: 5px 10px;
    :hover {
        background: #5268e0;
    }
`;

export const Row = styled.div`
  display: grid;
  grid-gap: ${(props) => (props.gridGap ? props.gridGap : "20px")};
  grid-template-columns: ${(props) => props.columns || "auto"};
`;

export const Col = styled.div`
  display: grid;
  grid-gap: ${(props) => (props.gridGap ? props.gridGap : "20px")};
  grid-template-rows: ${(props) => props.rows || "none"};
`;

export const Center = styled.div`
  display: flex;
  justify-content: center;
`;

