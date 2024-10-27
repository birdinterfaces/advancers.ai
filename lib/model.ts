// Define your models here.
export const models = [
  {
    label: 'Grok-beta',
    name: 'Grok-beta',
    description: 'Truth seeking AI and real-time data from X',
  },
] as const;

export const DEFAULT_MODEL_NAME: Model['name'] = 'Grok-beta';

export type Model = (typeof models)[number];
