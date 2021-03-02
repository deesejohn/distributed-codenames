import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { darken } from '@material-ui/core/styles';

const colors = {
  blue: '#25769f',
  red: '#d54542',
  tan: '#d3c699',
  dark: '#454042',
};

export const GameCardContainer = styled.div`
  display: block;
  width: 100%;
  height: 100%;
`;

export const GameCard = styled(Button)``;

export const RevealedGameCard = styled(Box)<{ cardColor: number }>`
${({ cardColor, theme }) => {
  switch (cardColor) {
    case 1:
      return `
        background: ${colors.blue};
        background: linear-gradient(
          135deg,
          ${colors.blue},
          ${theme.palette.secondary.dark}
        );
      `;
    case 2:
      return `
        background: ${colors.red};
        background: linear-gradient(
          135deg,
          ${colors.red},
          ${theme.palette.primary.dark}
        );
      `;
    case 3:
      return `
        background: ${colors.tan};
        background: linear-gradient(
          135deg,
          ${colors.tan},
          ${theme.palette.warning.dark}
        );
        color: black;
      `;
    case 4:
      return `
        background: ${colors.dark};
        background: linear-gradient(
          135deg,
          ${colors.dark},
          black
        );
      `;
    default:
      return '';
  }
}};
`;