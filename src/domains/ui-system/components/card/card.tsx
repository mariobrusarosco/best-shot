import { Box, styled } from "@mui/system";
import { Link, LinkProps } from "@tanstack/react-router";
import React, { forwardRef } from "react";
import { Button } from "../button/button";
import { AppIcon } from "../icon/icon";
import { Surface } from "../surface/surface";

interface Props extends LinkProps {
	children: React.ReactNode;
	adornment?: React.ReactNode;
}

export const LinkCard = forwardRef<HTMLAnchorElement, Props>(
	({ children, adornment, ...props }, ref) => {
		return (
			<Link ref={ref} {...props}>
				<CardContainer>
					<CardHeader>
						{adornment ? adornment : null}

						<Button
							sx={{
								color: "teal.500",
								p: 1,
								borderRadius: "50%",
								width: 32,
								height: 32,
								display: "grid",
								placeItems: "center",
							}}
						>
							<AppIcon name="ChevronRight" size="extra-small" />
						</Button>
					</CardHeader>

					<Box>{children}</Box>
				</CardContainer>
			</Link>
		);
	},
);

LinkCard.displayName = "LinkCard";

const CardHeader = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
	}),
);

export const CardContainer = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		padding: 2,
		borderRadius: 2,
		display: "grid",
		gridTemplateRows: "40px 1fr",
		gap: {
			all: 2,
			tablet: 3,
		},
	}),
);
