// Define your models here.
export const models = [
  {
    label: 'Grok-beta',
    name: 'Grok-beta',
    description: 'Real-time data from X and truth seeking AI',
  },
  {
    label: 'GPT 4o mini',
    name: 'gpt-4o-mini',
    description: 'Small model for fast, lightweight tasks',
  },
] as const;

export const DEFAULT_MODEL_NAME: Model['name'] = 'Grok-beta';

export type Model = (typeof models)[number];
