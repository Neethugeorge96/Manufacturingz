import { ErrorMessage } from 'ng-bootstrap-form-validation';

export const CUSTOM_ERRORS: ErrorMessage[] = [
  {
    error: 'duplicate',
    format: duplicateFormat
  },
  {
    error: 'ngbDate',
    format: invalidDateFormat
  },
  {
    error: 'formula',
    format: invalidFormulaFormat
  }
];

export function duplicateFormat(label: string, error: any): string {
  return `${label} already exists.`;
}
export function invalidDateFormat(label: string, error: any): string {
  if (error.invalid) { return `${label} is invalid.` }
  return;
}
export function invalidFormulaFormat(label: string, error: any): string {
   return `Formula is invalid.`;
}

