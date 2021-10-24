import React from "react";
//  External Components
import InputAdornment from "@material-ui/core/InputAdornment";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField, { StandardTextFieldProps } from "@material-ui/core/TextField";
// Icon
import SearchIcon from "@material-ui/icons/Search";
// Types
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { AutocompleteRenderInputParams } from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles(
  ({ typography: { pxToRem }, palette: { background }, spacing }: Theme) => ({
    underline: {
      "&::before": {
        borderBottom: `${pxToRem(1)} solid ${background.paper}`,
      },
    },
    inputSearch: {
      paddingRight: spacing(0.5),
      position: "absolute",
      right: 0,
    },
  }),
);

export default ({
  error,
  helperText,
  inputSearch,
  label,
  placeholder,
  renderInputParams: { InputProps, ...params },
  required,
  startAdornment,
  whiteTheme,
}: RenderInputProps) => {
  const classes = useStyles();

  return (
    <TextField
      {...params}
      InputProps={{
        ...InputProps,
        ...(startAdornment && { startAdornment }),
        ...(inputSearch && {
          endAdornment: (
            <InputAdornment position="end" className={classes.inputSearch}>
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }),
        classes: {
          underline: whiteTheme ? classes.underline : "none",
        },
      }}
      InputLabelProps={{
        required,
        shrink: true,
      }}
      label={label}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
    />
  );
};

export interface RenderInputProps
  extends Pick<
    StandardTextFieldProps,
    "label" | "placeholder" | "error" | "helperText" | "required"
  > {
  renderInputParams: AutocompleteRenderInputParams;
  whiteTheme?: boolean;
  startAdornment?: AutocompleteRenderInputParams["InputProps"]["startAdornment"];
  inputSearch?: boolean;
}
