import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/auth";

interface LoginFormData {
  username: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { fakeLoginAs } = useAuth();

  const onSubmit = (data: LoginFormData) => {
    fakeLoginAs(data.username);
  };

  return (
    <main className="flex flex-col gap-4 justify-center items-center h-screen">
      <div className="min-w-[400px] max-w-[500px] w-full bg-background-550 rounded-lg shadow-2xl border border-gray-700">
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Loleleller</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div>
                <input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  type="text"
                  placeholder="Username"
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.username ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.username && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mt-2"
              >
                Logar
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
