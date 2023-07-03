import { Table, TableCell, TableContainer, TableRow } from "@mui/material";

function ExpandedResults(results) {
  console.log(results);
  return (
    <TableContainer>
      <Table>
        <TableRow>
          <TableCell>Circonférence</TableCell>
          <TableCell align="right">Taux de participation</TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
}

export default ExpandedResults;
