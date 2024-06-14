export const CreateJobValidationMessage = {
  employeeId: {
    invalidId: 'Employee field must be a valid id',
  },
  timeFrom: {
    invalidFormat: 'TimeFrom must be a valid string',
  },
  timeTo: {
    invalidFormat: 'TimeTo must be a valid string',
  },
  detailId: {
    invalidId: 'Detail field must be a valid id',
  },
  typeOfJob: {
    invalidFormat: 'Type field must be a valid string',
  },
  extra: {
    invalidFormat: 'Extra must be a number',
  },
  quantity: {
    invalidFormat: 'Quantity must be a number',
  },
  comment: {
    invalidFormat: 'Comment must be a valid string',
    minLength: 'Minimum comment length must be 5',
    maxLength: 'Maximum comment length must be 150',
  },
  master: {
    invalidId: 'Master field must be a valid id',
  },
} as const;
