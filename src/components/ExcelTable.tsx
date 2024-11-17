import React, { useMemo, useRef, useState } from "react";
import {
	useTable,
	useSortBy,
	useFilters,
	useResizeColumns,
	Column,
	TableInstance,
	FilterType
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
import FilterSortPopover from "./FilterPopover";


interface ExcelTableProps<T extends Record<string, any>> {
	columns: Column<T>[]; // Columns definition
	data: T[]; // Data to render
}

function ExcelTable<T extends Record<string, any>>({ columns, data }: ExcelTableProps<T>) {

	const resizingLineRef = useRef<HTMLDivElement | null>(null); // Resizing guide
	const resizingColIndexRef = useRef<number | null>(null); // Track resizing column
	const startXRef = useRef<number>(0); // Mouse starting position

	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
	const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedColumn, setSelectedColumn] = useState<string | null>(null);


	const handleFilterClick = (event: React.MouseEvent<HTMLElement>, columnId: string) => {
		setAnchorEl(event.currentTarget);
		setSelectedColumn(columnId);
	};

	const handleFilterClose = () => {
		setAnchorEl(null);
		setSelectedColumn(null);
	};

	const applyFilter = (columnId: string, filters: Record<string, string[]>) => {
		const column = tableInstance.columns.find((col) => col.id === columnId);
		if (!filters[columnId]) return
		if (column) {
			const filterValue = filters[columnId].length > 0 ? filters[columnId] : undefined; // Apply filter or clear it
			tableInstance.setFilter(columnId, filterValue); // Use React Table's `setFilter` method
			console.log(`Filter applied on column ${columnId}:`, filters);
		}
	};

	const applySort = (columnId: string, order: "asc" | "desc") => {
		const column = tableInstance.columns.find((col) => col.id === columnId);
		if (column) {
			tableInstance.toggleSortBy(columnId, order === "desc"); // Use React Table's `toggleSortBy` method
			console.log(`Sorting applied on column ${columnId}: ${order}`);
		}
	};

	// Initialize the resizing line
	const initResizingLine = () => {

		if (resizingLineRef.current && document.body.contains(resizingLineRef.current)) {
			document.body.removeChild(resizingLineRef.current); // Remove existing line
		}

		const resizingLine = document.createElement("div");
		resizingLine.style.position = "absolute";
		resizingLine.style.top = "0";
		resizingLine.style.width = "1px";
		resizingLine.style.background = "#D4D4D4";
		resizingLine.style.zIndex = "1000";
		resizingLine.style.pointerEvents = "none";
		resizingLine.style.display = "none";
		resizingLine.style.height = "100%";
		document.body.appendChild(resizingLine);
		resizingLineRef.current = resizingLine;
	};

	const handleMouseDown = (index: number, event: React.MouseEvent) => {
		resizingColIndexRef.current = index;
		startXRef.current = event.clientX;

		const resizingLine = resizingLineRef.current!;
		resizingLine.style.left = `${event.clientX}px`;
		resizingLine.style.display = "block";

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseMove = (event: MouseEvent) => {
		const resizingLine = resizingLineRef.current!;
		resizingLine.style.left = `${event.clientX}px`; // Move the resizing guide
	};

	const rulerCleanup = () => {
		// Cleanup
		resizingLineRef.current!.style.display = "none";
		resizingColIndexRef.current = null;
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	}

	const handleMouseUp = (event: MouseEvent) => {
		console.log('Entered', resizingColIndexRef.current)
		if (resizingColIndexRef.current === null) return;

		const deltaX = event.clientX - startXRef.current;

		if (deltaX === 0) {
			rulerCleanup()
			return
		}

		// Apply the new width to the header and body cells
		const table = document.querySelector("table");
		if (!table) return;

		const headerCells = table.querySelectorAll<HTMLElement>("thead th");
		const bodyRows = table.querySelectorAll<HTMLTableRowElement>("tbody tr");

		const headerCell = headerCells[resizingColIndexRef.current];
		const newWidth = Math.max(headerCell.offsetWidth + deltaX, 50); // Minimum width of 50px

		headerCell.style.width = `${newWidth}px`;
		headerCell.style.minWidth = `${newWidth}px`;
		headerCell.style.maxWidth = `${newWidth}px`;

		bodyRows.forEach((row) => {
			const cell = row.cells[resizingColIndexRef.current!] as HTMLElement;
			if (cell) {
				cell.style.width = `${newWidth}px`;
				cell.style.minWidth = `${newWidth}px`;
				cell.style.maxWidth = `${newWidth}px`;
			}
		});
		rulerCleanup()
	};

	// Initialize resizing line on component mount
	React.useEffect(() => {
		initResizingLine();
		return () => {
			if (resizingLineRef.current) {
				document.body.removeChild(resizingLineRef.current);
			}
		};
	}, []);

	const defaultColumn: Partial<Column<T>> = useMemo(
		() => ({
	// Set up the default Filter UI
			minWidth: 50, // Default minimum column width
			width: 150, // Default column width
			maxWidth: 800, // Default maximum column width
			Filter: () => null,
			filter: "multiValueIncludes"
		}),
		[]
	);

	const tableInstance: TableInstance<T> = useTable<T>(
		{
			columns,
			data,
			defaultColumn,
			filterTypes: {
				multiValueIncludes
			},
		},
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
						{headerGroups.map((headerGroup, i) => (
							<TableRow {...headerGroup.getHeaderGroupProps()} key={i} >
								{headerGroup.headers.map((column, colIndex) => (
									<StyledTableCell
										// {...column.getHeaderProps(column.getSortByToggleProps())}
										style={{
											width: column.width, // Respect column widths
											minWidth: column.minWidth,
											maxWidth: column.maxWidth,
										}}
										key={colIndex}
									>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
											}}
											onClick={(e) => handleFilterClick(e, column.id)} // Open the popover
										>
											{column.render("Header")}
											<span
												onDoubleClick={resizeAllColumns}
												onMouseDown={(e) => handleMouseDown(colIndex, e)}
												style={{
													cursor: "col-resize",
													display: "inline-block",
													width: "4px",
													height: "100%",
													position: "absolute",
													right: 0,
													top: 0,
													zIndex: 1,
													backgroundColor: "transparent", // Default state
													transition: "background-color 0.2s ease",
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
						{rows.map((row, i) => {
							prepareRow(row);
							return (
								<TableRow {...row.getRowProps()} key={i} >
									{row.cells.map((cell, i) => (
										<StyledTableCell
											{...cell.getCellProps()}
											key={i}
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
			{selectedColumn && (
				<FilterSortPopover
					columnId={selectedColumn}
					data={data}
					anchorEl={anchorEl}
					onClose={handleFilterClose}
					onFilter={(filters) => applyFilter(selectedColumn, filters)}
					onSort={(order) => applySort(selectedColumn, order)}
					sortOrder={sortOrder}
					setSortOrder={setSortOrder}
					selectedFilters={selectedFilters}
					setSelectedFilters={setSelectedFilters}
				/>
			)}
		</Box>
	);
}

export default ExcelTable;

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
	userSelect: 'none',
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
		zIndex: 2,
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

	const newWidths: number[] = [];

	// Calculate new widths
	headerCells.forEach((headerCell, colIndex) => {
		let maxWidth = headerCell.offsetWidth;

		bodyRows.forEach((row) => {
			const cell = row.cells[colIndex];
			if (cell) {
				maxWidth = Math.max(maxWidth, cell.offsetWidth);
			}
		});

		newWidths[colIndex] = maxWidth;
	});

	// Apply new widths
	headerCells.forEach((headerCell, colIndex) => {
		const newWidth = `${newWidths[colIndex]}px`;
		headerCell.style.width = newWidth;
		headerCell.style.minWidth = newWidth;
		headerCell.style.maxWidth = newWidth;

		bodyRows.forEach((row) => {
			const cell = row.cells[colIndex];
			if (cell) {
				cell.style.width = newWidth;
				cell.style.minWidth = newWidth;
				cell.style.maxWidth = newWidth;
			}
		});
	});
};

// Custom filter function for multi-value includes
export const multiValueIncludes: FilterType<any> = <T extends Record<string, any>>(
	rows: T[],
	columnIds: string[],
	filterValue: T[]
) => {
	if (!filterValue || filterValue.length === 0) {
		return rows; // No filter applied, return all rows
	}

	return rows.filter((row) =>
		filterValue.some((value) => row.values[columnIds[0]] === value)
	);
};