import React, { useMemo } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  Column,
  TableInstance,
} from "react-table";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Input from "@mui/material/Input";

interface ExcelTableProps<T extends object> {
  columns: Column<T>[]; // Columns definition
  data: T[]; // Data to render
}

// Styled components using MUI's styled API
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "& th": {
    color: theme.palette.primary.contrastText,
    fontWeight: "bold",
    textAlign: "left",
    padding: theme.spacing(1),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.background.default,
  },
}));

function ExcelTable<T extends object>({ columns, data }: ExcelTableProps<T>) {
  const defaultColumn = useMemo(
    () => ({
      // Set up our default Filter UI
      Filter: TextFilter,
    }),
    []
  );

  const tableInstance: TableInstance<T> = useTable<T>(
    { columns, data, defaultColumn },
    useFilters,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <Box sx={{ margin: 2 }}>
      <StyledTableContainer>
        <Table {...getTableProps()}>
          <StyledTableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                    {column.canFilter ? column.render("Filter") : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </StyledTableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <StyledTableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>
                  ))}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
}

export default ExcelTable;

// Default TextFilter component for filtering
const TextFilter = ({
  column: { filterValue, setFilter },
}: {
  column: { filterValue: string; setFilter: (value: string | undefined) => void };
}) => {
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)} // Set undefined to remove the filter
      placeholder="Search..."
      sx={{
        marginTop: 1,
        padding: 1,
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: 1,
        width: "100%",
      }}
    />
  );
};