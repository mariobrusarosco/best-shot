import { createLazyFileRoute } from "@tanstack/react-router";
import { ScraperJobsList } from "@/domains/admin/components/scraper-jobs-list/scraper-jobs-list";

const ScrapersPage = () => {
	return <ScraperJobsList />;
};

export const Route = createLazyFileRoute("/_auth/admin/scrapers")({
	component: ScrapersPage,
});
