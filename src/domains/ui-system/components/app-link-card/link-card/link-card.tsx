import { Link, type LinkProps } from "@tanstack/react-router";
import { forwardRef } from "react";
import { AppButtonBase } from "@/domains/ui-system/components/app-button-base";
import { AppCardLayout } from "@/domains/ui-system/components/app-card-layout";
import { AppIcon } from "@/domains/ui-system/components/app-icon";

interface Props extends LinkProps {
	children: React.ReactNode;
	adornment?: React.ReactNode;
}

export const AppLinkCard = forwardRef<HTMLAnchorElement, Props>(
	({ children, adornment, ...props }, ref) => {
		return (
			<Link ref={ref} {...props}>
				<AppCardLayout.Container>
					<AppCardLayout.Header>
						{adornment ? adornment : null}

						<AppButtonBase
							sx={{
								color: "teal.500",
								p: 0,
								borderRadius: "50%",
								display: "grid",
								placeItems: "center",
							}}
						>
							<AppIcon name="ChevronRight" size="extra-small" />
						</AppButtonBase>
					</AppCardLayout.Header>

					{children}
				</AppCardLayout.Container>
			</Link>
		);
	}
);

AppLinkCard.displayName = "AppLinkCard";
