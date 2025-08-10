import { useTheme } from "@mui/material";
import { AppButtonBase } from "@/domains/ui-system/components/app-button-base";
import { AppIcon } from "@/domains/ui-system/components/app-icon";
import type { ICONS } from "@/domains/ui-system/components/app-icon/icon/mapper";

export const MenuButton = ({ iconName }: { iconName: keyof typeof ICONS }) => {
	const theme = useTheme();

	return (
		<AppButtonBase
			sx={{
				backgroundColor: theme.palette.teal[500],
				color: theme.palette.neutral[100],
				padding: theme.spacing(1),
				borderRadius: theme.shape.borderRadius,
				display: "inline-flex",
				width: 44,
				height: 44,

				".active &, &:hover": {
					color: theme.palette.teal[500],
					backgroundColor: theme.palette.neutral[100],
				},
			}}
		>
			<AppIcon name={iconName} size="small" stroke={2} width={20} height={20} />
		</AppButtonBase>
	);
};
