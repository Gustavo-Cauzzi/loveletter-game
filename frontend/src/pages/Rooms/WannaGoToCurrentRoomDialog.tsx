import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useCurrentRoom } from "../../hooks/currentRoom";
import { useNavigate } from "react-router";

interface WannaGoToCurrentRoomDialogProps {
  open: boolean;
  onClose: () => void;
  roomName?: string;
}

const WannaGoToCurrentRoomDialog: React.FC<WannaGoToCurrentRoomDialogProps> = ({
  open,
  onClose,
}) => {
  const { currentRoom } = useCurrentRoom();
  console.log("[Czz] currentRoom: ", currentRoom);
  const navigate = useNavigate();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Go to {currentRoom?.name}?
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            It seems you are already in a room. Would you like to navigate to
            {currentRoom?.name}?
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            navigate(`/room/${currentRoom?.id}`);
          }}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            fontWeight: 600,
          }}
        >
          Go to {currentRoom?.name}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WannaGoToCurrentRoomDialog;
