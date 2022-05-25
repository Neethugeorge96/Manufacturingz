import { ValidatorFn, AbstractControl } from '@angular/forms';

export function duplicateNameValidator(names: string[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let forbidden;
      if (control.value && names) {
        forbidden = names.includes(control.value.toLowerCase());
      }
      return forbidden ? {duplicate: {value: control.value}} : null;
    };
  }

  export function duplicateCodeValidator(codes: string[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let forbidden;
      if (control.value && codes) {
        forbidden = codes.includes(control.value);
      }
      return forbidden ? {duplicate: {value: control.value}} : null;
    };
  }
