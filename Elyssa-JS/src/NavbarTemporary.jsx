import {
  Box,
  Button,
  IconButton,
  Input,
  Link,
  Modal,
  Typography,
} from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ModeToggle from "./ModeToggle";
import ModalComponent from "./ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "./reducers/interfaceReducer";
import dbAccess from "./services/db";
import Help from "./components/Help/Help";

const Navbar = () => {
  const dispatch = useDispatch();
  const modalOpen = useSelector((state) => state.interface.modalOpen);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 1.5,
        }}
      >
        <Button
          variant="outlined"
          color="neutral"
          onClick={() => dispatch(setModalOpen(true))}
        >
          Nouvelle Carte
        </Button>
        <Modal open={modalOpen} onClose={() => dispatch(setModalOpen(false))}>
          <ModalComponent />
        </Modal>
        <Typography level="h2">Elyssa Project</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Help id_1="demarche_carte_principale" id_2="etape_0" />
          <ModeToggle />
        </Box>
      </Box>
    </>
  );
};

export default Navbar;
