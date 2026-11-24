"use client";

import { createTheme } from "@mui/material/styles";

// Style guide do Figma: Material Design + paleta Orange Portfólio.
export const brand = {
  principal100: "#111133",
  principal90: "#222244",
  principal80: "#444466",
  secondary60: "#FFEECC",
  secondary70: "#FFCC99",
  secondary100: "#FF5522",
  secondary110: "#CC4400",
  neutral60: "#FCFDFF",
  neutral70: "#E6E9F2",
  neutral80: "#C2C4CC",
  neutral100: "#818388",
  neutral110: "#515255",
  neutral120: "#303133",
  success100: "#229922",
  success110: "#118822",
  success120: "#2E7D32",
  error100: "#DD0000",
  info90: "#315FCE",
} as const;

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    neutral: true;
  }
}

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: brand.secondary100, dark: brand.secondary110, contrastText: "#FFFFFF" },
    secondary: { main: brand.principal80, dark: brand.principal90, contrastText: "#FFFFFF" },
    error: { main: brand.error100 },
    success: { main: brand.success110 },
    info: { main: brand.info90 },
    text: { primary: brand.neutral120, secondary: brand.neutral110 },
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: "var(--font-roboto), Roboto, system-ui, sans-serif",
    button: { fontWeight: 500, fontSize: "0.9375rem", letterSpacing: "0.46px" },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: false },
      styleOverrides: {
        root: {
          "&.Mui-focusVisible": {
            outline: `3px solid ${brand.principal90}`,
            outlineOffset: 2,
          },
        },
      },
      variants: [
        {
          // Botão cinza do protótipo (ADICIONAR PROJETO / CANCELAR).
          props: { variant: "neutral" },
          style: {
            backgroundColor: "#E0E0E0",
            color: brand.neutral110,
            "&:hover": { backgroundColor: brand.neutral80 },
          },
        },
      ],
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&.Mui-focusVisible": {
            outline: `3px solid ${brand.secondary100}`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { color: brand.neutral120, backgroundColor: "rgba(0, 0, 0, 0.08)" },
        clickable: {
          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.16)" },
          "&.Mui-focusVisible": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            outline: `2px solid ${brand.principal90}`,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 0 } },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover, &.Mui-focusVisible": { backgroundColor: brand.secondary60 },
        },
      },
    },
    MuiLink: {
      defaultProps: { underline: "hover" },
    },
  },
});

export default theme;
