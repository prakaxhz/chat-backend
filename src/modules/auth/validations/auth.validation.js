const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(2, 'Name must be at least 2 characters'),
    email: z.string({
      required_error: 'Email is required',
    }).email('Please provide a valid email'),
    password: z.string({
      required_error: 'Password is required',
    }).min(6, 'Password must be at least 6 characters'),
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Please provide a valid email'),
    password: z.string({
      required_error: 'Password is required',
    })
  })
});

const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Please provide a valid email'),
    otp: z.coerce.string({
      required_error: 'OTP is required',
    }).length(6, 'OTP must be exactly 6 characters')
  })
});

const resendOtpSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Please provide a valid email')
  })
});

const forgotPasswordSchema = resendOtpSchema;

const verifyResetOtpSchema = verifyEmailSchema;

const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Please provide a valid email'),
    password: z.string({
      required_error: 'Password is required',
    }).min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string({
      required_error: 'Confirm password is required',
    })
  }).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"] // path of error
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  resetPasswordSchema
};

