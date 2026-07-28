import axios from 'axios';
import { runDecisionEngine } from '../engine/decisionEngine';

const STORAGE_KEY_API_URL = 'cloudpilot_api_gateway_url';
export const DEFAULT_API_URL = 'https://paste-your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod';

export function getStoredApiUrl() {
  return localStorage.getItem(STORAGE_KEY_API_URL) || DEFAULT_API_URL;
}

export function setStoredApiUrl(url) {
  localStorage.setItem(STORAGE_KEY_API_URL, (url || '').trim());
}

export function createApiClient() {
  const baseURL = getStoredApiUrl();
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });
}

export async function submitWorkloadAnalysis(payload) {
  const currentUrl = getStoredApiUrl();

  const isPlaceholder =
    !currentUrl ||
    currentUrl.includes('paste-your-api') ||
    currentUrl.includes('paste your api') ||
    currentUrl.trim() === '';

  if (isPlaceholder) {
    console.warn('[CloudPilot API] Using local Decision Engine simulation (API URL is set to default placeholder).');
    const localResult = runDecisionEngine(payload);
    return { result: localResult, usedApi: false };
  }

  try {
    const client = createApiClient();
    const response = await client.post('/analyze', payload);
    if (response.data && response.data.multiCloud) {
      return { result: response.data, usedApi: true };
    } else {
      const localResult = runDecisionEngine(payload);
      return { result: localResult, usedApi: true };
    }
  } catch (err) {
    console.error('[CloudPilot API] API call failed:', err);
    const fallbackResult = runDecisionEngine(payload);
    return {
      result: fallbackResult,
      usedApi: false,
      errorDetail: `API call failed (${err.message || 'Network Error'}). Displaying deterministic local evaluation.`
    };
  }
}

export async function askAIMentor(question, contextResult) {
  const currentUrl = getStoredApiUrl();
  const isPlaceholder =
    !currentUrl ||
    currentUrl.includes('paste-your-api') ||
    currentUrl.includes('paste your api') ||
    currentUrl.trim() === '';

  if (!isPlaceholder) {
    try {
      const client = createApiClient();
      const res = await client.post('/mentor/chat', { question, context: contextResult });
      if (res.data && res.data.answer) {
        return res.data.answer;
      }
    } catch (e) {
      console.warn('[CloudPilot API] Mentor endpoint error, generating simulated response.');
    }
  }

  return generateSimulatedMentorResponse(question, contextResult);
}

function generateSimulatedMentorResponse(question, context) {
  const q = (question || '').toLowerCase();
  const title = context?.projectTitle || 'your workload';
  const rec = context?.multiCloud?.recommendedProvider || 'AWS';

  if (q.includes('why lambda') || q.includes('lambda')) {
    return `AWS Lambda is recommended for ${title} because it provides automatic scale-from-zero execution. You pay strictly for execution milliseconds rather than 24/7 server uptime, eliminating idle compute costs while keeping sub-100ms response times.`;
  }
  if (q.includes('why dynamodb') || q.includes('dynamodb')) {
    return `Amazon DynamoDB provides predictable single-digit millisecond latency at any scale with zero database server administration. Its On-Demand capacity mode automatically handles traffic spikes while guaranteeing high availability across multiple availability zones.`;
  }
  if (q.includes('cost') || q.includes('reduce')) {
    return `To reduce estimated monthly costs for ${title}:\n1. Ensure CloudFront CDN caching is enabled to intercept repetitive read traffic before reaching API Gateway.\n2. Utilize AWS Bedrock Provisioned Throughput for high-volume inference or set maximum token limits.\n3. Utilize DynamoDB On-Demand capacity for unpredictable workloads.`;
  }
  if (q.includes('azure') || q.includes('gcp')) {
    return `While ${rec} scored highest for ${title}, Azure AI Foundry and GCP Vertex AI remain viable options. Azure excels in enterprise Active Directory integration, while GCP leads in raw GKE Kubernetes operational simplicity. However, AWS scored higher overall due to lower baseline serverless costs and Bedrock multi-model availability.`;
  }
  if (q.includes('traffic doubles') || q.includes('scale')) {
    return `If traffic for ${title} doubles, your serverless architecture automatically scales without manual intervention. API Gateway throttling limits can be increased to 10,000+ RPS, and Lambda concurrent execution limits can be auto-scaled. Estimated cost will scale linearly with requests, remaining significantly cheaper than over-provisioned EC2 clusters.`;
  }

  return `Great question! For ${title}, our Bedrock Decision Graph carefully weighs latency requirements, compliance constraints, and monthly budget. The selected ${rec} deployment architecture ensures optimal cost efficiency while maintaining strict reliability and automated Infrastructure-as-Code provisioning.`;
}
