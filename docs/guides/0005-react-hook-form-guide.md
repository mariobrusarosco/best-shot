# Guide 0005: React Hook Form Integration with Best Shot

## Overview

This guide establishes the **React Hook Form patterns** for the Best Shot project, integrating with our existing **MUI v7**, **TypeScript**, **Zod schemas**, and **Biome.js** architecture.

## Architecture Principles

### Form State Management
- **React Hook Form** for form state and validation
- **Zod** for schema validation and type safety
- **TanStack Query** for form submissions and API integration
- **MUI components** for consistent styling

### Performance Goals
- **Minimal re-renders**: Only affected fields re-render on changes
- **Optimized validation**: Client-side validation with Zod schemas
- **Efficient submissions**: Integrated with existing API layer

---

## Core Form Patterns

### 1. **Basic Form Hook Structure**

```tsx
// src/domains/*/hooks/use-*-form.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

interface UseFormOptions<T> {
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
}

export const useCustomForm = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  options: UseFormOptions<z.infer<typeof schema>>
) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: options.defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = form.handleSubmit(options.onSubmit);

  return {
    ...form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
};
```

### 2. **Form Component Structure**

```tsx
// Form component pattern
interface FormProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
  isLoading?: boolean;
}

export const CustomForm = ({ onSubmit, defaultValues, isLoading }: FormProps) => {
  const { control, onSubmit: handleSubmit, errors } = useCustomForm(
    CustomFormSchema, 
    { defaultValues, onSubmit }
  );

  return (
    <Surface component="form" onSubmit={handleSubmit}>
      <AppFormInput
        name="fieldName"
        control={control}
        label="Field Label"
        error={errors.fieldName?.message}
      />
      
      <AppButton type="submit" loading={isLoading}>
        Submit
      </AppButton>
    </Surface>
  );
};
```

---

## Form Component Library

### 1. **AppFormInput** - Text Input Component

```tsx
// src/domains/ui-system/components/form/form-input.tsx
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { AppInput } from "@/domains/ui-system/components/input/input";
import { Typography } from "@mui/material";

interface AppFormInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export const AppFormInput = <T extends FieldValues>({
  name,
  control,
  label,
  error,
  placeholder,
  disabled,
  required
}: AppFormInputProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Box sx={{ mb: 2 }}>
        {label && (
          <Typography 
            variant="caption" 
            sx={{ mb: 0.5, display: "block" }}
            color={error ? "error.main" : "text.primary"}
          >
            {label} {required && "*"}
          </Typography>
        )}
        
        <AppInput
          {...field}
          placeholder={placeholder}
          disabled={disabled}
          error={!!fieldState.error}
          sx={{
            borderColor: fieldState.error ? "error.main" : "black.400",
            "&:focus": {
              borderColor: fieldState.error ? "error.main" : "primary.main",
            }
          }}
        />
        
        {error && (
          <Typography variant="caption" color="error.main" sx={{ mt: 0.5 }}>
            {error}
          </Typography>
        )}
      </Box>
    )}
  />
);
```

### 2. **AppFormSelect** - Dropdown Component

```tsx
// src/domains/ui-system/components/form/form-select.tsx
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material";

interface SelectOption {
  value: string | number;
  label: string;
}

interface AppFormSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  options: SelectOption[];
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const AppFormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  error,
  disabled,
  required
}: AppFormSelectProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl fullWidth error={!!error} sx={{ mb: 2 }}>
        {label && (
          <InputLabel required={required}>
            {label}
          </InputLabel>
        )}
        
        <Select
          {...field}
          disabled={disabled}
          sx={{
            backgroundColor: "black.800",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "black.400",
            }
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    )}
  />
);
```

### 3. **AppFormCheckbox** - Checkbox Component

```tsx
// src/domains/ui-system/components/form/form-checkbox.tsx
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { FormControlLabel, Checkbox, Typography } from "@mui/material";

interface AppFormCheckboxProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  error?: string;
  disabled?: boolean;
}

export const AppFormCheckbox = <T extends FieldValues>({
  name,
  control,
  label,
  error,
  disabled
}: AppFormCheckboxProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={field.value || false}
              disabled={disabled}
              sx={{
                color: error ? "error.main" : "primary.main",
              }}
            />
          }
          label={label}
        />
        
        {error && (
          <Typography variant="caption" color="error.main" sx={{ ml: 4 }}>
            {error}
          </Typography>
        )}
      </Box>
    )}
  />
);
```

### 4. **AppFormFieldArray** - Dynamic Fields

```tsx
// src/domains/ui-system/components/form/form-field-array.tsx
import { useFieldArray, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { IconButton, Box } from "@mui/material";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { AppButton } from "@/domains/ui-system/components/button/button";

interface AppFormFieldArrayProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  renderField: (index: number, field: any) => React.ReactNode;
  label?: string;
  addButtonText?: string;
  minItems?: number;
  maxItems?: number;
}

export const AppFormFieldArray = <T extends FieldValues>({
  name,
  control,
  renderField,
  label,
  addButtonText = "Add Item",
  minItems = 0,
  maxItems = 10
}: AppFormFieldArrayProps<T>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography variant="h6" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      
      {fields.map((field, index) => (
        <Box key={field.id} sx={{ mb: 2, position: "relative" }}>
          {renderField(index, field)}
          
          {fields.length > minItems && (
            <IconButton
              onClick={() => remove(index)}
              sx={{ position: "absolute", top: 0, right: 0 }}
              color="error"
            >
              <IconTrash size={16} />
            </IconButton>
          )}
        </Box>
      ))}
      
      {fields.length < maxItems && (
        <AppButton
          variant="outlined"
          startIcon={<IconPlus size={16} />}
          onClick={() => append({})}
        >
          {addButtonText}
        </AppButton>
      )}
    </Box>
  );
};
```

---

## Validation Patterns with Zod

### 1. **Basic Schema Integration**

```tsx
// src/domains/league/schemas/new-league-schema.ts
import { z } from "zod";

export const NewLeagueSchema = z.object({
  name: z
    .string()
    .min(3, "League name must be at least 3 characters")
    .max(50, "League name cannot exceed 50 characters"),
  
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  
  isPrivate: z
    .boolean()
    .default(false),
  
  maxParticipants: z
    .number()
    .min(2, "At least 2 participants required")
    .max(100, "Cannot exceed 100 participants")
    .default(20),
  
  tournamentIds: z
    .array(z.string().uuid("Invalid tournament ID"))
    .min(1, "At least one tournament must be selected"),
});

export type NewLeagueInput = z.infer<typeof NewLeagueSchema>;
```

### 2. **Advanced Validation Patterns**

```tsx
// Cross-field validation
export const MatchPredictionSchema = z.object({
  homeScore: z
    .number()
    .min(0, "Score cannot be negative")
    .max(20, "Score seems unrealistic"),
  
  awayScore: z
    .number()
    .min(0, "Score cannot be negative") 
    .max(20, "Score seems unrealistic"),
  
  matchId: z.string().uuid(),
  
  predictionTime: z.date(),
}).refine((data) => {
  // Custom validation: prediction time must be before match start
  return data.predictionTime < new Date(/* match start time */);
}, {
  message: "Predictions must be submitted before match starts",
  path: ["predictionTime"],
});

// Conditional validation
export const TournamentSetupSchema = z.object({
  name: z.string().min(3),
  
  type: z.enum(["knockout", "league", "hybrid"]),
  
  rounds: z
    .array(z.object({
      name: z.string(),
      startDate: z.date(),
    }))
    .optional(),
    
}).refine((data) => {
  // Knockout tournaments require rounds
  if (data.type === "knockout" && !data.rounds?.length) {
    return false;
  }
  return true;
}, {
  message: "Knockout tournaments must have rounds defined",
  path: ["rounds"],
});
```

### 3. **Real-time Validation**

```tsx
// src/domains/*/hooks/use-*-form.ts
export const useNewLeagueForm = () => {
  const form = useForm<NewLeagueInput>({
    resolver: zodResolver(NewLeagueSchema),
    mode: "onBlur", // Validate on blur
    reValidateMode: "onChange", // Re-validate on change after first validation
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      maxParticipants: 20,
      tournamentIds: [],
    },
  });

  // Custom validation for unique league names
  const validateUniqueName = async (name: string) => {
    const { data } = await api.get(`/leagues/check-name?name=${name}`);
    return data.isUnique || "League name already exists";
  };

  return {
    ...form,
    validateUniqueName,
  };
};
```

---

## Form Integration Examples

### 1. **Simple League Creation Form**

```tsx
// src/domains/league/components/new-league/new-league-form.tsx
import { useNewLeagueForm } from "../../hooks/use-new-league-form";
import { AppFormInput, AppFormCheckbox, AppFormSelect } from "@/domains/ui-system/components/form";

interface NewLeagueFormProps {
  onSuccess: (league: League) => void;
}

export const NewLeagueForm = ({ onSuccess }: NewLeagueFormProps) => {
  const createLeague = useCreateLeague();
  
  const { control, onSubmit, errors, isSubmitting } = useNewLeagueForm({
    onSubmit: async (data) => {
      const league = await createLeague.mutateAsync(data);
      onSuccess(league);
    },
  });

  return (
    <Surface component="form" onSubmit={onSubmit} sx={{ p: 3 }}>
      <AppFormInput
        name="name"
        control={control}
        label="League Name"
        placeholder="Enter league name..."
        error={errors.name?.message}
        required
      />

      <AppFormInput
        name="description"
        control={control}
        label="Description"
        placeholder="Describe your league..."
        error={errors.description?.message}
      />

      <AppFormCheckbox
        name="isPrivate"
        control={control}
        label="Make this league private"
        error={errors.isPrivate?.message}
      />

      <AppFormSelect
        name="maxParticipants"
        control={control}
        label="Maximum Participants"
        options={[
          { value: 10, label: "10 participants" },
          { value: 20, label: "20 participants" },
          { value: 50, label: "50 participants" },
          { value: 100, label: "100 participants" },
        ]}
        error={errors.maxParticipants?.message}
        required
      />

      <AppButton
        type="submit"
        variant="contained"
        loading={isSubmitting || createLeague.isPending}
        sx={{ mt: 2 }}
      >
        Create League
      </AppButton>
    </Surface>
  );
};
```

### 2. **Match Prediction Form**

```tsx
// src/domains/match/components/prediction-form/prediction-form.tsx
export const MatchPredictionForm = ({ match }: { match: Match }) => {
  const submitPrediction = useSubmitPrediction();
  
  const { control, onSubmit, errors, watch } = useForm({
    resolver: zodResolver(MatchPredictionSchema),
    defaultValues: {
      homeScore: 0,
      awayScore: 0,
      matchId: match.id,
    },
  });

  // Watch scores for real-time feedback
  const [homeScore, awayScore] = watch(["homeScore", "awayScore"]);
  const totalGoals = (homeScore || 0) + (awayScore || 0);

  return (
    <Surface component="form" onSubmit={onSubmit} sx={{ p: 2 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h6">{match.homeTeam.name}</Typography>
          <AppFormInput
            name="homeScore"
            control={control}
            type="number"
            error={errors.homeScore?.message}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
          <Typography variant="h4">VS</Typography>
        </Box>

        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h6">{match.awayTeam.name}</Typography>
          <AppFormInput
            name="awayScore"
            control={control}
            type="number"
            error={errors.awayScore?.message}
          />
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
        Total Goals: {totalGoals}
      </Typography>

      <AppButton type="submit" loading={submitPrediction.isPending}>
        Submit Prediction
      </AppButton>
    </Surface>
  );
};
```

---

## Performance Optimization

### 1. **Memoization Patterns**

```tsx
// Memoize form components to prevent unnecessary re-renders
export const MemoizedFormInput = memo(AppFormInput);

// Use callback refs for better performance
const formRef = useCallback((node: HTMLFormElement) => {
  if (node) {
    // Form setup logic
  }
}, []);
```

### 2. **Validation Optimization**

```tsx
// Debounced validation for async checks
const debouncedValidation = useMemo(() => 
  debounce(async (value: string) => {
    return await validateUniqueName(value);
  }, 300), 
  []
);
```

### 3. **Large Form Strategies**

```tsx
// Split large forms into steps
export const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  
  const form = useForm({
    mode: "onBlur",
    // Only validate current step fields
    shouldUnregister: true,
  });

  return (
    <Box>
      {step === 1 && <BasicInfoStep control={form.control} />}
      {step === 2 && <AdvancedOptionsStep control={form.control} />}
      {step === 3 && <ReviewStep data={form.getValues()} />}
    </Box>
  );
};
```

---

## Testing Patterns

### 1. **Form Hook Testing**

```tsx
// src/domains/league/hooks/__tests__/use-new-league-form.test.ts
import { renderHook, act } from "@testing-library/react";
import { useNewLeagueForm } from "../use-new-league-form";

describe("useNewLeagueForm", () => {
  it("should validate required fields", async () => {
    const { result } = renderHook(() => useNewLeagueForm({}));

    await act(async () => {
      await result.current.trigger("name");
    });

    expect(result.current.formState.errors.name).toBeDefined();
  });

  it("should submit valid data", async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useNewLeagueForm({ onSubmit }));

    await act(async () => {
      result.current.setValue("name", "Test League");
      result.current.setValue("tournamentIds", ["uuid-1"]);
      await result.current.handleSubmit();
    });

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Test League",
      tournamentIds: ["uuid-1"],
      // ... other default values
    });
  });
});
```

### 2. **Component Testing**

```tsx
// src/domains/league/components/__tests__/new-league-form.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NewLeagueForm } from "../new-league-form";

describe("NewLeagueForm", () => {
  it("should show validation errors", async () => {
    render(<NewLeagueForm onSuccess={jest.fn()} />);

    const submitButton = screen.getByText("Create League");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("League name must be at least 3 characters")).toBeInTheDocument();
    });
  });
});
```

---

## Integration with Best Shot Architecture

### 1. **TanStack Query Integration**

```tsx
// src/domains/league/hooks/use-create-league.ts
export const useCreateLeague = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewLeagueInput) => 
      API.post("leagues", data, NewLeagueSchema),
    
    onSuccess: (league) => {
      // Invalidate leagues list
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
      
      // Add to cache
      queryClient.setQueryData(["league", league.id], league);
    },
  });
};
```

### 2. **Error Handling Integration**

```tsx
// Use existing error handling system
export const useFormErrorHandler = () => {
  const { showErrorNotification } = useErrorNotification();

  return {
    handleFormError: (error: unknown) => {
      if (error instanceof ZodError) {
        // Handle validation errors
        showErrorNotification("Please check your form data");
      } else {
        // Handle API errors
        showErrorNotification("Failed to submit form");
      }
    },
  };
};
```

---

## Next Steps

1. **Start with simple forms** (league creation, user settings)
2. **Gradually migrate existing forms** to React Hook Form patterns
3. **Build form component library** following these patterns
4. **Add advanced features** (multi-step forms, file uploads, etc.)

This guide provides the foundation for consistent, performant, and maintainable forms throughout the Best Shot application.