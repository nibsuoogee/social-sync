import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string(),
});

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // 1. defining form
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // Send login request to the auth server
    const auth = await userService.postLogin({
      email: values.email,
      password: values.password,
    });
    if (!auth) return;

    // Extract the access token from the response
    const { access_token } = auth;

    // Update authentication state using the context
    login(access_token);

    // Redirect to the home page or dashboard
    navigate("/main-menu");
  }

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex flex-col items-center gap-2 justify-center min-h-[calc(100vh-80px)]">
      <h1 className="text-2xl font-bold">Login to your profile</h1>
      <div className="w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoComplete="email"
                      placeholder="E-mail"
                      {...field}
                    />
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
                    <Input
                      autoComplete="current-password"
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Give password
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
              Login
            </Button>
          </form>
        </Form>
      </div>
      <Button onClick={navigateToRegister} className="">
        Register
      </Button>
    </div>
  );
};
