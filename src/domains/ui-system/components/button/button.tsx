import { css } from "@emotion/react";
import { Button as ButtonBase } from "@mui/base/Button";
import { styled } from "@mui/material/styles";

const resetButton = () => css`
	background-color: unset;
	outline: none;
	border: none;
	padding: 0;
	margin: 0;
`;

export const AppButton = styled(ButtonBase)`
	display: flex;
	justify-content: center;
	align-items: center;
	${resetButton};
`;
