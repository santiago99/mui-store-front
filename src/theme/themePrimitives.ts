//import Sidebar from '@/theme/components/sidebar/Sidebar'
import {
  createTheme,
  alpha,
  //type PaletteMode,
  type Shadows,
  type PaletteOptions,
} from "@mui/material/styles";

const defaultTheme = createTheme();

//const customShadows: Shadows = [...defaultTheme.shadows];

export const brand = {
  50: "hsl(218, 44%, 95%)",
  100: "hsl(176, 79%, 91%)",
  200: "hsl(218, 44%, 80%)",
  300: "hsl(218, 44%, 65%)",
  400: "hsl(218, 44%, 48%)",
  500: "hsl(218, 44%, 42%)",
  600: "hsl(218, 44%, 55%)",
  700: "hsl(218, 44%, 35%)",
  800: "hsl(218, 44%, 18%)",
  900: "hsl(218, 44%, 21%)",
};

export const gray = {
  50: "hsl(0, 0%, 100.00%)",
  100: "hsl(0, 0%, 94%)",
  200: "hsl(0, 0%, 88%)",
  300: "hsl(0, 0%, 80%)",
  400: "hsl(0, 0%, 65%)",
  500: "hsl(0, 0%, 42%)",
  600: "hsl(0, 0%, 35%)",
  700: "hsl(0, 0%, 25%)",
  800: "hsl(0, 0%, 6%)",
  900: "hsl(0, 0%, 3%)",
};

export const green = {
  50: "hsl(120, 80%, 98%)",
  100: "hsl(120, 75%, 94%)",
  200: "hsl(120, 75%, 87%)",
  300: "hsl(120, 61%, 77%)",
  400: "hsl(120, 44%, 53%)",
  500: "hsl(120, 59%, 30%)",
  600: "hsl(120, 70%, 25%)",
  700: "hsl(120, 75%, 16%)",
  800: "hsl(120, 84%, 10%)",
  900: "hsl(120, 87%, 6%)",
};

export const orange = {
  50: "hsl(29, 100%, 97%)",
  100: "hsl(29, 88%, 90%)",
  200: "hsl(29, 87%, 80%)",
  300: "hsl(29, 86%, 57%)",
  400: "hsl(29, 86%, 40%)",
  500: "hsl(29, 90%, 35%)",
  600: "hsl(29, 91%, 25%)",
  700: "hsl(29, 94%, 20%)",
  800: "hsl(29, 95%, 16%)",
  900: "hsl(29, 93%, 12%)",
};

export const red = {
  50: "hsl(0, 100%, 97%)",
  100: "hsl(0, 92%, 90%)",
  200: "hsl(0, 94%, 80%)",
  300: "hsl(0, 90%, 65%)",
  400: "hsl(0, 90%, 40%)",
  500: "hsl(0, 90%, 30%)",
  600: "hsl(0, 91%, 25%)",
  700: "hsl(0, 94%, 18%)",
  800: "hsl(0, 95%, 12%)",
  900: "hsl(0, 93%, 6%)",
};

export const palette: PaletteOptions = {
  // primary: {
  //   main: orange[300],
  //   light: gray[400],
  // },
  // background: {
  //   default: "hsl(0, 0%, 99%)",
  //   //paper: brand[800],
  // },
  // text: {
  //   //sidebar: 'hsl(0, 0%, 100%)',
  //   disabled: gray[500],
  // },
  // divider: gray[300],
  // action: {
  //   active: gray[800],
  // },
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[700],
        contrastText: brand[50],
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
      },
      grey: {
        ...gray,
      },
      divider: gray[400] /* alpha(gray[300], 0.4) */,
      background: {
        default: "hsl(0, 0%, 99%)",
        paper: "hsl(220, 35%, 97%)",
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: brand[50],
        light: brand[300],
        main: brand[400],
        dark: brand[700],
      },
      info: {
        contrastText: brand[300],
        light: brand[500],
        main: brand[700],
        dark: brand[900],
      },
      warning: {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
      },
      error: {
        light: red[400],
        main: red[500],
        dark: red[700],
      },
      success: {
        light: green[400],
        main: green[500],
        dark: green[700],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[700], 0.6),
      background: {
        default: gray[900],
        paper: "hsl(220, 30%, 7%)",
      },
      text: {
        primary: "hsl(0, 0%, 100%)",
        secondary: gray[400],
      },
      action: {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px",
    },
  },
};

export const typography = {
  fontFamily: "Roboto, sans-serif",
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
  },
};

export const shape = {
  borderRadius: 8,
};

export const layoutMath = {
  headerHeight: 65,
  sidebarWidth: 300,
  sidebarVisibilityThreshold: 700,
};

// @ts-expect-error missing type
const defaultShadows: Shadows = [
  "none",
  "var(--template-palette-baseShadow)",
  ...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;
