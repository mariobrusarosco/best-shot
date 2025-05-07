import { styled, Typography } from "@mui/material";
import { AnimationSequence, motion, useAnimate } from "motion/react";
import { useEffect } from "react";

const Layer = styled(motion.div)(({ theme }) => ({
	position: "absolute",
	top: 0,
	left: 0,
	height: "100%",
	width: "100%",
	backgroundColor: theme.palette.teal[500],
	borderRadius: theme.spacing(1),
	transformOrigin: "center center",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	gap: theme.spacing(1),
}));

export const CardAnimation = ({
	lastSavedGuess,
}: {
	lastSavedGuess: boolean;
}) => {
	const [scope, animate] = useAnimate();

	useEffect(() => {
		if (lastSavedGuess) {
			const sequence = [
				[
					scope.current,
					{ scaleX: 1, x: "0%" },
					{ type: "spring", duration: 1 },
				],
				[
					scope.current,
					{ scaleX: 0, x: "-200%" },
					{ type: "spring", damping: 10 },
				],
				[scope.current, { x: "100%" }],
			] as AnimationSequence;

			animate(sequence);
		}
	}, [lastSavedGuess]);

	return (
		<Layer
			ref={scope}
			initial={{
				x: "100%",
				scaleX: 0,
			}}
		>
			<Typography variant="topic" textTransform="lowercase">
				Good Luck!
			</Typography>
		</Layer>
	);
};
