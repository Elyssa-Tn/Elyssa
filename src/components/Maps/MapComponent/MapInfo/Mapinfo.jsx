import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DoDisturbAlt } from "@mui/icons-material";

export default function Mapinfo({ selectedDivision }) {
  return (
    <TableContainer component={Paper} className="map-info-table">
      <Table size="small">
        <TableBody>
          {Object.keys(selectedDivision).map((key) => (
            <TableRow key={key}>
              <TableCell component="th" scope="row">
                {key}
              </TableCell>
              <TableCell align="left">{selectedDivision[key]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <DoDisturbAlt className="close-icon" /> */}
      </Table>
    </TableContainer>
  );
}
