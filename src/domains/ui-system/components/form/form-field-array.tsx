import { Box, Typography, IconButton } from "@mui/material";
import { useFieldArray, type Control, type FieldValues, type ArrayPath, type FieldArray } from "react-hook-form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { AppButton } from "@/domains/ui-system/components/button/button";

interface AppFormFieldArrayProps<T extends FieldValues> {
	name: ArrayPath<T>;
	control: Control<T>;
	renderField: (index: number, field: any, remove: (index: number) => void) => React.ReactNode;
	label?: string;
	addButtonText?: string;
	minItems?: number;
	maxItems?: number;
	helperText?: string;
	defaultItem?: FieldArray<T, ArrayPath<T>>;
}

export const AppFormFieldArray = <T extends FieldValues>({
	name,
	control,
	renderField,
	label,
	addButtonText = "Add Item",
	minItems = 0,
	maxItems = 10,
	helperText,
	defaultItem = {} as FieldArray<T, ArrayPath<T>>,
}: AppFormFieldArrayProps<T>) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name,
	});

	const canAdd = fields.length < maxItems;
	const canRemove = fields.length > minItems;

	return (
		<Box sx={{ mb: 2 }}>
			{label && (
				<Typography
					variant="caption"
					sx={{ 
						mb: 1, 
						display: "block",
						fontWeight: 500,
						textTransform: "uppercase",
						fontSize: "0.75rem",
						letterSpacing: "0.5px",
					}}
					color="text.primary"
				>
					{label}
				</Typography>
			)}

			<Box sx={{ mb: 2 }}>
				{fields.length === 0 ? (
					<Box
						sx={{
							border: "2px dashed",
							borderColor: "black.400",
							borderRadius: 1,
							p: 3,
							textAlign: "center",
							backgroundColor: "black.900",
						}}
					>
						<Typography color="text.secondary" sx={{ mb: 2, fontSize: "0.875rem" }}>
							No items added yet
						</Typography>
						
						{canAdd && (
							<AppButton
								variant="outlined"
								startIcon={<IconPlus size={16} />}
								onClick={() => append(defaultItem)}
								size="small"
							>
								{addButtonText}
							</AppButton>
						)}
					</Box>
				) : (
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						{fields.map((field, index) => (
							<Box
								key={field.id}
								sx={{
									position: "relative",
									backgroundColor: "black.800",
									border: "1px solid",
									borderColor: "black.400",
									borderRadius: 1,
									p: 2,
								}}
							>
								{canRemove && (
									<IconButton
										onClick={() => remove(index)}
										sx={{
											position: "absolute",
											top: 8,
											right: 8,
											zIndex: 1,
											backgroundColor: "error.main",
											color: "white",
											width: 28,
											height: 28,
											"&:hover": {
												backgroundColor: "error.dark",
											},
										}}
										size="small"
									>
										<IconTrash size={14} />
									</IconButton>
								)}

								<Box sx={{ pr: canRemove ? 5 : 0 }}>
									{renderField(index, field, remove)}
								</Box>
							</Box>
						))}
					</Box>
				)}
			</Box>

			{fields.length > 0 && canAdd && (
				<AppButton
					variant="outlined"
					startIcon={<IconPlus size={16} />}
					onClick={() => append(defaultItem)}
					size="small"
					sx={{ mb: 1 }}
				>
					{addButtonText}
				</AppButton>
			)}

			{helperText && (
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ 
						display: "block",
						fontSize: "0.75rem",
					}}
				>
					{helperText}
				</Typography>
			)}

			{/* Items counter */}
			<Typography
				variant="caption"
				color="text.secondary"
				sx={{ 
					display: "block",
					fontSize: "0.7rem",
					mt: 0.5,
					textAlign: "right",
				}}
			>
				{fields.length} / {maxItems} items
			</Typography>
		</Box>
	);
};