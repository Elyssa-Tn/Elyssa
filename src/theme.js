import { extendTheme } from "@mui/joy";

const theme = extendTheme({
  shadow: {
    xxl: "0 1.5rem 2rem rgba(var(--joy-shadowChannel, 21 21 21)/var(--joy-shadowOpacity, 0.08))",
  },
});

export default theme;
