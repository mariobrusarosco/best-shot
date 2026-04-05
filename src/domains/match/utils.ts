import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const defineMatchTimebox = (matchDate: string | null) =>
	matchDate ? dayjs(matchDate).fromNow(true) : "-";
