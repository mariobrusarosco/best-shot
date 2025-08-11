import { Link, type LinkProps } from "@tanstack/react-router";
import { forwardRef } from "react";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppCard } from "@/domains/ui-system/components/app-card/app-card";
import { AppIcon } from "@/domains/ui-system/components/app-icon/icon/app-icon";

interface Props extends LinkProps {
	children: React.ReactNode;
	adornment?: React.ReactNode;
}

export const AppLinkCard = forwardRef<HTMLAnchorElement, Props>(
	({ children, adornment, ...props }, ref) => {
		return (
			<Link ref={ref} {...props}>
				<AppCard>
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

					{children}
				</AppCard>
			</Link>
		);
	}
);

AppLinkCard.displayName = "AppLinkCard";
