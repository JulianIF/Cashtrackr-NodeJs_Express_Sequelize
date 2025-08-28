import z, { refine } from "zod";

export const RegisterSchema = z.object(
{
    email: z.email("Invalid email format")
            .min(1, "Email required"),
    name:  z.string()
            .min(1, "Name required"),
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
                .min(1, {message: 'Email required'})
                .email( {message: 'Invalid email'}),
        password: z.string()
                .min(1, {message: 'Password required'})
})

export const SuccessSchema = z.string()
export const ErrorResponseSchema = z.object({
    error: z.string()
})

export const TokenSchema = z.string("Invalid Token")
                            .length(6, "Invalid Token")

export const UserSchema = z.object({
        id: z.number(),
        name: z.string(),
        email: z.string().email()
})

export type User = z.infer<typeof UserSchema>

export const ForgotPasswordSchema = z.object({
        email: z.string()   
                .min(1, {message: 'Email required'})
                .email( {message: 'Invalid email'}),
    })

export const ResetPasswordSchema = z.object({
        password: z.string()
                .min(8, {message: 'Password too short - Minimum 8 characters'}),
        password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"]
})

export const DraftBudgetSchema = z.object({
        name: z.string()
                .min(1, {message: 'Budget name required'}),
        amount: z.coerce.
                number({message: 'Invalid amount'})
                .min(1, {message: 'Invalid amount'}),
})

export const BudgetAPIResponseSchema = z.object({
        id: z.number(),
        name: z.string(),
        amount: z.string(),
        userId: z.number(),
        createdAt: z.string(),
        updatedAt: z.string()
})

export const BudgetsAPIResponseSchema = z.array(BudgetAPIResponseSchema)

export type Budget = z.infer<typeof BudgetAPIResponseSchema>

export const PasswordValidationSchema = z.string().min(1, {message: 'Invalid password'})

export const DraftExpenseSchema = z.object(
{
        name: z.string().min(1, {message: "Expense name required"}),
        amount: z.coerce.number().min(1, {message: "Invalid amount"})
})
