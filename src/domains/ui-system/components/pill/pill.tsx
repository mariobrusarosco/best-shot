import { Box, styled } from "@mui/system";

export const Pill = styled(Box)(
	({ theme }) => `
  display: flex;
  justify-content: center;
  align-items: center;
	border-radius: ${theme.spacing(2.5)};
  padding: ${theme.spacing(1, 0.5)};
`,
);
