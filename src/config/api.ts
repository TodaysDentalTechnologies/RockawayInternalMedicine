/**
 * API configuration.
 *
 * Endpoints point to the shivashamtoub CDK deployment (AWS account 310971188857),
 * the same environment behind the Center for Primary Care site:
 *   - TodaysDentalInsightsCallbackS1 → Callback REST API (api.shivashamtoub.flowance.ai/callback/{clinicId})
 *   - TodaysDentalInsightsAiAgentsS1 → AI Agent WebSocket chat (wss.shivashamtoub.flowance.ai/ai-agents)
 *
 * Backend clinic IDs: the Jamaica office is "rockawayinternalmedicine" and the
 * Cambria Heights office is "2020medicalcenter" (219-15 Linden Blvd). The site's
 * location IDs map onto those below.
 */

// AI agent for this site in the TodaysDentalInsightsAiAgentsS1-AiAgent table
export const AI_CLINIC_ID = '2020medicalcenter'
export const AI_AGENT_ID = '7bf043fa-8e74-4526-9602-7f632a5edf88'

export const API_CONFIG = {
  // Callback API — POST /callback/{clinicId} creates an appointment/callback record
  CALLBACK_API: 'https://api.shivashamtoub.flowance.ai/callback',

  // WebSocket API — AI chatbot (clinicId + agentId are required query params)
  WEBSOCKET_API: `wss://wss.shivashamtoub.flowance.ai/ai-agents?clinicId=${AI_CLINIC_ID}&agentId=${AI_AGENT_ID}`,
}

// Site location id → backend clinicId (callback table / clinic-config key)
const BACKEND_CLINIC_IDS: Record<string, string> = {
  rockawayinternalmedicine: 'rockawayinternalmedicine',
  'rockaway-cambria-heights': '2020medicalcenter',
}

export function callbackUrl(locationId: string): string {
  const clinicId = BACKEND_CLINIC_IDS[locationId] ?? 'rockawayinternalmedicine'
  return `${API_CONFIG.CALLBACK_API}/${clinicId}`
}
