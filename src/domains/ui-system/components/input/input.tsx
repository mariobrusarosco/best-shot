import { Input as BaseInput, InputProps } from "@mui/base/Input";
import { css, styled } from "@mui/system";
import * as React from "react";

export const AppInput = React.forwardRef(function CustomInput(
	props: InputProps,
	ref: React.ForwardedRef<HTMLDivElement>,
) {
	return <BaseInput slots={{ input: StyledInput }} {...props} ref={ref} />;
});

const StyledInput = styled("input")(
	({ theme }) => css`
		width: 100%;
		padding: ${theme.spacing(1)};
		border: 1px solid ${theme.palette.black[400]};
		border-radius: ${theme.shape.borderRadius};
	`,
);
