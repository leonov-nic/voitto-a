export const CreateDetailValidationMessage = {
  shortName: {
    invalidFormat: 'ShortName must be a valid string',
  },
  longName: {
    invalidFormat: 'LongName must be a valid string',
  },
  normOfMinute: {
    invalidFormat: 'NormOfMinute must be a number',
  },
  customer: {
    invalidFormat: 'Customer must be a valid string',
  }
} as const;
