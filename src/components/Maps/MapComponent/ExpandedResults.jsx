import {
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function ExpandedResults({ results, level, names }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{level}</TableCell>
            <TableCell align="right">Taux de participation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(results.variables[0].resultat).map((row) => (
            <TableRow
              key={row}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {[row] == "Total" ? "Total" : names[row]}
              </TableCell>
              <TableCell align="right">
                {results.variables[0].resultat[row]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExpandedResults;
