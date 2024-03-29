import { styled, Button, useTheme } from '@mui/material';

const colors = {
  blue: '#25769f',
  red: '#d54542',
  tan: '#d3c699',
  dark: '#454042',
};

export const HiddenCard = styled(Button)``;

export const BlackCard = styled(Button)`
  background: ${colors.dark};
  background: linear-gradient(135deg, ${colors.dark}, black);
  color: white;
  &:disabled {
    color: white;
  }
`;

export const BlueCard = styled(Button)`
  ${() => {
    const { palette } = useTheme();
    return `
      background: ${colors.blue};
      background: linear-gradient(
        135deg,
        ${colors.blue},
        ${palette.secondary.dark}
      );
      color: white;
      &:disabled { color: white; }
  `;
  }}
`;

export const RedCard = styled(Button)`
  ${() => {
    const { palette } = useTheme();
    return `
      background: ${colors.red};
      background: linear-gradient(
        135deg,
        ${colors.red},
        ${palette.primary.dark}
      );
      color: white;
      &:disabled { color: white; }
  `;
  }}
`;

export const TanCard = styled(Button)`
  ${() => {
    const { palette } = useTheme();
    return `
      background: ${colors.tan};
      background: linear-gradient(
        135deg,
        ${colors.tan},
        ${palette.warning.dark}
      );
      color: black;
      &:disabled { color: black; }
  `;
  }}
`;
