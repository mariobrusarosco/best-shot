import { styled } from "@mui/material";
import { motion, Variants } from "motion/react";

export const LayerVariants: Variants = {
	hidden: {
		scaleY: 0,
		y: "0%",
	},
	animated: {
		y: "100%",
		scaleY: 1,

		transition: {
			stiffness: 200,
			damping: 10,
		},
		transitionEnd: { scaleY: 0 },
	},
};

const Layer = styled(motion.div)(({ theme }) => ({
	position: "absolute",
	top: 0,
	left: 0,
	height: "100%",
	width: "100%",
	backgroundColor: "#6a9b9621",
	borderRadius: theme.spacing(1),
	transformOrigin: "top left",
}));

export const CardAnimation = ({
	initial,
	animate,
	variants,
}: {
	initial: string;
	animate: string | boolean;
	variants: Variants;
}) => {
	return <Layer initial={initial} animate={animate} variants={variants} />;
};
