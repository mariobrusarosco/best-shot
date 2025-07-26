# Guide 0006: Zod Validation Patterns for Best Shot Forms

## Overview

This guide provides **comprehensive Zod schema patterns** specifically designed for the Best Shot sports prediction platform, integrating with React Hook Form and following our TypeScript-first approach.

## Core Validation Philosophy

### Validation Strategy
- **Client-first**: Validate early and often on the client
- **Type-safe**: Leverage Zod's TypeScript integration
- **User-friendly**: Provide clear, actionable error messages
- **Performance-focused**: Optimize validation for form performance

### Schema Organization
```
src/domains/
├── league/schemas/
├── tournament/schemas/
├── match/schemas/
├── member/schemas/
└── shared/schemas/  # Reusable validation patterns
```

---

## Base Schema Patterns

### 1. **Common Field Validations**

```tsx
// src/domains/shared/schemas/common-validations.ts
import { z } from "zod";

// Reusable field validations
export const CommonValidations = {
  // Text fields
  name: (minLength = 3, maxLength = 50) =>
    z.string()
      .min(minLength, `Name must be at least ${minLength} characters`)
      .max(maxLength, `Name cannot exceed ${maxLength} characters`)
      .regex(/^[a-zA-Z0-9\s-_]+$/, "Name can only contain letters, numbers, spaces, hyphens, and underscores"),

  description: (minLength = 10, maxLength = 500) =>
    z.string()
      .min(minLength, `Description must be at least ${minLength} characters`)
      .max(maxLength, `Description cannot exceed ${maxLength} characters`)
      .optional(),

  // Sports-specific validations
  score: z.number()
    .min(0, "Score cannot be negative")
    .max(50, "Score seems unrealistic")
    .int("Score must be a whole number"),

  // User input
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email address is too long"),

  // Identifiers
  uuid: z.string()
    .uuid("Invalid ID format"),

  // Dates
  futureDate: z.date()
    .refine((date) => date > new Date(), "Date must be in the future"),

  // URLs
  imageUrl: z.string()
    .url("Please enter a valid URL")
    .refine((url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url), "Must be a valid image URL"),
};
```

### 2. **Sports-Specific Validations**

```tsx
// src/domains/shared/schemas/sports-validations.ts
export const SportsValidations = {
  // Match predictions
  matchScore: z.object({
    home: CommonValidations.score,
    away: CommonValidations.score,
  }).refine((scores) => {
    // Custom business logic
    const total = scores.home + scores.away;
    return total <= 15; // Reasonable total goals
  }, {
    message: "Combined score seems too high for a realistic match",
    path: ["home", "away"],
  }),

  // Tournament formats
  tournamentType: z.enum(["knockout", "league", "group_stage", "hybrid"], {
    errorMap: () => ({ message: "Please select a valid tournament format" }),
  }),

  // Sports categories
  sport: z.enum(["football", "basketball", "tennis", "cricket"], {
    errorMap: () => ({ message: "Please select a supported sport" }),
  }),

  // Performance metrics
  points: z.number()
    .min(0, "Points cannot be negative")
    .max(10000, "Points value seems unrealistic"),

  // Dates in sports context
  matchDateTime: z.date()
    .refine((date) => {
      const now = new Date();
      const maxFuture = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year
      return date <= maxFuture;
    }, "Match date cannot be more than 1 year in the future"),
};
```

---

## Domain-Specific Schemas

### 1. **League Management Schemas**

```tsx
// src/domains/league/schemas/league-schemas.ts
import { z } from "zod";
import { CommonValidations, SportsValidations } from "@/domains/shared/schemas";

export const CreateLeagueSchema = z.object({
  name: CommonValidations.name(3, 50),
  description: CommonValidations.description(),
  
  // League-specific fields
  isPrivate: z.boolean().default(false),
  
  maxParticipants: z.number()
    .min(2, "League must allow at least 2 participants")
    .max(1000, "Cannot exceed 1000 participants")
    .default(50),
  
  // Tournament selection
  tournamentIds: z.array(CommonValidations.uuid)
    .min(1, "Select at least one tournament")
    .max(10, "Cannot select more than 10 tournaments"),
  
  // Entry settings
  entryFee: z.number()
    .min(0, "Entry fee cannot be negative")
    .max(1000, "Entry fee cannot exceed $1000")
    .optional(),
  
  // Timing
  startDate: z.date()
    .refine((date) => date > new Date(), "Start date must be in the future"),
  
  endDate: z.date(),
  
  // League rules
  scoringSystem: z.enum(["standard", "bonus", "weighted"], {
    errorMap: () => ({ message: "Please select a scoring system" }),
  }).default("standard"),
  
}).refine((data) => {
  // Cross-field validation: end date after start date
  return data.endDate > data.startDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const InviteToLeagueSchema = z.object({
  leagueId: CommonValidations.uuid,
  
  // Multiple invitation methods
  inviteMethod: z.enum(["email", "username", "link"]),
  
  // Conditional fields based on invite method
  emails: z.array(CommonValidations.email)
    .max(50, "Cannot invite more than 50 people at once")
    .optional(),
  
  usernames: z.array(z.string().min(3).max(30))
    .max(50, "Cannot invite more than 50 people at once")
    .optional(),
  
  message: z.string()
    .max(500, "Message cannot exceed 500 characters")
    .optional(),
    
}).refine((data) => {
  // At least one invitation method must be used
  const hasEmails = data.emails && data.emails.length > 0;
  const hasUsernames = data.usernames && data.usernames.length > 0;
  const isLinkInvite = data.inviteMethod === "link";
  
  return hasEmails || hasUsernames || isLinkInvite;
}, {
  message: "Please provide at least one email or username, or use link invitation",
  path: ["emails"],
});

export type CreateLeagueInput = z.infer<typeof CreateLeagueSchema>;
export type InviteToLeagueInput = z.infer<typeof InviteToLeagueSchema>;
```

### 2. **Tournament Setup Schemas**

```tsx
// src/domains/tournament/schemas/tournament-schemas.ts
export const CreateTournamentSchema = z.object({
  name: CommonValidations.name(5, 100),
  description: CommonValidations.description(20, 1000),
  
  // Tournament configuration
  type: SportsValidations.tournamentType,
  sport: SportsValidations.sport,
  
  // Visual branding
  logo: CommonValidations.imageUrl.optional(),
  backgroundColor: z.string()
    .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color code")
    .default("#000000"),
  
  // Tournament structure
  rounds: z.array(z.object({
    name: CommonValidations.name(2, 30),
    startDate: z.date(),
    endDate: z.date(),
    matchDuration: z.number() // minutes
      .min(30, "Match duration must be at least 30 minutes")
      .max(300, "Match duration cannot exceed 5 hours"),
  })).min(1, "Tournament must have at least one round"),
  
  // Participation rules
  maxTeams: z.number()
    .min(2, "Tournament must allow at least 2 teams")
    .max(128, "Cannot exceed 128 teams")
    .optional(),
  
  // Prediction rules
  predictionDeadline: z.enum(["matchStart", "1hour", "24hours"], {
    errorMap: () => ({ message: "Please select a prediction deadline" }),
  }).default("matchStart"),
  
  // Scoring configuration
  pointsConfig: z.object({
    exactScore: z.number().min(1).max(10).default(3),
    correctOutcome: z.number().min(1).max(5).default(1),
    goalDifference: z.number().min(0).max(3).default(0),
  }),
  
}).refine((data) => {
  // Validate round dates are sequential
  const rounds = data.rounds.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  
  for (let i = 0; i < rounds.length - 1; i++) {
    if (rounds[i].endDate >= rounds[i + 1].startDate) {
      return false;
    }
  }
  return true;
}, {
  message: "Round dates must not overlap",
  path: ["rounds"],
});

export const EditTournamentSchema = CreateTournamentSchema.partial().extend({
  id: CommonValidations.uuid,
});

export type CreateTournamentInput = z.infer<typeof CreateTournamentSchema>;
export type EditTournamentInput = z.infer<typeof EditTournamentSchema>;
```

### 3. **Match Prediction Schemas**

```tsx
// src/domains/match/schemas/prediction-schemas.ts
export const MatchPredictionSchema = z.object({
  matchId: CommonValidations.uuid,
  
  // Score prediction
  homeScore: CommonValidations.score,
  awayScore: CommonValidations.score,
  
  // Additional predictions (optional)
  firstGoalScorer: z.string()
    .min(2, "Player name must be at least 2 characters")
    .max(50, "Player name too long")
    .optional(),
  
  totalGoals: z.number()
    .min(0, "Total goals cannot be negative")
    .max(20, "Total goals seems unrealistic")
    .optional(),
  
  // Prediction confidence (1-5 scale)
  confidence: z.number()
    .min(1, "Confidence must be at least 1")
    .max(5, "Confidence cannot exceed 5")
    .default(3),
  
  // Prediction timing
  submittedAt: z.date().default(() => new Date()),
  
}).refine((data) => {
  // Business rule: total goals should match sum if provided
  if (data.totalGoals !== undefined) {
    const calculatedTotal = data.homeScore + data.awayScore;
    return data.totalGoals === calculatedTotal;
  }
  return true;
}, {
  message: "Total goals must match the sum of home and away scores",
  path: ["totalGoals"],
});

export const BulkPredictionSchema = z.object({
  predictions: z.array(MatchPredictionSchema)
    .min(1, "Must include at least one prediction")
    .max(50, "Cannot submit more than 50 predictions at once"),
    
  // Bulk options
  applyToAllUpcoming: z.boolean().default(false),
  confidence: z.number().min(1).max(5).default(3), // Apply to all
  
}).refine((data) => {
  // Ensure no duplicate match predictions
  const matchIds = data.predictions.map(p => p.matchId);
  const uniqueMatchIds = new Set(matchIds);
  return matchIds.length === uniqueMatchIds.size;
}, {
  message: "Cannot submit multiple predictions for the same match",
  path: ["predictions"],
});

export type MatchPredictionInput = z.infer<typeof MatchPredictionSchema>;
export type BulkPredictionInput = z.infer<typeof BulkPredictionSchema>;
```

### 4. **User Profile Schemas**

```tsx
// src/domains/member/schemas/profile-schemas.ts
export const UpdateProfileSchema = z.object({
  // Basic info
  displayName: CommonValidations.name(2, 30),
  
  bio: z.string()
    .max(300, "Bio cannot exceed 300 characters")
    .optional(),
  
  // Profile picture
  avatar: CommonValidations.imageUrl.optional(),
  
  // Preferences
  timezone: z.string()
    .regex(/^[A-Za-z]+\/[A-Za-z_]+$/, "Invalid timezone format")
    .default("UTC"),
  
  favoriteTeams: z.array(z.object({
    teamId: CommonValidations.uuid,
    teamName: z.string(),
    sport: SportsValidations.sport,
  })).max(10, "Cannot have more than 10 favorite teams"),
  
  // Notification preferences
  notifications: z.object({
    matchReminders: z.boolean().default(true),
    leagueUpdates: z.boolean().default(true),
    weeklyReport: z.boolean().default(false),
    marketingEmails: z.boolean().default(false),
  }),
  
  // Privacy settings
  privacy: z.object({
    profileVisibility: z.enum(["public", "friends", "private"]).default("public"),
    showStats: z.boolean().default(true),
    showFavoriteTeams: z.boolean().default(true),
  }),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, "Current password is required"),
  
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
           "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  
  confirmPassword: z.string(),
  
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
```

---

## Advanced Validation Patterns

### 1. **Conditional Validation**

```tsx
// Conditional validation based on other fields
export const ConditionalFormSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("public"),
    name: CommonValidations.name(),
    // Public leagues don't need entry codes
  }),
  z.object({
    type: z.literal("private"),
    name: CommonValidations.name(),
    entryCode: z.string()
      .min(4, "Entry code must be at least 4 characters")
      .max(20, "Entry code cannot exceed 20 characters"),
  }),
]);
```

### 2. **Async Validation**

```tsx
// Custom async validation with React Hook Form
export const useAsyncValidation = () => {
  const validateUniqueLeagueName = async (name: string) => {
    try {
      const response = await api.get(`/leagues/check-name?name=${encodeURIComponent(name)}`);
      return response.data.isUnique || "League name already exists";
    } catch {
      return "Unable to verify name uniqueness";
    }
  };

  const validateTeamExists = async (teamName: string) => {
    try {
      const response = await api.get(`/teams/search?name=${encodeURIComponent(teamName)}`);
      return response.data.exists || "Team not found";
    } catch {
      return "Unable to verify team";
    }
  };

  return { validateUniqueLeagueName, validateTeamExists };
};
```

### 3. **Dynamic Schema Generation**

```tsx
// Generate schemas based on tournament configuration
export const createDynamicPredictionSchema = (tournament: Tournament) => {
  const baseSchema = z.object({
    matchId: CommonValidations.uuid,
    homeScore: CommonValidations.score,
    awayScore: CommonValidations.score,
  });

  // Add fields based on tournament type
  if (tournament.allowsFirstGoalScorer) {
    return baseSchema.extend({
      firstGoalScorer: z.string().optional(),
    });
  }

  if (tournament.requiresConfidence) {
    return baseSchema.extend({
      confidence: z.number().min(1).max(5),
    });
  }

  return baseSchema;
};
```

### 4. **Complex Business Rules**

```tsx
// Complex validation with multiple business rules
export const AdvancedLeagueSchema = z.object({
  name: CommonValidations.name(),
  startDate: z.date(),
  endDate: z.date(),
  entryFee: z.number().min(0),
  maxParticipants: z.number().min(2),
  tournaments: z.array(CommonValidations.uuid).min(1),
  
}).superRefine((data, ctx) => {
  // Multiple validation rules
  
  // Rule 1: End date after start date
  if (data.endDate <= data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be after start date",
      path: ["endDate"],
    });
  }
  
  // Rule 2: Paid leagues have participant limits
  if (data.entryFee > 0 && data.maxParticipants > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Paid leagues cannot exceed 100 participants",
      path: ["maxParticipants"],
    });
  }
  
  // Rule 3: League duration limits
  const durationDays = (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (durationDays > 365) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "League duration cannot exceed 365 days",
      path: ["endDate"],
    });
  }
});
```

---

## Error Message Customization

### 1. **Branded Error Messages**

```tsx
// Custom error messages for Best Shot
export const BestShotErrorMessages = {
  league: {
    nameRequired: "Every great league needs a memorable name!",
    nameTooShort: "Make your league name a bit longer - at least 3 characters",
    tournamentRequired: "Pick at least one tournament to compete in",
    startDatePast: "Time travel isn't allowed - choose a future start date",
  },
  
  prediction: {
    scoreNegative: "Negative scores? That's not how football works!",
    scoreUnrealistic: "That score seems a bit too high, even for a thriller",
    deadlinePassed: "The whistle has blown - prediction deadline has passed",
  },
  
  profile: {
    displayNameRequired: "How will other players know who's dominating the leaderboards?",
    bioTooLong: "Keep your bio under 300 characters - save some mystery!",
  },
};

// Apply custom messages to schemas
export const LeagueSchemaWithCustomMessages = CreateLeagueSchema.extend({
  name: z.string()
    .min(3, BestShotErrorMessages.league.nameTooShort)
    .max(50, "League name is too long"),
});
```

### 2. **Contextual Error Messages**

```tsx
// Different messages based on context
export const createContextualSchema = (context: "create" | "edit") => {
  const messages = {
    create: {
      nameRequired: "Give your new league a catchy name",
      submitButton: "Create League",
    },
    edit: {
      nameRequired: "League name cannot be empty",
      submitButton: "Save Changes",
    },
  };

  return z.object({
    name: z.string().min(1, messages[context].nameRequired),
    // ... other fields
  });
};
```

---

## Performance Optimization

### 1. **Schema Memoization**

```tsx
// Memoize complex schemas to avoid recreation
export const useMemoizedSchema = (dependencies: unknown[]) => {
  return useMemo(() => {
    return CreateLeagueSchema;
  }, dependencies);
};
```

### 2. **Partial Validation**

```tsx
// Validate only specific fields for better performance
export const validateSingleField = async (fieldName: string, value: unknown) => {
  try {
    const fieldSchema = CreateLeagueSchema.shape[fieldName as keyof typeof CreateLeagueSchema.shape];
    await fieldSchema.parseAsync(value);
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: "Validation failed" };
  }
};
```

### 3. **Schema Composition**

```tsx
// Compose schemas for reusability and performance
const BaseEntitySchema = z.object({
  id: CommonValidations.uuid,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LeagueSchema = BaseEntitySchema.extend({
  name: CommonValidations.name(),
  // ... league-specific fields
});

export const TournamentSchema = BaseEntitySchema.extend({
  name: CommonValidations.name(),
  // ... tournament-specific fields
});
```

---

## Integration with React Hook Form

### 1. **Schema-Driven Form Generation**

```tsx
// Generate form fields from schema
export const generateFormFields = (schema: z.ZodObject<any>) => {
  const shape = schema.shape;
  
  return Object.entries(shape).map(([key, zodType]) => {
    if (zodType instanceof z.ZodString) {
      return { name: key, type: "text", component: "AppFormInput" };
    }
    if (zodType instanceof z.ZodNumber) {
      return { name: key, type: "number", component: "AppFormInput" };
    }
    if (zodType instanceof z.ZodBoolean) {
      return { name: key, type: "checkbox", component: "AppFormCheckbox" };
    }
    // ... handle other types
  });
};
```

### 2. **Type-Safe Form Hooks**

```tsx
// Generic form hook with full type safety
export const useTypedForm = <T extends z.ZodType>(
  schema: T,
  options?: UseFormOptions<z.infer<T>>
) => {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    ...options,
  });
};

// Usage
const { control, handleSubmit } = useTypedForm(CreateLeagueSchema, {
  defaultValues: { name: "", isPrivate: false },
});
```

---

## Testing Validation

### 1. **Schema Testing**

```tsx
// Test Zod schemas
describe("CreateLeagueSchema", () => {
  it("should validate valid league data", () => {
    const validData = {
      name: "Premier League Predictions",
      description: "Predict the Premier League results",
      isPrivate: false,
      maxParticipants: 50,
      tournamentIds: ["550e8400-e29b-41d4-a716-446655440000"],
      startDate: new Date("2024-08-01"),
      endDate: new Date("2024-05-31"),
      scoringSystem: "standard" as const,
    };

    expect(() => CreateLeagueSchema.parse(validData)).not.toThrow();
  });

  it("should reject invalid data", () => {
    const invalidData = { name: "AB" }; // Too short

    expect(() => CreateLeagueSchema.parse(invalidData)).toThrow();
  });
});
```

### 2. **Form Integration Testing**

```tsx
// Test form validation integration
describe("League Form Validation", () => {
  it("should show validation errors", async () => {
    const { result } = renderHook(() => 
      useTypedForm(CreateLeagueSchema)
    );

    await act(async () => {
      result.current.setValue("name", "AB");
      await result.current.trigger("name");
    });

    expect(result.current.formState.errors.name?.message)
      .toBe("Name must be at least 3 characters");
  });
});
```

This comprehensive Zod validation system provides type-safe, performant, and user-friendly form validation throughout the Best Shot application, perfectly integrated with React Hook Form and your existing architecture.