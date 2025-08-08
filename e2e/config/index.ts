/**
 * E2E Test Configuration Exports
 * Central export point for all configuration classes and interfaces
 */

export { BasePage } from '../page-objects/base/BasePage';
export { TestHelpers } from '../utils/TestHelpers';
export { 
	TestConfig, 
	EnvironmentConfig, 
	demoConfig, 
	stagingConfig, 
	productionConfig, 
	getTestConfig,
	demoEnvironment 
} from './TestConfig';
export {
	TestUser,
	TestScenario,
	TestStep,
	navigationTestData,
	dashboardTestData,
	protectedRoutesTestData,
	browserTestData,
	smokeTestScenarios,
	errorTestScenarios
} from '../fixtures/TestData';