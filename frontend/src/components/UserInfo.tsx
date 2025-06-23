import { useAuth } from "../hooks/auth";
import { PersonOutlined } from "@mui/icons-material";

export const UserInfo = () => {
  const { user } = useAuth();
  return (
    <div className="flex gap-3 items-center shadow-md rounded-xl p-2 bg-gray-700/20 px-2">
      <div className="flex flex-col items-end">
        <h3>{user?.username}</h3>
        <p className="text-xs text-gray-500 truncate">{user?.id}</p>
      </div>

      <div className="flex flex-col justify-center items-center rounded-full bg-gray-200 w-10 h-10">
        <PersonOutlined className="text-gray-500" />
      </div>
    </div>
  );
};
