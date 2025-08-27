import { useState } from "react";
import { Box } from "@mui/material";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { CreateTournamentModal } from "@/domains/admin/components/tournaments/create-tournament-modal/create-tournament-modal";

const MainAdminPage = () => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	return (
		<ScreenMainContent>
			<Box sx={{ display: "flex", gap: 2, mb: 4 }}>
				<AppButton
					variant="contained"
					startIcon={<AppIcon name="Plus" size="small" />}
					onClick={() => setIsCreateModalOpen(true)}
					sx={{
						backgroundColor: "teal.500",
						"&:hover": { backgroundColor: "teal.600" },
					}}
				>
					Create Tournament
				</AppButton>
			</Box>

			{isCreateModalOpen && <CreateTournamentModal onClose={() => setIsCreateModalOpen(false)} />}
		</ScreenMainContent>
	);
};

export default MainAdminPage;
