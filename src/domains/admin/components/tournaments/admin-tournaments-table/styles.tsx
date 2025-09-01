import {
	Box,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
	"& .MuiTable-root": {
		minWidth: 800,
	},
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
	backgroundColor: theme.palette.black[700],
	"& .MuiTableCell-head": {
		backgroundColor: theme.palette.black[700],
		color: theme.palette.neutral[200],
		fontWeight: 600,
		textTransform: "uppercase",
		fontSize: "0.75rem",
		letterSpacing: "0.5px",
		borderBottom: `1px solid ${theme.palette.neutral[700]}`,
		padding: theme.spacing(1.5, 2),
	},
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
	cursor: "pointer",
	transition: "background-color 0.2s ease",
	"&:hover": {
		backgroundColor: theme.palette.black[700],
	},
	"& .MuiTableCell-root": {
		borderBottom: `1px solid ${theme.palette.neutral[800]}`,
		color: theme.palette.neutral[200],
		padding: theme.spacing(1.5, 2),
	},
}));
