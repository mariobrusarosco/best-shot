import { Box, IconButton, styled } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { FootballIcon } from "@/assets/football-icon";
import { useFAB } from "@/hooks/use-ui-store";

interface DragState {
	isDragging: boolean;
	offset: { x: number; y: number };
}

export const FloatingActionButton = () => {
	const { fab, setPosition, setDragging } = useFAB();
	const dragRef = useRef<HTMLButtonElement>(null);
	const [dragState, setDragState] = useState<DragState>({
		isDragging: false,
		offset: { x: 0, y: 0 },
	});

	// Constrain position to viewport bounds
	const constrainPosition = useCallback((x: number, y: number) => {
		const buttonSize = 56; // FAB size
		const margin = 8; // Minimum margin from edges

		const maxX = window.innerWidth - buttonSize - margin;
		const maxY = window.innerHeight - buttonSize - margin;

		return {
			x: Math.max(margin, Math.min(x, maxX)),
			y: Math.max(margin, Math.min(y, maxY)),
		};
	}, []);

	// Handle mouse down - start dragging
	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			if (dragRef.current) {
				const rect = dragRef.current.getBoundingClientRect();
				const offset = {
					x: e.clientX - rect.left,
					y: e.clientY - rect.top,
				};
				setDragState({ isDragging: true, offset });
				setDragging(true);
			}
		},
		[setDragging]
	);

	// Handle mouse move - dragging
	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (dragState.isDragging) {
				const newPosition = constrainPosition(
					e.clientX - dragState.offset.x,
					e.clientY - dragState.offset.y
				);
				// Update position in memory only, don't persist during drag
				setPosition(newPosition, false);
			}
		},
		[dragState.isDragging, dragState.offset, constrainPosition, setPosition]
	);

	// Handle mouse up - stop dragging
	const handleMouseUp = useCallback(() => {
		if (dragState.isDragging) {
			setDragState({ isDragging: false, offset: { x: 0, y: 0 } });
			setDragging(false);

			// Persist the final position to localStorage only when drag ends
			setPosition(fab.position, true);
		}
	}, [dragState.isDragging, setDragging, fab.position, setPosition]);

	// Handle touch events for mobile
	const handleTouchStart = useCallback(
		(e: React.TouchEvent) => {
			e.preventDefault();
			if (dragRef.current && e.touches.length === 1) {
				const touch = e.touches[0];
				const rect = dragRef.current.getBoundingClientRect();
				const offset = {
					x: touch.clientX - rect.left,
					y: touch.clientY - rect.top,
				};
				setDragState({ isDragging: true, offset });
				setDragging(true);
			}
		},
		[setDragging]
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (dragState.isDragging && e.touches.length === 1) {
				e.preventDefault();
				const touch = e.touches[0];
				const newPosition = constrainPosition(
					touch.clientX - dragState.offset.x,
					touch.clientY - dragState.offset.y
				);
				// Update position in memory only, don't persist during drag
				setPosition(newPosition, false);
			}
		},
		[dragState.isDragging, dragState.offset, constrainPosition, setPosition]
	);

	const handleTouchEnd = useCallback(
		(e: TouchEvent) => {
			if (dragState.isDragging) {
				e.preventDefault();
				setDragState({ isDragging: false, offset: { x: 0, y: 0 } });
				setDragging(false);

				// Persist the final position to localStorage only when touch ends
				setPosition(fab.position, true);
			}
		},
		[dragState.isDragging, setDragging, fab.position, setPosition]
	);

	// Add global event listeners for mouse/touch events
	useEffect(() => {
		if (dragState.isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.addEventListener("touchmove", handleTouchMove, { passive: false });
			document.addEventListener("touchend", handleTouchEnd, { passive: false });

			// Prevent text selection while dragging
			document.body.style.userSelect = "none";

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				document.removeEventListener("touchmove", handleTouchMove);
				document.removeEventListener("touchend", handleTouchEnd);
				document.body.style.userSelect = "";
			};
		}
	}, [dragState.isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

	// Handle window resize to keep FAB in bounds
	useEffect(() => {
		const handleResize = () => {
			const constrainedPosition = constrainPosition(fab.position.x, fab.position.y);
			if (constrainedPosition.x !== fab.position.x || constrainedPosition.y !== fab.position.y) {
				// Persist immediately when position is adjusted due to window resize
				setPosition(constrainedPosition, true);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [fab.position, constrainPosition, setPosition]);

	if (!fab.isVisible) {
		return null;
	}

	return (
		<FABContainer
			sx={{
				left: fab.position.x,
				top: fab.position.y,
				cursor: fab.isDragging ? "grabbing" : "grab",
				transform: fab.isDragging ? "scale(1.1)" : "scale(1)",
				zIndex: fab.isDragging ? 1300 : 1200, // Higher z-index when dragging
			}}
		>
			<FABButton
				ref={dragRef}
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouchStart}
				size="large"
				color="primary"
				aria-label="Floating action button"
			>
				<FootballIcon width={32} height={30} fill="currentColor" />
			</FABButton>
		</FABContainer>
	);
};

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

const FABContainer = styled(Box)(({ theme }) => ({
	position: "fixed",
	transition: theme.transitions.create(["transform"], {
		duration: theme.transitions.duration.short,
	}),
	zIndex: theme.zIndex.fab,
	pointerEvents: "auto",
}));

const FABButton = styled(IconButton)(({ theme }) => ({
	width: 56,
	height: 56,

	// Use design system tokens instead of hardcoded colors
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	boxShadow: theme.shadows[6],

	// Interactive states with theme tokens
	"&:hover": {
		backgroundColor: theme.palette.primary.dark,
		boxShadow: theme.shadows[8],
		transform: "scale(1.02)",
		transition: theme.transitions.create(["background-color", "box-shadow", "transform"], {
			duration: theme.transitions.duration.short,
		}),
	},

	"&:active": {
		backgroundColor: theme.palette.primary.dark,
		transform: "scale(0.98)",
	},

	// Ensure the button stays circular
	borderRadius: "50%",

	// Disable text selection for better UX
	userSelect: "none",
	WebkitUserSelect: "none",

	// Enhanced accessibility
	"&:focus-visible": {
		outline: `2px solid ${theme.palette.primary.main}`,
		outlineOffset: "4px",
	},

	// Better touch targets for mobile
	[theme.breakpoints.down("tablet")]: {
		width: 48,
		height: 48,
		"& svg": {
			width: 24,
			height: 24,
		},
	},

	// Disable hover effects on touch devices
	"@media (hover: none)": {
		"&:hover": {
			backgroundColor: theme.palette.primary.main,
			transform: "none",
		},
	},
}));
