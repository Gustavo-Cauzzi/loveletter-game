import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useCreateRoomMutation } from "../../api/rooms";

interface CreateRoomProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
}

const CreateRoomDialog: React.FC<CreateRoomProps> = ({ open, onClose }) => {
  const { mutate: createRoom, isPending } = useCreateRoomMutation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: FormData) => {
    createRoom(data.name, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Room</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Room name is required",
              minLength: {
                value: 2,
                message: "Room name must be at least 2 characters",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Room Name"
                margin="normal"
                variant="outlined"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" loading={isPending}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateRoomDialog;
