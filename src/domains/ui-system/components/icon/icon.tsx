import type { IconProps } from "@tabler/icons-react";
import { forwardRef } from "react";
import { Box } from "@mui/material";
import { ICONS } from "./mapper";

type sizes = "tiny" | "extra-small" | "small" | "medium" | "large";

interface Props extends Omit<IconProps, "color" | "stroke" | "fill"> {
	name: keyof typeof ICONS;
	size?: sizes;
	color?: string;
	fill?: string;
	stroke?: string | number;
}

const sizeMapping = {
	tiny: 12,
	"extra-small": 16,
	small: 24,
	medium: 32,
	large: 48,
};

const AppIcon = forwardRef<SVGSVGElement, Props>((props, ref) => {
	const { name, size = "small", color, fill, stroke, ...rest } = props;

	const IconComponent = ICONS[name];
	const measures = sizeMapping[size];

	return (
		<Box
			component="span"
			sx={{
				display: "contents",
				color: color,
				fill: fill,
				stroke: stroke as any,
			}}
		>
			<IconComponent ref={ref} width={measures} height={measures} {...rest} />
		</Box>
	);
});

AppIcon.displayName = "AppIcon";

export { AppIcon };
