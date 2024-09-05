import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isAdult', async: false })
@Injectable()
export class IsAdult implements ValidatorConstraintInterface {
  validate(birthDate: Date, args: ValidationArguments) {
    const currentDate = new Date();
    const ageDiff = currentDate.getFullYear() - birthDate.getFullYear();

    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    const dayDiff = currentDate.getDate() - birthDate.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return ageDiff - 1 >= 18;
    }

    return ageDiff >= 18;
  }

  defaultMessage(args: ValidationArguments) {
    return 'El usuario debe tener al menos 18 años.';
  }
}
