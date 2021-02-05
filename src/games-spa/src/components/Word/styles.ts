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
          color: ${props.theme.colors.blue};
        `;
      case 2:
        return `
          background: ${props.theme.colors.red};
          color: ${props.theme.colors.red};
        `;
      case 3:
        return `
          background: ${props.theme.colors.tan};
          color: ${props.theme.colors.tan};
        `;
      case 4:
        return `
          background: ${props.theme.colors.black};
          color: ${props.theme.colors.black};
        `;
      default:
        return 'default';
    }
  }};
`;
