import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { Theme } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { styled } from "@mui/system";
import { IParticipant } from "../../typing";

export const Participant = ({ participant }: { participant: IParticipant }) => {
	return (
		<Card>
			<Typography variant="caption" textTransform="capitalize">
				{participant.nickName}
			</Typography>

			<Role
				memberRole={participant.role}
				bgcolor="teal.500"
				minWidth={55}
				height={20}
			>
				<Typography variant="tag">{participant.role}</Typography>
			</Role>
		</Card>
	);
};

const Role = styled(AppPill.Component)(
	({ theme, memberRole }: { theme?: Theme; memberRole: string }) =>
		theme?.unstable_sx({
			display: "flex",
			border: "1px solid transparent",
			backgroundColor: RoleColors[memberRole].bgColor,
			borderColor: RoleColors[memberRole].borderColor,
			color: RoleColors[memberRole].color,
		}),
);

const RoleColors: Record<
	string,
	{
		color: string;
		bgColor: string;
		borderColor: string;
	}
> = {
	DEFAULT: {
		bgColor: "transparent",
		borderColor: "teal.500",
		color: "neutral.100",
	},
	GUEST: {
		bgColor: "transparent",
		borderColor: "teal.500",
		color: "teal.500",
	},
	ADMIN: {
		bgColor: "teal.500",
		color: "neutral.100",
		borderColor: "transparent",
	},
};

// TODO Unify this Card, if possible
export const Card = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		padding: 2,
		borderRadius: 2,
		display: "flex",
		justifyContent: "space-between",
		gap: 2,
		flex: 1,
	}),
);
