import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import {
	Unstable_NumberInput as BaseNumberInput,
	NumberInputProps,
} from "@mui/base/Unstable_NumberInput";
import { css, styled } from "@mui/system";
import { forwardRef, useRef } from "react";

export const NumberInput = forwardRef(
	(props: NumberInputProps, ref: React.ForwardedRef<HTMLDivElement>) => {
		return (
			<BaseNumberInput
				{...props}
				ref={ref}
				slots={{
					root: InputBoxStyled,
					input: InputStyled,
					incrementButton: InputButtonStyled,
					decrementButton: InputButtonStyled,
				}}
				slotProps={{
					input: { className: "input" },
					incrementButton: {
						autoFocus: false,
						children: <AppIcon name="Plus" size="extra-small" />,
						"aria-label": "increment-button",
						className: "increment",
					},
					decrementButton: {
						children: <AppIcon name="Minus" size="extra-small" />,
						"aria-label": "decrement-button",
						className: "decrement",
					},
				}}
			/>
		);
	},
);

export const ScoreInput = ({ value, handleInputChange }: InputProps) => {
	const ref = useRef<HTMLInputElement>(null);

	return (
		<NumberInput
			aria-label="score-input"
			placeholder="-"
			value={value}
			ref={ref}
			onBeforeInputCapture={(e) => {
				console.log(e);
				debugger;
			}}
			onChange={(_, val) => {
				console.log(handleInputChange);

				handleInputChange(val);
			}}
			onInputChange={(e) => {
				const val = toSafeNumber(e.target.value);

				handleInputChange(val);
			}}
			min={0}
			step={1}
		/>
	);
};

// const toNullOrString = (value: string | number | null) => {
// 	if (value === null || value === "") return null;
// 	return String(value);
// };

const toSafeNumber = (str: string) => {
	if (str === null || str === "" || str === undefined) return null;

	return Number(str);
};

interface InputProps {
	value: number | null;
	handleInputChange: (val: number | null) => void;
}

export const InputBoxStyled = styled("div")(
	({ theme }) => `
    display: grid;
    grid-template-areas: 'decrement input increment';
    gap: ${theme.spacing(1)};

    & .input { grid-area: input; };
    & .increment { grid-area: increment; };
    & .decrement { grid-area: decrement; };
  `,
);

export const InputStyled = styled("input")(
	({ theme }) => `
    
  background-color: transparent;
  color: ${theme.palette.neutral[100]};
  border: 1px solid ${theme.palette.teal[500]};
  border-radius: ${theme.shape.borderRadius}px;
  padding: ${theme.spacing(1)};
  width: 32px;
  text-align: center;
	caret-color: transparent;

  ${resetInput};
  `,
);

const InputButtonStyled = styled(AppButton)(
	({ theme }) => `
  background-color: ${theme.palette.teal[500]};
  color: ${theme.palette.neutral[100]};
  border-radius: ${theme.shape.borderRadius}px;
  padding: ${theme.spacing(1)};

  &[disabled] {
    filter: grayscale(1);
  } 
`,
);

const resetInput = () => css`
	background-color: unset;
	outline: none;
	margin: 0;
`;
