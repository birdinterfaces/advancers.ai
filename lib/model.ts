// Define your models here.
export const models = [
  {
    label: 'Grok-beta',
    name: 'Grok-beta',
    description: 'Truth-seeking AI with real-time data and image understanding',
    maxTokens: 72000,
    temperature: 0,
    vision: true,
    supportedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFileSize: 5 * 1024 * 1024,
  },
] as const;

export const DEFAULT_MODEL_NAME: Model['name'] = 'Grok-beta';

export type Model = (typeof models)[number];
