const COST_PER_INPUT_TOKEN = 0.000005; // $5 per million tokens
const COST_PER_OUTPUT_TOKEN = 0.000015; // $15 per million tokens

// Add system prompt token count
const SYSTEM_PROMPT_TOKENS = 100; // Approximate tokens in base system prompt

export const USAGE_LIMITS = {
  free: 0.25,     // $0.10 per month
  pro: 4.00,      // $3.00 per month
  ultimate: 10.00  // $6.00 per month
} as const;

export function calculateCost(
  inputTokens: number, 
  outputTokens: number, 
  knowledgeTokens: number // New parameter for knowledge base tokens
): number {
  const totalInputTokens = inputTokens + SYSTEM_PROMPT_TOKENS + knowledgeTokens;
  const cost = (totalInputTokens * COST_PER_INPUT_TOKEN) + 
               (outputTokens * COST_PER_OUTPUT_TOKEN);
  return Number(cost.toFixed(4));
}

export function hasExceededLimit(currentUsage: number, membership: string): boolean {
  const limit = USAGE_LIMITS[membership as keyof typeof USAGE_LIMITS] || 0;
  return currentUsage >= limit;
}

export function getNextResetDate(): string {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Set to 11th of current month
  let resetDate = new Date(currentYear, currentMonth, 11);
  
  // If we're past the 11th, show next month's date
  if (now.getDate() > 11) {
    resetDate = new Date(currentYear, currentMonth + 1, 11);
  }
  
  // Format date as "11 March" (without year)
  return resetDate.toLocaleDateString('en-US', { 
    day: 'numeric',
    month: 'long'
  });
} 