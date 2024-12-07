import { createLink } from "@tanstack/react-router";
import * as React from "react";

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	// Add any additional props you want to pass to the anchor element
}

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, BasicLinkProps>(
	(props, ref) => {
		return <a ref={ref} {...props} />;
	},
);

export const AppLink = createLink(BasicLinkComponent);

// export const AppLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
// 	return <CreatedLinkComponent preload={"intent"} {...props} />;
// };