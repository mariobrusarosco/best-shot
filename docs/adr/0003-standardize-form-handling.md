# ADR 0003: Standardize Form Handling with React Hook Form

## Status
Accepted

## Context

Best Shot currently has forms throughout the application for various user interactions including league creation, tournament setup, user registration, and match predictions. The current form implementation lacks consistency and standardization:

### Current State Problems
1. **Inconsistent Form Libraries**: Mixed usage of different form handling approaches
2. **Manual Validation**: Ad-hoc validation logic scattered across components
3. **Styling Inconsistency**: Forms don't follow unified design patterns
4. **Poor Developer Experience**: No reusable form components or patterns
5. **Type Safety**: Limited TypeScript integration for form validation

### Requirements Analysis
- **Sports Platform Needs**: Complex forms for leagues, tournaments, predictions with nested data
- **Real-time Validation**: Immediate feedback for user inputs (scores, team selections)
- **Performance**: Handle large forms without performance degradation
- **Accessibility**: Screen reader support and keyboard navigation
- **Mobile Optimization**: Touch-friendly inputs for mobile users

## Research Findings: React Form Libraries 2025

### Option 1: React Hook Form (Recommended)
**Pros:**
- ✅ **Performance**: Minimal re-renders, uncontrolled components
- ✅ **Bundle Size**: 25KB minified (smallest major library)
- ✅ **TypeScript**: Excellent type inference and validation
- ✅ **Zod Integration**: Perfect match with existing validation patterns
- ✅ **Developer Experience**: Intuitive API, great devtools
- ✅ **Ecosystem**: Mature, 40k+ GitHub stars, active maintenance

**Cons:**
- ⚠️ **Learning Curve**: Different paradigm from controlled components
- ⚠️ **Complex Nested Forms**: Requires careful handling of field arrays

### Option 2: Formik
**Pros:**
- ✅ **Mature**: Well-established library (33k+ stars)
- ✅ **Familiar**: Traditional controlled component approach
- ✅ **Rich Ecosystem**: Many plugins and integrations

**Cons:**
- ❌ **Performance**: More re-renders, larger bundle (45KB)
- ❌ **Maintenance**: Less active development in recent years
- ❌ **TypeScript**: Weaker type inference compared to RHF

### Option 3: TanStack Form
**Pros:**
- ✅ **Framework Agnostic**: Could work with future framework changes
- ✅ **TypeScript**: Strong type safety
- ✅ **Performance**: Optimized for minimal re-renders

**Cons:**
- ❌ **Ecosystem**: Newer library, smaller community
- ❌ **Documentation**: Limited examples and guides
- ❌ **Maturity**: Less battle-tested than alternatives

## Decision

**Adopt React Hook Form as the standard form library for Best Shot**, integrated with:
- **Zod** for schema validation using `@hookform/resolvers/zod`
- **Custom form components** following Best Shot design system
- **TypeScript integration** for type-safe form handling

### Rationale
1. **Performance Match**: Perfect for sports platform with real-time score inputs
2. **Zod Synergy**: Seamless integration with existing validation schemas
3. **TypeScript Excellence**: Superior type inference for complex sports data structures
4. **Bundle Optimization**: Smallest footprint for mobile users
5. **Ecosystem Maturity**: Proven reliability for production applications

## Implementation Strategy

### Phase 1: Foundation (Completed)
1. ✅ **Dependencies**: Install `react-hook-form` and `@hookform/resolvers`
2. ✅ **Component Library**: Create reusable form components in `ui-system/components/form/`
3. ✅ **Documentation**: Comprehensive guides for form patterns and validation
4. ✅ **Zod Integration**: Establish validation patterns for sports domain

### Phase 2: Migration (Next)
1. **Identify Existing Forms**: Audit current form implementations
2. **Prioritize Migration**: Start with most critical forms (league creation, user registration)
3. **Refactor Systematically**: Replace existing forms with new standardized components
4. **Testing**: Ensure form functionality and validation works correctly

### Phase 3: Optimization (Future)
1. **Performance Monitoring**: Track form performance metrics
2. **Accessibility Audit**: Ensure all forms meet WCAG guidelines
3. **Mobile Testing**: Validate touch interactions and mobile UX
4. **Advanced Patterns**: Implement complex form patterns (wizard flows, conditional fields)

## Technical Architecture

### Form Component Structure
```typescript
// Standardized form component pattern
interface FormProps<T extends FieldValues> {
  onSubmit: (data: T) => void;
  defaultValues?: Partial<T>;
  schema: ZodSchema<T>;
}

// Usage in domain components
const LeagueForm = ({ onSubmit, defaultValues }: LeagueFormProps) => {
  const { control, handleSubmit } = useForm<LeagueFormData>({
    resolver: zodResolver(leagueSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AppFormInput name="name" control={control} label="League Name" />
      <AppFormSelect name="sport" control={control} options={sportOptions} />
      <AppFormCheckbox name="isPrivate" control={control} label="Private League" />
    </form>
  );
};
```

### Reusable Components
- `AppFormInput` - Text inputs with validation and styling
- `AppFormSelect` - Dropdown selects with Best Shot theming  
- `AppFormCheckbox` - Checkbox inputs with custom styling
- `AppFormFieldArray` - Dynamic form field arrays
- `AppFormScoreInput` - Sports-specific dual score inputs

### Validation Patterns
- **Domain Schemas**: Zod schemas for sports entities (leagues, matches, predictions)
- **Async Validation**: Server-side validation for unique constraints
- **Real-time Feedback**: Immediate validation for user experience
- **Error Handling**: Consistent error display across all forms

## Consequences

### Positive
- **Developer Productivity**: Reusable components reduce development time
- **User Experience**: Consistent form behavior and validation feedback
- **Performance**: Minimal re-renders improve app responsiveness
- **Maintainability**: Centralized form logic easier to update and debug
- **Type Safety**: Compile-time validation prevents runtime form errors

### Negative
- **Migration Effort**: Existing forms need systematic refactoring
- **Learning Curve**: Team needs training on React Hook Form patterns
- **Dependency Management**: Additional packages increase bundle size
- **Testing Complexity**: Forms require more sophisticated testing strategies

### Mitigation Strategies
- **Incremental Migration**: Replace forms gradually without breaking existing functionality
- **Training Materials**: Comprehensive guides and examples for team onboarding
- **Bundle Analysis**: Monitor impact on application size and performance
- **Testing Framework**: Establish patterns for testing form components

## Success Metrics

### Developer Experience
- **Development Speed**: Measure time to implement new forms
- **Code Reuse**: Track usage of standardized form components
- **Error Reduction**: Monitor form-related bugs and issues

### User Experience  
- **Form Completion Rates**: Track user engagement with forms
- **Validation Feedback**: Measure user satisfaction with error messages
- **Performance**: Monitor form submission and rendering times

### Technical Health
- **Bundle Size**: Track impact on application size
- **Performance Metrics**: Measure form rendering and interaction times
- **Accessibility Scores**: Ensure forms meet accessibility standards

## Related Documents
- [React Hook Form Guide 0005](../guides/0005-react-hook-form-guide.md)
- [Zod Validation Patterns Guide 0006](../guides/0006-zod-validation-patterns.md)
- [Best Shot Styling Guide 0001](../guides/0001-styling-guide.md)
- [CLAUDE.md Form Handling Section](/CLAUDE.md#form-handling)

## Migration Checklist

### Forms to Migrate
- [x] League creation form (Completed - `src/domains/league/components/new-league/new-league.tsx`)
- [ ] Tournament setup form  
- [ ] User registration/login forms
- [ ] Match prediction forms
- [ ] User profile forms
- [ ] Settings/preferences forms

### Validation Schemas
- [x] League validation schema (Completed - `src/domains/league/schemas.ts`)
- [ ] Tournament validation schema
- [ ] User profile schema
- [ ] Match prediction schema
- [ ] Authentication schemas

---

**Decision Date**: 2025-01-24  
**Review Date**: 2025-07-24 (6 months)
**Migration Target**: 2025-02-28 (All critical forms migrated)