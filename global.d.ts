import { GridProps as MuiGridProps } from "@mui/material/Grid";

// declare module "@mui/material/Grid" {
// interface ComponentOverrides {
// 	MuiGrid: {
// 		defaultProps: MuiGridProps;
// 	};
// }
// }

declare module "@mui/material/styles" {
	interface BreakpointOverrides {
		xs: false;
		sm: false;
		md: false;
		lg: false;
		xl: false;
		mobile: true;
		tablet: true;
		laptop: true;
		desktop: true;
	}
}
