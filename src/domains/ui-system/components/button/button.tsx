import { Button as ButtonBase } from "@mui/base/Button";
import { css, styled } from "@mui/system";

const resetButton = () => css`
	background-color: unset;
	outline: none;
	border: none;
	padding: 0;
	margin: 0;
`;

export const Button = styled(ButtonBase)`
	display: flex;
	justify-content: center;
	align-items: center;
	${resetButton};
`;
