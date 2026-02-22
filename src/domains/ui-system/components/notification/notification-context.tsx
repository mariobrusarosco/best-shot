import { Alert, type AlertColor, IconButton, Snackbar } from "@mui/material";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { AppIcon } from "@/domains/ui-system/components";

interface NotificationState {
	open: boolean;
	message: string;
	severity: AlertColor;
}

interface NotificationContextValue {
	showNotification: (message: string, severity?: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotification = () => {
	const context = useContext(NotificationContext);

	if (!context) {
		throw new Error("useNotification must be used within a NotificationProvider");
	}

	return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
	const [notification, setNotification] = useState<NotificationState>({
		open: false,
		message: "",
		severity: "success",
	});

	const showNotification = useCallback((message: string, severity: AlertColor = "success") => {
		setNotification({ open: true, message, severity });
	}, []);

	const handleClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") return;
		setNotification((prev) => ({ ...prev, open: false }));
	}, []);

	return (
		<NotificationContext.Provider value={{ showNotification }}>
			{children}
			<Snackbar
				open={notification.open}
				autoHideDuration={4000}
				onClose={handleClose}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert
					onClose={handleClose}
					severity={notification.severity}
					variant="filled"
					action={
						<IconButton size="small" color="inherit" onClick={handleClose}>
							<AppIcon name="X" size="extra-small" />
						</IconButton>
					}
					color="success"
					sx={{
						width: "100%",
						borderRadius: 2,
					}}
				>
					{notification.message}
				</Alert>
			</Snackbar>
		</NotificationContext.Provider>
	);
};
