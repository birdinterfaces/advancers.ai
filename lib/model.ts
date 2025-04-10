// Define your models here.
export const models = [
  {
    label: 'Grok 3',
    name: 'grok-3-beta',
    description: 'Latest Grok model from xAI + Advancers Philosophy',
    maxTokens: 72000,
    temperature: 0,
  },
  {
    label: 'Grok 2',
    name: 'grok-2-1212',
    description: 'Standard model from xAI + Advancers Philosophy',
    maxTokens: 72000,
    temperature: 0,
  },
] as const;

export const DEFAULT_MODEL_NAME: Model['name'] = 'grok-3-beta';

export type Model = (typeof models)[number];
