// Define your models here.
export const models = [
  {
    label: 'Grok 2',
    name: 'Grok-beta',
    description: 'Truth-seeking AI and real-time data from X',
    maxTokens: 72000,
    temperature: 0,
  },
] as const;

export const DEFAULT_MODEL_NAME: Model['name'] = 'Grok-beta';

export type Model = (typeof models)[number];
