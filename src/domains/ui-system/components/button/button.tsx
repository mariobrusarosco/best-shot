import { Button as ButtonBase } from "@mui/base/Button";
import { styled, css } from "@mui/system";

const resetButton = () => css`
	background-color: unset;
	outline: none;
	border: none;
	padding: 0;
	margin: 0;
`;

export const Button = styled(ButtonBase)`
	${resetButton};
`;
