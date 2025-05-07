import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { ICONS } from "@/domains/ui-system/components/icon/mapper";
import { useTheme } from "@mui/material";

export const MenuButton = ({ iconName }: { iconName: keyof typeof ICONS }) => {
	const theme = useTheme();

	return (
		<AppButton
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
		</AppButton>
	);
};
