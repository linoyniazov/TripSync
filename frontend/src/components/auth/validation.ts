import { z } from 'zod';

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .transform(email => email.trim().toLowerCase());

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters');

// Base schema for common fields
const baseSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Login schema extends base schema
export const loginSchema = baseSchema;

// Register schema extends base schema with additional fields
export const registerSchema = baseSchema.extend({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters'),
});

// Type for login form data
export type LoginFormData = z.infer<typeof loginSchema>;

// Type for register form data
export type RegisterFormData = z.infer<typeof registerSchema>;

// Combined type for form data
export type FormData = LoginFormData & Partial<Pick<RegisterFormData, 'username'>>;
// import { z } from 'zod';

// // Base schema for common fields
// const baseSchema = z.object({
//   email: z
//     .string()
//     .min(1, 'Email is required')
//     .email('Invalid email format'),
//   password: z
//     .string()
//     .min(1, 'Password is required')
//     .min(8, 'Password must be at least 8 characters'),
// });

// // Login schema extends base schema
// export const loginSchema = baseSchema;

// // Register schema extends base schema with additional fields
// export const registerSchema = baseSchema.extend({
//   username: z
//     .string()
//     .min(1, 'Username is required')
//     .min(3, 'Username must be at least 3 characters'),
// });

// // Type for login form data
// export type LoginFormData = z.infer<typeof loginSchema>;

// // Type for register form data
// export type RegisterFormData = z.infer<typeof registerSchema>;

// // Combined type for form data
// export type FormData = LoginFormData & Partial<Pick<RegisterFormData, 'username'>>;