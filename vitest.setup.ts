/* [REASONING]
 * Even thhough we are not using jest, we still need to import the jest-dom
 * library, since it is used by the testing-library and we want to have the same Matchers like
 * toBeInTheDocument() available in our tests.
 * (https://github.com/chaance/vitest-dom)
 */
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock import.meta.env
vi.stubGlobal('import.meta', {
    env: {
        MODE: 'local-dev',
        VITE_BEST_SHOT_API: 'http://localhost:9090/api/v1',
        VITE_BEST_SHOT_API_V2: 'http://localhost:9090/api/v2',
    }
});

console.warn("------- PERFORMING THINGS BEFORE RUNINNG TESTS");
