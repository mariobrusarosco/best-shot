import { styled, type Theme, Typography } from "@mui/material";
import type { IParticipant } from "@/domains/league/typing";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";

export const Participant = ({ participant }: { participant: IParticipant }) => {
	return (
		<Card>
			<Typography variant="caption" textTransform="capitalize">
				{participant.nickName}
			</Typography>

			<Role memberRole={participant.role} bgcolor="teal.500" minWidth={55} height={20}>
				<Typography variant="tag">{participant.role}</Typography>
			</Role>
		</Card>
	);
};

const getRoleColors = (theme: Theme, role: string) => {
	const colors: Record<string, { color: string; bgColor: string; borderColor: string }> = {
		default: {
			bgColor: "transparent",
			borderColor: theme.palette.teal[500],
			color: theme.palette.neutral[100],
		},
		guest: {
			bgColor: "transparent",
			borderColor: theme.palette.teal[500],
			color: theme.palette.teal[500],
		},
		admin: {
			bgColor: theme.palette.teal[500],
			color: theme.palette.neutral[100],
			borderColor: "transparent",
		},
	};
	return colors[role] || colors.default;
};

const Role = styled(AppPill.Component)(
	({ theme, memberRole }: { theme?: Theme; memberRole: string }) => {
		const roleColor = getRoleColors(theme as Theme, memberRole);
		return {
			display: "flex",
			border: "1px solid transparent",
			backgroundColor: roleColor.bgColor,
			borderColor: roleColor.borderColor,
			color: roleColor.color,
		};
	}
);

// TODO Unify this Card, if possible
export const Card = styled(Surface)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	padding: theme.spacing(2),
	borderRadius: theme.spacing(2),
	display: "flex",
	justifyContent: "space-between",
	gap: theme.spacing(2),
	flex: 1,
}));
