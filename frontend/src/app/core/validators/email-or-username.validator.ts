import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to check if the input is a valid email or username.
 * If it contains '@', it checks if it's a valid email format.
 * Otherwise, it assumes it's a username.
 */
export function emailOrUsernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (typeof value === 'string' && value.indexOf('@') !== -1) {
      // IF CONTAINS @, IT'S AN EMAIL
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
      return emailRegex.test(value) ? null : { emailInvalid: true };
    }
    // IF NOT, IT'S A USERNAME
    return null;
  };
}
