import { GUESS_STATUS } from "@/domains/guess/typing";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import {
	Unstable_NumberInput as BaseNumberInput,
	NumberInputProps,
} from "@mui/base/Unstable_NumberInput";
import { Box, styled } from "@mui/system";
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

interface Props {
	value: number | null;
	cardExpanded: boolean;
	guessStatus: GUESS_STATUS;
	handleInputChange: (val: number | null) => void;
}

const ALLOW_INPUT_WHEN_GUESS_STATUS = new Set([
	"waiting_for_game",
	"not-started",
]);

export const ScoreInput = ({
	value,
	handleInputChange,
	guessStatus,
	cardExpanded,
}: Props) => {
	const ref = useRef<HTMLInputElement>(null);

	const showInputs =
		ALLOW_INPUT_WHEN_GUESS_STATUS.has(guessStatus) && cardExpanded;

	if (!showInputs) return;

	return (
		<NumberInput
			aria-label="score-input"
			placeholder="-"
			value={value}
			ref={ref}
			readOnly
			onChange={(_, val) => {
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

const toSafeNumber = (str: string) => {
	if (str === null || str === "" || str === undefined) return null;

	return Number(str);
};

export const InputBoxStyled = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "stretch",
		gridArea: "teams",
		gap: 1,

		"& .decrement": { gridArea: "decrement", flex: 1, order: 1 },
		"& .input": { gridArea: "input", flex: 1, order: 2 },
		"& .increment": { gridArea: "increment", flex: 1, order: 3 },

		"[data-open='true'] &": {
			order: 2,
		},
	}),
);

export const InputStyled = styled("input")(({ theme }) => ({
	...resetInput(),

	color: theme.palette.neutral[100],
	padding: theme.spacing(1),
	width: "32px",
	textAlign: "center",
	caretColor: "transparent",
	backgroundColor: theme.palette.black[500],
	borderRadius: theme.spacing(1.5),
	height: "25px",
	alignSelf: "center",
}));

const InputButtonStyled = styled(AppButton)(({ theme }) => ({
	backgroundColor: theme.palette.teal[500],
	color: theme.palette.neutral[100],
	borderRadius: theme.spacing(0.5),
	padding: theme.spacing(1),
	flex: 1,
	height: "100%",

	"&[disabled]": {
		color: "red",
		filter: "grayscale(1)",
	},
}));

const resetInput = () => ({
	outline: "none",
	border: "none",
	backgroundColor: "unset",
	margin: "0",
});
