import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

interface CardProps {
    value?: number | string;
    label: string;
}

const CardContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.palette.background.paper,
    width: "200px",
}));

const ValueText = styled(Typography)(({ theme }) => ({
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: theme.palette.primary.main,
}));

const LabelText = styled(Typography)(({ theme }) => ({
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
}));

const InfoCard: React.FC<CardProps> = ({ value, label }) => {
    return (
        <CardContainer>
            <ValueText>{value || "0"}</ValueText>
            <Typography variant="subtitle1" >{label}</Typography>
        </CardContainer>
    );
};

export default InfoCard;