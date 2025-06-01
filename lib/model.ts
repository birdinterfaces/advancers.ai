// Define your models here.
export const models = [
  {
    label: 'Grok 3',
    name: 'grok-3',
    description: 'Latest model from xAI + Advancers Philosophy',
    maxTokens: 72000,
    temperature: 0,
    tier: 'free' as const,
  },
] as const;

export const DEFAULT_MODEL_NAME: Model['name'] = 'grok-3';

export type Model = (typeof models)[number];

// Helper function to get available models for a user tier
export function getAvailableModels(userTier: string = 'free'): Model[] {
  const tierHierarchy = {
    'free': ['free'],
    'pro': ['free', 'pro'],
    'ultimate': ['free', 'pro', 'ultimate']
  };
  
  const allowedTiers = tierHierarchy[userTier as keyof typeof tierHierarchy] || ['free'];
  return models.filter(model => allowedTiers.includes(model.tier));
}

// Helper function to check if a user can access a specific model
export function canAccessModel(modelName: Model['name'], userTier: string = 'free'): boolean {
  const model = models.find(m => m.name === modelName);
  if (!model) return false;
  
  const tierHierarchy = {
    'free': ['free'],
    'pro': ['free', 'pro'],
    'ultimate': ['free', 'pro', 'ultimate']
  };
  
  const allowedTiers = tierHierarchy[userTier as keyof typeof tierHierarchy] || ['free'];
  return allowedTiers.includes(model.tier);
}
