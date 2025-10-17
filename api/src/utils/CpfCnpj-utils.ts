import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCpfCnpjValidConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    if (!value) return false;
    let v = String(value).replace(/[^\d]+/g, '');
    if (/^(\d)\1+$/.test(v)) return false;

    if (v.length === 11) {
      let sum = 0;
      for (let i = 0; i < 9; i++) sum += Number(v.charAt(i)) * (10 - i);
      let rev = 11 - (sum % 11);
      if (rev === 10 || rev === 11) rev = 0;
      if (rev !== Number(v.charAt(9))) return false;

      sum = 0;
      for (let i = 0; i < 10; i++) sum += Number(v.charAt(i)) * (11 - i);
      rev = 11 - (sum % 11);
      if (rev === 10 || rev === 11) rev = 0;
      if (rev !== Number(v.charAt(10))) return false;

      return true;
    } else if (v.length === 14) {
      const numbers = v.split('').map((d) => Number(d));

      let length = 12;
      let sum = 0;
      let pos = 5;
      for (let i = 0; i < length; i++) {
        sum += numbers[i] * pos;
        pos = pos - 1;
        if (pos < 2) pos = 9;
      }
      let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      if (result !== numbers[12]) return false;

      length = 13;
      sum = 0;
      pos = 6;
      for (let i = 0; i < length; i++) {
        sum += numbers[i] * pos;
        pos = pos - 1;
        if (pos < 2) pos = 9;
      }
      result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      if (result !== numbers[13]) return false;

      return true;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const val = args.value ? String(args.value).replace(/[^\d]+/g, '') : '';
    if (val.length === 11) return 'CPF inválido';
    if (val.length === 14) return 'CNPJ inválido';
    return 'CPF ou CNPJ inválido';
  }
}

export function IsCpfCnpjValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfCnpjValidConstraint,
    });
  };
}

export function formatCpfCnpj(value: string): string {
  if (!value) return '';
  let v = String(value).replace(/[^\d]+/g, '');
  if (v.length === 11) {
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (v.length === 14) {
    return v.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    );
  }
  return value;
}
