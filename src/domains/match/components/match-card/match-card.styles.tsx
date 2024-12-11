import { AppButton } from "@/domains/ui-system/components/button/button";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { Stack, styled } from "@mui/system";

export const Card = styled(Surface)(
	({ theme }) => `
		display: grid;	
		border-radius: ${theme.shape.borderRadius}px;
		background-color: ${theme.palette.black[800]};
		padding: ${theme.spacing(2)};
		gap: ${theme.spacing(1)};	
		
		&[data-open=true]{
			grid-template-areas: "header" "teams";
			grid-template-columns: 1fr;
		}
			
		&[data-open=false]{
			grid-template-columns: 1fr auto;
			grid-template-areas: "header cta" "teams cta";
		}
	`,
);

export const Header = styled(Stack)(({ theme }) =>
	theme?.unstable_sx({
		flexDirection: "row",
		alignItems: "center",
		gridArea: "header",
		gap: 1,
	}),
);

export const ToggleButton = styled(AppButton)(
	({ theme }) => `
		border-radius: 50%;
		color: ${theme.palette.neutral[100]};
		background-color: ${theme.palette.teal[500]};
		width: 20px;
		height: 20px;
	`,
);

export const SaveButton = styled(AppButton)(
	({ theme }) => `
		border-radius: 50%;
		color: ${theme.palette.neutral[100]};
		background-color: ${theme.palette.teal[500]};
		width: 20px;
		height: 20px;

		&[disabled] {
    	filter: grayscale(1);
			opacity: 0.5;
  	} 
	`,
);
