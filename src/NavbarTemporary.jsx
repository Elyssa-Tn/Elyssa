import { Box, Button, IconButton, Input, Link, Modal } from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ModeToggle from "./ModeToggle";
import ModalComponent from "./ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "./reducers/interfaceReducer";

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
          Open
        </Button>
        <Modal open={modalOpen} onClose={() => dispatch(setModalOpen(false))}>
          <ModalComponent />
        </Modal>
        {/* <Link
          // style={{ color: "white" }}
          component={RouterLink}
          fontWeight="xl"
          to="/"
        >
          Elyssa
        </Link>
        <Link
          // style={{ color: "white" }}
          component={RouterLink}
          fontWeight="xl"
          to="/"
        >
          Présentation de l’équipe
        </Link>
        <Link
          // style={{ color: "white" }}
          component={RouterLink}
          fontWeight="xl"
          to="/"
        >
          Bibliographie
        </Link>
      </Box>
      <Input
        size="sm"
        variant="outlined"
        placeholder="Recherche"
        startDecorator={<SearchRoundedIcon color="primary" />}
        sx={{
          flexBasis: "500px",
          display: {
            xs: "none",
            sm: "flex",
          },
          boxShadow: "sm",
        }}
      />
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
        >
          <SearchRoundedIcon />
        </IconButton>
        <Link
          // style={{ color: "white" }}
          component={RouterLink}
          fontWeight="xl"
          to="/login"
        >
          Login
        </Link> */}
        <ModeToggle />
      </Box>
    </>
  );
};

export default Navbar;
