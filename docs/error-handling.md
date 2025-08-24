# Error Handling Domain

This domain provides centralized error handling functionality for the application.

## Features

- **Global Error Handling**: Centralized error handling for Axios requests and React Query operations.
- **Error Logging**: Consistent error logging across the application.
- **User-Friendly Error Messages**: Conversion of technical errors to user-friendly messages.
- **Error Notifications**: Hooks for displaying error notifications to users.

## Usage

### Axios Error Handling

The Axios instance is configured to use the global error handler:

```typescript
import { api } from "@/api";

// All requests made with this instance will use the global error handler
const response = await api.get("/some-endpoint");
```

### React Query Error Handling

React Query is configured to use the global error handler:

```typescript
// In your hooks
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { handleQueryError } from "@/domains/error-handling";

const mutation = useMutation<ResponseType, AxiosError, RequestType>({
  mutationFn: async (data) => {
    // Your mutation logic
  },
  onError: (error) => {
    handleQueryError(error);
  },
});
```

### Error Notifications

You can use the `useErrorNotification` hook to display error notifications to users:

```typescript
import { useErrorNotification } from "@/domains/error-handling";

const { showErrorNotification } = useErrorNotification();

// Display an error notification
showErrorNotification(error);

// Display a custom error message
showErrorNotification(error, "Custom error message");
```

## Extending

### Adding New Error Types

To add support for new error types, update the `handleQueryError` function in `utils/error-handler.ts`.

### Integrating with Error Monitoring Services

To integrate with error monitoring services like Sentry, update the `logError` function in `utils/error-handler.ts`.

### Adding Custom Error Messages

To add custom error messages for specific error types, update the `getUserFriendlyErrorMessage` function in `utils/error-handler.ts`. 