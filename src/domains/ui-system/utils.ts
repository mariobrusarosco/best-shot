export const OverflowOnHover = () => ({
	overflow: "auto",

	":hover": {
		"::-webkit-scrollbar-thumb": {
			background: "#394c4a",
		},
	},
});
