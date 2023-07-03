import { Autocomplete, TextField } from "@mui/material";

const SelectionMenu = ({ placeholder, data, setSelection, selector, name }) => {
  const handleValueChange = (item) => {
    setSelection(null);
    if (item) {
      setSelection(item);
    }
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box"
      options={data}
      getOptionLabel={(option) => option[name]}
      onChange={(event, newValue) => handleValueChange(newValue)}
      sx={{ width: "90%", backgroundColor: "#333", padding: 2 }}
      renderInput={(params) => <TextField {...params} label={placeholder} />}
    />
  );
};

export default SelectionMenu;
