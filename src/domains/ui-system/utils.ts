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
