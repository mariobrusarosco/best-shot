module.exports = {
	// Run linting and formatting on TypeScript/JavaScript files
	"**/*.{ts,tsx,js,jsx}": ["yarn format:fix"],

	// Run formatting on other supported files
	"**/*.{json,md}": ["yarn format:fix"],
};
