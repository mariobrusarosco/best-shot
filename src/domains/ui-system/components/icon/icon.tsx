import { forwardRef } from "react";
import { ICONS } from "./mapper";
import { IconProps } from "@tabler/icons-react";

type sizes = "small" | "medium" | "large";

interface Props extends IconProps {
	name: keyof typeof ICONS;
	size: sizes;
}

const sizeMapping = {
	small: 16,
	medium: 24,
	large: 32,
};

const AppIcon = forwardRef<SVGSVGElement, Props>((props) => {
	const { name, size = "small", ...rest } = props;

	const IconComponent = ICONS[name];
	const measures = sizeMapping[size];

	return <IconComponent width={measures} height={measures} {...rest} />;
});

AppIcon.displayName = "AppIcon";

export { AppIcon };
