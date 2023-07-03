import {
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function ExpandedResults(results) {
  console.log(results.restults.variables[0].resultat);
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Circonférence</TableCell>
            <TableCell align="right">Taux de participation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(results.restults.variables[0].resultat).map((row) => (
            <TableRow
              key={row}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row}
              </TableCell>
              <TableCell align="right">
                {results.restults.variables[0].resultat[row]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExpandedResults;
