import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

export const AppCounter = ({ initialValue }: { initialValue: number }) => {
	const count = useMotionValue(0);
	const rounded = useTransform(count, Math.round);

	useEffect(() => {
		const controls = animate(count, initialValue, { duration: 1 });
		return () => controls.stop();
	}, []);

	return <motion.span>{rounded}</motion.span>;
};
