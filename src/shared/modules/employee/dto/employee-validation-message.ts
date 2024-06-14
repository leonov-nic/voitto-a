export const CreateEmployeeValidationMessage = {
  familyName: {
    invalidFormat: 'FamilyName must be a valid string',
  },
  registrationNumber: {
    invalidFormat: 'RegistrationNumber must be a number',
  },
  mainJob: {
    invalidFormat: 'Job must be a valid string',
  },
  masterId: {
    invalidFormat: 'MasterId must be a valid string',
  }
} as const;
