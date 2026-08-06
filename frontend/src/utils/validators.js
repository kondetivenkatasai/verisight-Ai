export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 8;
}

export function validateRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

export function validateName(name) {
  return name && name.trim().length >= 2;
}

export function validateForm(fields) {
  const errors = {};

  for (const [key, { value, rules }] of Object.entries(fields)) {
    for (const rule of rules) {
      if (rule === 'required' && !validateRequired(value)) {
        errors[key] = `${key} is required`;
        break;
      }
      if (rule === 'email' && !validateEmail(value)) {
        errors[key] = 'Invalid email address';
        break;
      }
      if (rule === 'password' && !validatePassword(value)) {
        errors[key] = 'Password must be at least 8 characters';
        break;
      }
      if (rule === 'name' && !validateName(value)) {
        errors[key] = 'Must be at least 2 characters';
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
