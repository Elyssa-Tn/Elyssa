import {
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";

function ExpandedResults({ results, level, names }) {
  const [filterValue, setFilterValue] = useState("");
  const [filteredValues, setFilteredValues] = useState(names);

  const { decoupage, variables } = results;
  const headers = variables.map((variable) => variable.code_variable);
  const rows = Object.keys(variables[0].resultat);

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    const filteredValues = names.filter((name) => {
      return name.toLowerCase().includes(filterValue.toLowerCase());
    });
    setFilterValue(filteredValues);
  };

  const nomenclature = {
    tp: "Taux de participation",
    prc: "Pourcentage de votes",
    voix: "Voix obtenus",
  };
  const placeHolderFormatter = () => {
    return decoupage.charAt(0).toUpperCase() + decoupage.slice(1);
  };

  if (results.variables.length > 0) {
    return (
      <TableContainer
        style={{
          height: 400,
          left: "44px",
          position: "relative",
          marginRight: "60px",
          border: "1px solid black",
          borderRadius: "8px",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                {/* <TextField
                  value={filterValue}
                  onChange={handleFilterChange}
                  placeholder={placeHolderFormatter()}
                /> */}
                {decoupage.charAt(0).toUpperCase() + decoupage.slice(1)}
              </TableCell>
              {headers.map((header, index) => (
                <TableCell key={index} align="center">
                  {nomenclature[header]}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row}
                style={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "" }}
              >
                <TableCell>{row === "Total" ? "Total" : names[row]}</TableCell>
                {variables.map((variable, index) => (
                  <TableCell key={index} align="center">
                    {variable.resultat[row]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default ExpandedResults;
