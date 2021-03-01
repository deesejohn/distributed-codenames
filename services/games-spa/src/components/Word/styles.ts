import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

type Card = {
  cardColor: number;
};

export const GameCardContainer = styled.div`
  display: block;
  width: 100%;
  height: 100%;
`;

export const GameCard = styled(Button)``;

export const RevealedGameCard = styled(Box)<Card>`
  ${(props) => {
    switch (props.cardColor) {
      case 1:
        return `
          background: ${props.theme.colors.blue};
          color: black
        `;
      case 2:
        return `
          background: ${props.theme.colors.red};
          color: black
        `;
      case 3:
        return `
          background: ${props.theme.colors.tan};
          color: black
        `;
      case 4:
        return `
          background: ${props.theme.colors.black};
        `;
      default:
        return 'default';
    }
  }};
`;
