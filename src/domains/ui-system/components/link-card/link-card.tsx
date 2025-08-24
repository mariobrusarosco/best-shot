import { Link, type LinkProps } from "@tanstack/react-router";
import { forwardRef } from "react";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppCard } from "@/domains/ui-system/components/card/card";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";

interface Props extends LinkProps {
	children: React.ReactNode;
	adornment?: React.ReactNode;
}

export const AppLinkCard = forwardRef<HTMLAnchorElement, Props>(
	({ children, adornment, ...props }, ref) => {
		return (
			<Link ref={ref} {...props}>
				<AppCard.Container>
					<AppCard.Header>
						{adornment ? adornment : null}

						<AppButton
							sx={{
								color: "teal.500",
								p: 0,
								borderRadius: "50%",
								display: "grid",
								placeItems: "center",
							}}
						>
							<AppIcon name="ChevronRight" size="extra-small" />
						</AppButton>
					</AppCard.Header>

					{children}
				</AppCard.Container>
			</Link>
		);
	}
);

AppLinkCard.displayName = "AppLinkCard";
