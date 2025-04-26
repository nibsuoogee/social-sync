import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const registerFormSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // 1. defining form
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    const auth = await userService.postRegister({
      username: values.username,
      email: values.email,
      password: values.password,
    });
    if (!auth) return;

    // Extract the access token from the response
    const { access_token } = auth;

    // Update authentication state using the context
    register(access_token);

    // Redirect to the home page or dashboard
    navigate("/main-menu");
  }

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center gap-2 justify-center min-h-[calc(100vh-80px)]">
      <h1 className="text-2xl font-bold">Create a new account</h1>
      <div className="w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Give your username (min. 4 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="E-mail" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Give your email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Give password (min. 6 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant={"outline"}
              className="border-black w-20"
            >
              Register
            </Button>
          </form>
        </Form>
      </div>
      <Button onClick={navigateToLogin} className="">
        Login
      </Button>
    </div>
  );
};
