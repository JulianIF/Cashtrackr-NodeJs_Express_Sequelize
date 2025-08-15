import z, { refine } from "zod";

export const RegisterSchema = z.object(
{
    email: z.email("Invalid email format")
            .min(1, "Email is required"),
    name:  z.string()
            .min(1, "Name is required"),
    password:  z.string()
                .min(8, "Password is too short, must be at least 8 characters"),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, 
    {
        message: "Passwords do not match",
        path: ["password_confirmation"]
    }
);

export const LoginSchema = z.object({
        email: z.string()
                .min(1, {message: 'Email is required'})
                .email( {message: 'Invalid email'}),
        password: z.string()
                .min(1, {message: 'Password is required'})
})

export const SuccessSchema = z.string()
export const ErrorResponseSchema = z.object({
    error: z.string()
})

export const TokenSchema = z.string("Invalid Token")
                            .length(6, "Invalid Token")