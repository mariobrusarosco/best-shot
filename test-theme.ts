import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  shape: {
    borderRadius: 8,
    small: "4px",
    medium: "8px",
    large: "12px",
  } as any,
});

console.log(theme.shape);
