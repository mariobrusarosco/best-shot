import { Input as BaseInput, type InputProps } from "@mui/base/Input";
import { css, styled } from "@mui/system";
import * as React from "react";

export const AppInput = React.forwardRef(function CustomInput(
	props: InputProps,
	ref: React.ForwardedRef<HTMLDivElement>
) {
	return <BaseInput slots={{ input: StyledInput }} {...props} ref={ref} />;
});

const StyledInput = styled("input")(
	({ theme }) => css`
		width: 100%;
		padding: ${theme.spacing(1)};
		border: 1px solid ${theme.palette.black[400]};
		border-radius: ${theme.shape.borderRadius};
		background-color: ${theme.palette.black[800]};
		color: ${theme.palette.neutral[100]};
		
		&::placeholder {
			color: ${theme.palette.neutral[400]};
			opacity: 0.7;
		}
		
		&:hover {
			border-color: ${theme.palette.black[300]};
		}
		
		&:focus {
			outline: none;
			border-color: ${theme.palette.teal[500]};
			box-shadow: 0 0 0 2px ${theme.palette.teal[500]}20;
		}
		
		&:disabled {
			background-color: ${theme.palette.black[700]};
			color: ${theme.palette.neutral[500]};
			cursor: not-allowed;
		}
	`
);
