import {
  Button,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/joy";

const DownloadButton = ({ compare, icon, text, options }) => (
  <Dropdown>
    <MenuButton
      sx={{
        justifyContent: "space-between",
      }}
      size="sm"
      endDecorator={compare ? null : icon}
    >
      {compare ? icon : <Typography level="sm">{text}</Typography>}
    </MenuButton>
    <Menu>
      {options.map((option) => (
        <MenuItem
          key={option.format}
          onClick={() => option.downloadFunction(option.data)}
        >
          <Typography>{option.format}</Typography>
        </MenuItem>
      ))}
    </Menu>
  </Dropdown>
);

export default DownloadButton;
