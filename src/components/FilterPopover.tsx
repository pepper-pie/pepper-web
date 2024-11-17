import Popover from "@mui/material/Popover";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Box, Divider, Typography, InputBase } from "@mui/material";
import React, { useState, useMemo } from "react";

export interface FilterSortPopoverProps<T extends Record<string, any>> {
    columnId: string; // The ID of the column
    data: T[]; // The table data
    anchorEl: HTMLElement | null; // The anchor element for the popover
    onClose: () => void; // Callback to close the popover
    onFilter: (filters: T[]) => void; // Callback to apply filters
    onSort: (order: "asc" | "desc") => void; // Callback to apply sorting
}

const FilterSortPopover = <T extends Record<string, any>>({
    columnId,
    data,
    anchorEl,
    onClose,
    onFilter,
    onSort,
}: FilterSortPopoverProps<T>) => {
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<T[]>([]);
    const [searchText, setSearchText] = useState<string>("");

    // Extract unique values for the column
    const uniqueValues = useMemo(() => {
        const filteredValues = Array.from(new Set(data.map((row) => row[columnId] ?? "")));
        return searchText
            ? filteredValues.filter((value) =>
                value.toLowerCase().includes(searchText.toLowerCase())
            )
            : filteredValues;
    }, [data, columnId, searchText]);

    const applyFilter = () => {
        onFilter(selectedFilters);
        onClose();
    };

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    width: "300px",
                    padding: "8px",
                },
            }}
        >
            <Box>
                {/* Sorting Section */}
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px", mb: 2 }}>
                    <Button
                        variant={sortOrder === "asc" ? "contained" : "outlined"}
                        onClick={() => {
                            setSortOrder("asc");
                            onSort("asc");
                        }}
                        sx={{
                            textTransform: "none",
                            flex: 1,
                            fontSize: "0.85rem",
                            border: "1px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        ⬆ Ascending
                    </Button>
                    <Button
                        variant={sortOrder === "desc" ? "contained" : "outlined"}
                        onClick={() => {
                            setSortOrder("desc");
                            onSort("desc");
                        }}
                        sx={{
                            textTransform: "none",
                            flex: 1,
                            fontSize: "0.85rem",
                            border: "1px solid rgba(0,0,0,0.1)",
                        }}
                    >
                        ⬇ Descending
                    </Button>
                </Box>

                <Divider />

                {/* Search Box */}
                <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="caption" sx={{ mb: 1, color: "#555" }}>
                        Filter:
                    </Typography>
                    <InputBase
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{
                            border: "1px solid rgba(0,0,0,0.1)",
                            borderRadius: "4px",
                            px: 1,
                            py: 0.5,
                            fontSize: "0.85rem",
                            width: "100%",
                        }}
                    />
                </Box>

                {/* Select All Checkbox */}
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={selectedFilters.length === uniqueValues.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedFilters(uniqueValues);
                                } else {
                                    setSelectedFilters([]);
                                }
                            }}
                        />
                    }
                    label="Select All"
                    sx={{
                        fontSize: "0.85rem",
                        "& .MuiTypography-root": {
                            fontSize: "0.85rem",
                        },
                    }}
                />

                {/* Filtering Options */}
                <Box sx={{ maxHeight: "150px", overflowY: "auto", mt: 1, mb: 2 }}>
                    {uniqueValues.map((value) => (
                        <FormControlLabel
                            key={value}
                            control={
                                <Checkbox
                                    size="small"
                                    checked={selectedFilters.includes(value)}
                                    onChange={(e) => {
                                        const newFilters = e.target.checked
                                            ? [...selectedFilters, value]
                                            : selectedFilters.filter((v) => v !== value);
                                        setSelectedFilters(newFilters);
                                    }}
                                />
                            }
                            label={value || "(Empty)"}
                            sx={{
                                fontSize: "0.85rem",
                                "& .MuiTypography-root": {
                                    fontSize: "0.85rem",
                                },
                            }}
                        />
                    ))}
                </Box>

                <Divider />

                {/* Apply Button */}
                <Box sx={{ mt: 1 }}>
                    <Button
                        onClick={applyFilter}
                        variant="contained"
                        fullWidth
                        sx={{ textTransform: "none", fontSize: "0.85rem" }}
                    >
                        Apply
                    </Button>
                </Box>
            </Box>
        </Popover>
    );
};

export default FilterSortPopover;