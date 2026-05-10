export const OverflowOnHover = () => ({
	overflow: "auto",

	":hover": {
		"::-webkit-scrollbar-thumb": {
			background: "#394c4a",
		},
	},
});

export const OverflowAuto = () => ({
	overflow: "auto",

	"::-webkit-scrollbar-thumb": {
		background: "#394c4a",
	},
});

export const lineClamp = (lines: number) => ({
	display: "-webkit-box",
	WebkitLineClamp: lines,
	WebkitBoxOrient: "vertical",
	overflow: "hidden",
});

//   -webkit-line-clamp: 2;
//   display: -webkit-box;
//   -webkit-box-orient: vertical;
//   overflow: hidden;

//   /* Chromium */
//   line-clamp: 2;
