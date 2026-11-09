// Return true when valid, or the error message to show.
export const rules = {
  required: (label) => (value) =>
    !!String(value ?? "").trim() || `${label} is required`,

  email: (value) =>
    /^\S+@\S+\.\S+$/.test(value ?? "") || "Enter a valid email address",

  minLength: (min) => (value) =>
    (value ?? "").length >= min || `Use at least ${min} characters`,

  confirmPassword: (getPassword) => (value) =>
    (value ?? "") === (getPassword() ?? "") || "Passwords must match",
  phone: (value) =>
    /^(?:\+?254|0)[17]\d{8}$/.test(String(value ?? "").replace(/\s/g, "")) ||
    "Enter a Kenyan phone number, like 0712 345 678",
  digits: (min, max) => (value) =>
    new RegExp(`^\\d{${min},${max}}$`).test(String(value ?? "").trim()) ||
    `Use ${min} to ${max} digits`,
  positive: (label) => (value) =>
    Number(value) > 0 || `${label} must be more than 0`,
  wholeNumber: (min, label) => (value) =>
    (Number.isInteger(Number(value)) && Number(value) >= min) ||
    `${label} must be a whole number, ${min} or more`,
  notPast: (value) =>
    !value ||
    value >= new Date().toISOString().slice(0, 10) ||
    "Choose today or a later date",
  matches: (other, label) => (value) =>
    value === other() || `${label} does not match`,
};
