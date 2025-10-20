import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";

import {
  //colorSchemes,
  typography,
  //shadows,
  //shape,
  palette,
} from "./themePrimitives";

interface AppThemeProps {
  children: React.ReactNode;
  themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, themeComponents } = props;
  const theme = React.useMemo(() => {
    return createTheme({
      // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
      cssVariables: {
        colorSchemeSelector: "data-mui-color-scheme",
        cssVarPrefix: "template",
      },
      //colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
      palette: palette,
      typography,
      //shadows,
      //shape,
      components: {
        MuiButton: {
          styleOverrides: {
            root: (/* { theme } */) => ({
              variants: [
                {
                  props: {
                    color: "primary",
                    variant: "contained",
                  },
                  style: {
                    color: "#fff",
                  },
                },
              ],
            }),
          },
        },
        //   //...inputsCustomizations,
        //   //...dataDisplayCustomizations,
        //   //...feedbackCustomizations,
        //   //...navigationCustomizations,
        //   //...surfacesCustomizations,
        ...themeComponents,
      },
    });
  }, [themeComponents]);

  // if (disableCustomTheme) {
  //   return <React.Fragment>{children}</React.Fragment>
  // }

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
