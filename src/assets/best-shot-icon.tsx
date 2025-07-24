import { motion, type Variants } from "motion/react";

const BallVariants = {
	animated: {
		transition: { staggerChildren: 0.05, delayChildren: 0.05 },
	},
};

const PentagonsVariants: Variants = {
	initial: {
		opacity: 0,
		scale: 0.5,
		y: -15,
	},
	animated: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			repeat: Infinity,
			repeatType: "reverse",
			repeatDelay: 0.5,
		},
	},
};

interface Props {
	isAnimated?: boolean;
	fill: string;
	width?: number;
	height?: number;
}

export const BestShotIcon = ({ isAnimated = false, fill, ...rest }: Props) => {
	return (
		<motion.svg
			initial={isAnimated ? "initial" : undefined}
			animate={isAnimated ? "animated" : undefined}
			variants={BallVariants}
			fill={fill}
			{...rest}
			viewBox="0 0 152 144"
			xmlns="http://www.w3.org/2000/svg"
		>
			<motion.path
				variants={PentagonsVariants}
				d="M63.2487 20.4965C70.5646 17.8036 83.4681 18.9311 83.4681 18.9311C85.8355 24.9202 86.7056 28.0724 86.7281 33.007C71.3162 40.6683 67.8146 41.8584 64.2877 42.3258C57.7708 39.437 52.0916 36.9243 49.7286 34.1399C50.8814 28.4342 55.9328 23.1893 63.2487 20.4965Z"
				fill="inherit"
			/>
			<motion.path
				variants={PentagonsVariants}
				d="M106.223 48.6779C106.486 47.1872 117.634 44.6499 122.991 47.6303C127.403 52.235 131.006 65.9711 130.093 70.8809C129.095 73.6766 126.311 78.2995 119.492 83.5226L103.972 72.0252C103.972 72.0252 104.539 53.285 106.223 48.6779Z"
				fill="inherit"
			/>
			<motion.path
				variants={PentagonsVariants}
				d="M113.24 105.452C113.24 105.452 117.839 109.506 117.807 110.135C112.465 114.966 102.545 123.983 84.166 124.81C87.7681 121.443 91.8951 115.177 91.8951 115.177C91.8951 115.177 97.8893 114.824 113.24 105.452Z"
				fill="inherit"
			/>

			<motion.path
				variants={PentagonsVariants}
				d="M47.7837 112.195L39.8281 108.309C43.6553 112.307 46.2492 114.782 50.8702 117.156C49.7083 115.577 47.7837 112.195 47.7837 112.195Z"
				fill="inherit"
			/>
			<motion.path
				variants={PentagonsVariants}
				d="M29.8601 70.7668C29.8601 70.7668 27.3058 77.1788 26.0391 82.0488C23.749 71.3303 25.8747 54.9134 32.8251 44.1952C33.1755 46.2744 32.6636 46.9222 32.6636 46.9222C32.6636 46.9222 29.319 52.7473 29.8601 70.7668Z"
				fill="inherit"
			/>
			<motion.path
				variants={PentagonsVariants}
				d="M61.1443 67.1256C73.3763 71.9961 79.77 78.8695 81.963 80.8237C81.4055 87.6111 80.004 92.6701 75.1882 104.033C64.1564 105.782 59.272 105.243 51.2896 103.449C46.9097 96.8725 45.146 91.6136 42.9454 80.2188C49.8715 73.7914 53.8347 70.7696 61.1443 67.1256Z"
				fill="inherit"
			/>
		</motion.svg>
	);
};
