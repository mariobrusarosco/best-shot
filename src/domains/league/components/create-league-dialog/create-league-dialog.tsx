import { zodResolver } from "@hookform/resolvers/zod";
import { DialogActions } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  CancelButton,
  Form,
  SubmitButton,
} from "@/domains/league/components/create-league-dialog/styles";
import { useLeagues } from "@/domains/league/hooks/use-leagues";
import {
  type CreateLeagueFormData,
  createLeagueSchema,
} from "@/domains/league/schemas";
import { AppDialog } from "@/domains/ui-system/components/dialog";
import { AppFormInput } from "@/domains/ui-system/components/form";

interface CreateLeagueDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateLeagueDialog = ({
  open,
  onClose,
}: CreateLeagueDialogProps) => {
  const { createLeagueMutation } = useLeagues();

  const { control, handleSubmit, reset, formState } =
    useForm<CreateLeagueFormData>({
      resolver: zodResolver(createLeagueSchema),
      defaultValues: {
        label: "",
        description: "",
      },
    });

  const onSubmit = (data: CreateLeagueFormData) => {
    createLeagueMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (!createLeagueMutation.isPending) {
      reset();
      onClose();
    }
  };

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      title="Create a New League"
      maxWidth="tablet"
      actions={
        <DialogActions>
          <CancelButton
            onClick={handleClose}
            disabled={createLeagueMutation.isPending}
            data-testid="cancel-league-btn"
          >
            Cancel
          </CancelButton>
          <SubmitButton
            onClick={handleSubmit(onSubmit)}
            disabled={createLeagueMutation.isPending || !formState.isValid}
            data-testid="submit-league-btn"
          >
            {createLeagueMutation.isPending ? "Creating..." : "Create League"}
          </SubmitButton>
        </DialogActions>
      }
    >
      <Form>
        <AppFormInput
          name="label"
          control={control}
          label="League Name"
          placeholder="Enter league name..."
          required
        />

        <AppFormInput
          name="description"
          control={control}
          label="Description"
          placeholder="Enter league description (optional)..."
          multiline
          rows={3}
        />
      </Form>
    </AppDialog>
  );
};
