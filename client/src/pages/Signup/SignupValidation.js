export const signupRules = {
  name: { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } },
  email: {
    required: 'Email is required',
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
  },
  password: { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } },
  confirmPassword: (watch) => ({
    required: 'Please confirm your password',
    validate: (val) => val === watch('password') || 'Passwords do not match',
  }),
};
