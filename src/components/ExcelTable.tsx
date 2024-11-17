import React, { useMemo } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useResizeColumns,
  Column,
  TableInstance,
} from "react-table";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer, { TableContainerProps } from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Input from "@mui/material/Input";


interface ExcelTableProps<T extends object> {
  columns: Column<T>[]; // Columns definition
  data: T[]; // Data to render
}

function ExcelTable<T extends object>({ columns, data }: ExcelTableProps<T>) {
  const defaultColumn = useMemo(
    () => ({
      // Set up the default Filter UI
      Filter: TextFilter,
      minWidth: 50, // Default minimum column width
      width: 150, // Default column width
      maxWidth: 800, // Default maximum column width
    }),
    []
  );

  const tableInstance: TableInstance<T> = useTable<T>(
    { columns, data, defaultColumn },
    useFilters,
    useSortBy,
    useResizeColumns // Enables resizable columns
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;


  return (
    <Box
      sx={{
        margin: 2,
        height: "calc(100vh - 194px)", // Full page height
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StyledTableContainer component={Paper}>
        <Table
          {...getTableProps()}
          style={{
            tableLayout: "fixed", // Switch to auto layout for faster responsiveness
            width: "100%",
          }}
        >
          {/* Header */}
          <StyledTableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <StyledTableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{
                      width: column.width, // Respect column widths
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {column.render("Header")}
                      <span
                        {...column.getResizerProps()}
                        style={{
                          cursor: "col-resize", // Indicates resizing
                          display: "inline-block",
                          width: "4px", // Add some width for grabbing
                          height: "100%", // Full height for better usability
                          // backgroundColor: "#ccc", // Optional: distinguish the resizer
                          position: "absolute", // To separate resizer from cell content
                          right: 0, // Stick to the right edge of the column
                          top: 0,
                          zIndex: 1, // Keep above other content
                        }}
                      >
                        &nbsp;
                      </span>
                    </div>
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </StyledTableHead>
          {/* Body */}
          <TableBody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <StyledTableCell
                      {...cell.getCellProps()}
                      style={{
                        width: cell.column.width, // Sync column widths
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cell.render("Cell")}
                    </StyledTableCell>
                  ))}
                </TableRow>
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

// Styled components for table elements
const StyledTableContainer = styled(TableContainer)<TableContainerProps>(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  overflowY: "auto", // Enable vertical scrolling
  overflowX: "auto", // Enable horizontal scrolling
  height: "100%", // Ensure container height is respected
  width: "100%", // Full width for the table
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#4472C4",
  fontSize: "11px",
  lineHeight: 1.43,
  "& th": {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "left",
    padding: theme.spacing(0.5),
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    position: "sticky",
    top: 0, // Sticky only for the header
    backgroundColor: "#4472C4",
    zIndex: 3,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderTop: "1px solid #4472C4", // Black border for all cells
  borderBottom: "1px solid #4472C4", // Black border for all cells
  borderLeft: "1px solid #D4D4D4", // Black border for all cells
  borderRight: "1px solid #D4D4D4", // Black border for all cells
  padding: theme.spacing(0.5), // Reduced padding for denser cells
  fontWeight: 500,
  color: 'black',
  fontSize: "13px", // Slightly smaller font size
  whiteSpace: "nowrap", // Prevent text wrapping
  overflow: "hidden", // Hide overflowed text
  textOverflow: "ellipsis", // Add ellipsis for overflowed text
  "& td:first-of-type": {
    position: "sticky",
    left: 0,
    zIndex: 1, // Lower z-index for body cells
    backgroundColor: "#ffffff", // White background to prevent overlap
  },
}))



const resizeAllColumns = () => {
  const table = document.querySelector("table");
  if (!table) return;

  const headerCells = table.querySelectorAll<HTMLElement>("thead th");
  const bodyRows = table.querySelectorAll<HTMLTableRowElement>("tbody tr");

  headerCells.forEach((headerCell, colIndex) => {
    let maxWidth = headerCell.offsetWidth;

    bodyRows.forEach((row) => {
      const cell = row.cells[colIndex];
      if (cell) {
        maxWidth = Math.max(maxWidth, cell.offsetWidth);
      }
    });

    // Set the column width
    headerCell.style.width = `${maxWidth}px`;
    headerCell.style.minWidth = `${maxWidth}px`;
    headerCell.style.maxWidth = `${maxWidth}px`;

    bodyRows.forEach((row) => {
      const cell = row.cells[colIndex];
      if (cell) {
        cell.style.width = `${cell.offsetWidth}px`;
        cell.style.minWidth = `${maxWidth}px`;
        cell.style.maxWidth = `${maxWidth}px`;
      }
    });
  });
};