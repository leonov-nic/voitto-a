export const CreateStoreHouseValidationMessage = {
  name: {
    invalidFormat: 'Name must be a valid string',
  },
  company: {
    invalidFormat: 'Company must be a valid string',
  },
  characteristics: {
    invalidFormat: 'Characteristics must be a valid string',
  },
  size: {
    invalidFormat: 'Size must be a number',
  },
  diameter: {
    invalidFormat: 'Diameter must be a number',
  },
  type: {
    invalidFormat: 'Type of storehouse must be a valid string',
  },
  price: {
    invalidFormat: 'Price must be a number',
  },
} as const;
