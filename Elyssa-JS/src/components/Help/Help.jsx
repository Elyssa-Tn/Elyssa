import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { CircularProgress, IconButton, Modal, Typography } from "@mui/joy";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import { useEffect, useState } from "react";
import { getHelp } from "../../services/electionServices";

const Help = ({ id_1, id_2, id_3 }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [helpContent, setHelpContent] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (open) {
      const fetchHelpContent = async () => {
        setLoading(true);
        const request = {
          type: "help",
          id_1: id_1 ? id_1 : "",
          id_2: id_2 ? id_2 : "",
          id_3: id_3 ? id_3 : "",
        };
        const data = await getHelp(request);
        if (data.length === 0 || !data) {
          setHelpContent("Pas d'aide disponible pour cette catégorie");
        } else setHelpContent(data);

        setLoading(false);
      };
      fetchHelpContent();
    }
  }, [open, id_1]);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <HelpOutlineIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="help-modal-title"
        aria-describedby="help-modal-description"
      >
        <ModalDialog>
          <DialogTitle>Aide</DialogTitle>
          <DialogContent>
            {loading ? (
              <CircularProgress />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: helpContent }} />
            )}
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default Help;
