import { useGuessInputs } from "@/domains/guess/hooks/use-guess-inputs";
import { Button } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import {
	Unstable_NumberInput as BaseNumberInput,
	NumberInputProps,
} from "@mui/base/Unstable_NumberInput";
import { css, styled } from "@mui/system";
import { forwardRef } from "react";

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
	return (
		<NumberInput
			aria-label="score-input"
			placeholder="-"
			value={toNullOrNumber(value)}
			onChange={(_, val) => handleInputChange(toNullOrString(val))}
			onInputChange={(e) => {
				const val = e.target.value as string | null;
				handleInputChange(toNullOrString(val));
			}}
			min={0}
			step={1}
		/>
	);
};

const toNullOrString = (value: string | number | null) => {
	if (value === null || value === "") return null;
	return String(value);
};

const toNullOrNumber = (value: string | null) => {
	if (value === null || value === "") return null;
	return Number(value);
};

interface InputProps {
	value: string | null;
	handleInputChange: ReturnType<typeof useGuessInputs>[
		| "handleAwayGuess"
		| "handleHomeGuess"];
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

  ${resetInput};
  `,
);

const InputButtonStyled = styled(Button)(
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
