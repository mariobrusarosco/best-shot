import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const defineMatchTimebox = (matchDate: string) => dayjs(matchDate).fromNow(true);
