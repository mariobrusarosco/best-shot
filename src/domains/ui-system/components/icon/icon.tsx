import type { IconProps } from "@tabler/icons-react";
import { forwardRef } from "react";
import { ICONS } from "./mapper";

type sizes = "tiny" | "extra-small" | "small" | "medium" | "large";

interface Props extends IconProps {
	name: keyof typeof ICONS;
	size: sizes;
}

const sizeMapping = {
	tiny: 12,
	["extra-small"]: 16,
	small: 24,
	medium: 32,
	large: 48,
};

const AppIcon = forwardRef<SVGSVGElement, Props>((props) => {
	const { name, size = "small", ...rest } = props;

	const IconComponent = ICONS[name];
	const measures = sizeMapping[size];

	return <IconComponent width={measures} height={measures} {...rest} />;
});

AppIcon.displayName = "AppIcon";

export { AppIcon };
