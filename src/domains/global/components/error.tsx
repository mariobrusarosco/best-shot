type GenericErrorType = {
	statusText: string;
	message: string;
};

const ErrorPage = () => {
	// console.error("[BEST SHOT] - App General Error", error);

	return (
		<div data-iu="general-error-page">
			<h1>Oh no!</h1>
			<p>Sorry, something unexpected has happened.</p>
			{/* <p>{error.statusText || error.message}</p> */}
		</div>
	);
};

export { ErrorPage };
