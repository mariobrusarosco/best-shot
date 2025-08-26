import { useState } from "react";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { CreateTournamentModal } from "../components/tournaments/create-tournament-modal/create-tournament-modal";

const MainAdminPage = () => {
	// const { data, isLoading, error } = useAdminTournaments();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// console.log(data)

	// if (isLoading) {
	// 	return (
	// 		<ScreenMainContent>
	// 			<AppLoader />
	// 		</ScreenMainContent>
	// 	);
	// }

	// if (error) {
	// 	return (
	// 		<ScreenMainContent>
	// 			<AppError error={new Error("Failed to load tournament data. Please try again later.")} />
	// 		</ScreenMainContent>
	// 	);
	// }

	return (
		<ScreenMainContent>
			<AppButton
				variant="contained"
				startIcon={<AppIcon name="Plus" size="small" />}
				onClick={() => setIsCreateModalOpen(true)}
			>
				Create Tournament
			</AppButton>

			{isCreateModalOpen && <CreateTournamentModal onClose={() => setIsCreateModalOpen(false)} />}

			{/* <TournamentsList tournaments={data || []} /> */}
		</ScreenMainContent>
	);
};

export default MainAdminPage;
