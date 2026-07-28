export function runDecisionEngine(input) {
  const isExisting = 'currentCloudProvider' in input;
  const existingInput = isExisting ? input : null;

  // 1. Calculate Multi-Cloud Weighted Scores
  const multiCloud = calculateMultiCloudScores(input);

  // 2. Select Architecture Pattern & Services
  const architecture = selectArchitecturePattern(input, multiCloud.recommendedProvider);

  // 3. Generate Architecture Intelligence Report
  const report = generateIntelligenceReport(input, multiCloud, architecture);

  // 4. Generate Infrastructure-as-Code (AWS SAM Template)
  const samTemplate = generateSamTemplate(input, architecture);

  // 5. Generate Visual Nodes & Links for Architecture Canvas
  const { visualNodes, visualLinks } = buildVisualGraph(input, architecture, multiCloud.recommendedProvider);

  return {
    id: input.id || `proj_${Date.now()}`,
    timestamp: new Date().toISOString(),
    projectTitle: input.projectTitle || 'Untitled AI Workload',
    isExistingReview: isExisting,
    rawInput: input,
    multiCloud,
    architecture,
    report,
    samTemplate,
    visualNodes,
    visualLinks
  };
}

function calculateMultiCloudScores(input) {
  const isExisting = 'currentCloudProvider' in input;
  const currentCloud = isExisting ? input.currentCloudProvider : null;

  let awsScore = 75;
  let azureScore = 70;
  let gcpScore = 68;

  const scoreBreakdown = [
    {
      category: 'AI & Foundation Models',
      weight: 20,
      awsScore: input.needsAI ? 95 : 75,
      azureScore: input.needsAI ? 90 : 70,
      gcpScore: input.needsAI ? 88 : 72,
      reasoning: input.needsAI
        ? 'AWS Bedrock offers single API access to Claude 3.5, Llama 3, Titan, and custom fine-tuning with zero data exposure. Azure AI Foundry provides OpenAI GPT-4o, and GCP Vertex offers Gemini 1.5.'
        : 'General computing services are well balanced across all three clouds.'
    },
    {
      category: 'Cost & Pricing Efficiency',
      weight: 15,
      awsScore: input.monthlyBudget === 'Less than $500/month' ? 90 : 80,
      azureScore: input.monthlyBudget === 'Less than $500/month' ? 78 : 82,
      gcpScore: input.monthlyBudget === 'Less than $500/month' ? 85 : 85,
      reasoning:
        input.monthlyBudget === 'Less than $500/month'
          ? 'AWS Lambda, DynamoDB free tier, and CloudFront provide the lowest baseline operating cost for serverless workloads.'
          : 'GCP and AWS provide strong sustained-use and savings plans discounts at scale.'
    },
    {
      category: 'Scalability & Operational Simplicity',
      weight: 15,
      awsScore: input.serverlessPreference === 'Yes' ? 96 : 82,
      azureScore: input.serverlessPreference === 'Yes' ? 82 : 85,
      gcpScore: input.serverlessPreference === 'Yes' ? 88 : 86,
      reasoning:
        input.serverlessPreference === 'Yes'
          ? 'AWS lead in serverless maturity with API Gateway, Lambda, DynamoDB, and EventBridge.'
          : 'Containerized options (EKS/AKS/GKE) are comparable, with GKE leading in automated Kubernetes management.'
    },
    {
      category: 'Compliance & Governance',
      weight: 15,
      awsScore: input.complianceRequirements?.includes('HIPAA') || input.complianceRequirements?.includes('PCI DSS') ? 95 : 85,
      azureScore: input.complianceRequirements?.includes('ISO 27001') || input.complianceRequirements?.includes('SOC 2') ? 92 : 88,
      gcpScore: input.complianceRequirements?.includes('GDPR') ? 90 : 82,
      reasoning: `Targeting compliance [${input.complianceRequirements?.join(', ') || 'Standard'}]. AWS has HIPAA BAA & PCI DSS 1 certified services in all primary regions.`
    },
    {
      category: 'Regional Availability & Latency',
      weight: 15,
      awsScore: input.targetRegion?.includes('Mumbai') || input.targetRegion?.includes('US East') ? 94 : 85,
      azureScore: input.targetRegion?.includes('Europe') ? 90 : 82,
      gcpScore: input.targetRegion?.includes('Global') ? 92 : 80,
      reasoning: `Target region: ${input.targetRegion}. AWS provides multi-AZ fault tolerance in 33+ geographical regions.`
    },
    {
      category: 'Existing Ecosystem & Friction',
      weight: 20,
      awsScore: currentCloud === 'AWS' ? 98 : 75,
      azureScore: currentCloud === 'Azure' ? 98 : 70,
      gcpScore: currentCloud === 'GCP' ? 98 : 72,
      reasoning: currentCloud
        ? `Workload is currently deployed on ${currentCloud}. Migrating across cloud providers incurs egress costs and staff retraining.`
        : 'New deployment project with clean slate architectural choice.'
    }
  ];

  let awsTotal = 0;
  let azureTotal = 0;
  let gcpTotal = 0;
  let totalWeight = 0;

  scoreBreakdown.forEach((c) => {
    awsTotal += c.awsScore * c.weight;
    azureTotal += c.azureScore * c.weight;
    gcpTotal += c.gcpScore * c.weight;
    totalWeight += c.weight;
  });

  awsTotal = Math.round(awsTotal / totalWeight);
  azureTotal = Math.round(azureTotal / totalWeight);
  gcpTotal = Math.round(gcpTotal / totalWeight);

  let recommendedProvider = 'AWS';
  if (azureTotal > awsTotal && azureTotal > gcpTotal) {
    recommendedProvider = 'Azure';
  } else if (gcpTotal > awsTotal && gcpTotal > azureTotal) {
    recommendedProvider = 'GCP';
  }

  const aiExplanation = `Based on your application requirements (${input.applicationType}, ${input.needsAI ? 'AI Enabled' : 'Standard'}, ${input.monthlyBudget}), ${recommendedProvider} scores highest (${
    recommendedProvider === 'AWS' ? awsTotal : recommendedProvider === 'Azure' ? azureTotal : gcpTotal
  }/100). AWS Bedrock offers seamless managed foundation model inference combined with AWS Lambda and DynamoDB serverless architecture, keeping operational overhead low while satisfying ${input.complianceRequirements?.join(', ') || 'standard'} security rules.`;

  return {
    awsTotal,
    azureTotal,
    gcpTotal,
    recommendedProvider,
    scoreBreakdown,
    aiExplanation
  };
}

function selectArchitecturePattern(input, provider) {
  const isAI = input.needsAI;
  const isServerless = input.serverlessPreference === 'Yes' || input.serverlessPreference === 'No Preference';
  const isHighTraffic = input.expectedTraffic?.includes('High') || input.expectedTraffic?.includes('Enterprise');

  if (isAI && isServerless) {
    return {
      patternName: 'Serverless AI Agent Orchestration',
      description:
        'Event-driven serverless architecture leveraging managed AI services (Amazon Bedrock Agents / Azure AI Foundry / Vertex AI) fronted by scalable API Gateways and NoSQL databases.',
      deploymentComplexity: 'Low',
      awsServices: [
        { name: 'Amazon Bedrock / Bedrock Agents', category: 'AI Inference', monthlyCost: 45, reason: 'Managed AI LLM invocation & agent reasoning' },
        { name: 'AWS Lambda', category: 'Compute', monthlyCost: 15, reason: 'Serverless microservices business logic' },
        { name: 'Amazon API Gateway', category: 'API Ingress', monthlyCost: 10, reason: 'REST & WebSocket API proxy' },
        { name: 'Amazon DynamoDB', category: 'Database', monthlyCost: 12, reason: 'On-demand single-digit ms session state' },
        { name: 'Amazon CloudFront & S3', category: 'CDN & Storage', monthlyCost: 8, reason: 'Static UI hosting & doc assets' },
        { name: 'AWS IAM & CloudWatch', category: 'Security & Logs', monthlyCost: 5, reason: 'Fine-grained access & observability' }
      ],
      azureServices: [
        { name: 'Azure AI Foundry / OpenAI Service', category: 'AI Inference', monthlyCost: 55, reason: 'GPT-4o & embedding models' },
        { name: 'Azure Functions', category: 'Compute', monthlyCost: 18, reason: 'Serverless event-driven execution' },
        { name: 'Azure API Management', category: 'API Ingress', monthlyCost: 25, reason: 'Gateway routing and auth' },
        { name: 'Azure Cosmos DB', category: 'Database', monthlyCost: 24, reason: 'Global NoSQL storage' },
        { name: 'Azure Blob Storage & CDN', category: 'Storage', monthlyCost: 10, reason: 'Static assets & file uploads' }
      ],
      gcpServices: [
        { name: 'Vertex AI / Gemini API', category: 'AI Inference', monthlyCost: 48, reason: 'Gemini 1.5 Pro & Vector Search' },
        { name: 'Cloud Run / Functions', category: 'Compute', monthlyCost: 16, reason: 'Containerized serverless scale-to-zero' },
        { name: 'GCP API Gateway', category: 'API Ingress', monthlyCost: 12, reason: 'Managed OpenAPI gateway' },
        { name: 'Firestore / Bigtable', category: 'Database', monthlyCost: 15, reason: 'Document store for user chats' },
        { name: 'Cloud Storage & Cloud CDN', category: 'Storage', monthlyCost: 9, reason: 'Asset bucket & edge caching' }
      ]
    };
  }

  if (isHighTraffic) {
    return {
      patternName: 'Managed Containerized Microservices',
      description:
        'Containerized architecture on managed Kubernetes/ECS with auto-scaling, dedicated database clusters, and container registry.',
      deploymentComplexity: 'Medium',
      awsServices: [
        { name: 'Amazon ECS / Fargate', category: 'Compute', monthlyCost: 120, reason: 'Serverless container orchestration' },
        { name: 'Amazon Bedrock', category: 'AI Service', monthlyCost: 60, reason: 'LLM completion backend' },
        { name: 'Amazon Aurora PostgreSQL', category: 'Database', monthlyCost: 90, reason: 'Auto-scaling relational store' },
        { name: 'Amazon ElastiCache Redis', category: 'Cache', monthlyCost: 40, reason: 'In-memory response caching' },
        { name: 'Application Load Balancer', category: 'Networking', monthlyCost: 25, reason: 'Traffic routing & TLS offload' }
      ],
      azureServices: [
        { name: 'Azure Kubernetes Service (AKS)', category: 'Compute', monthlyCost: 140, reason: 'Managed K8s cluster' },
        { name: 'Azure OpenAI Service', category: 'AI Service', monthlyCost: 65, reason: 'AI reasoning endpoint' },
        { name: 'Azure SQL Database', category: 'Database', monthlyCost: 95, reason: 'Managed relational DB' }
      ],
      gcpServices: [
        { name: 'Google Kubernetes Engine (GKE)', category: 'Compute', monthlyCost: 130, reason: 'Industry leading K8s' },
        { name: 'Vertex AI', category: 'AI Service', monthlyCost: 55, reason: 'Gemini API' },
        { name: 'Cloud SQL PostgreSQL', category: 'Database', monthlyCost: 85, reason: 'Managed SQL database' }
      ]
    };
  }

  return {
    patternName: 'Modern Jamstack & Serverless Web',
    description:
      'Ultra-fast frontend distribution via global CDN backed by serverless microservices and on-demand database.',
    deploymentComplexity: 'Low',
    awsServices: [
      { name: 'AWS Lambda', category: 'Compute', monthlyCost: 12, reason: 'On-demand execution' },
      { name: 'Amazon API Gateway', category: 'Gateway', monthlyCost: 8, reason: 'API Ingress' },
      { name: 'Amazon DynamoDB', category: 'Database', monthlyCost: 10, reason: 'Pay-per-request NoSQL' },
      { name: 'Amazon CloudFront & S3', category: 'CDN', monthlyCost: 6, reason: 'Global edge distribution' }
    ],
    azureServices: [
      { name: 'Azure Static Web Apps', category: 'CDN/Hosting', monthlyCost: 10, reason: 'Fullstack hosting' },
      { name: 'Azure Functions', category: 'Compute', monthlyCost: 12, reason: 'Serverless API' },
      { name: 'Azure Cosmos DB', category: 'Database', monthlyCost: 15, reason: 'NoSQL storage' }
    ],
    gcpServices: [
      { name: 'Cloud Run', category: 'Compute', monthlyCost: 14, reason: 'Scale to zero containers' },
      { name: 'Firestore', category: 'Database', monthlyCost: 12, reason: 'Real-time database' }
    ]
  };
}

function generateIntelligenceReport(input, multiCloud, arch) {
  const isExisting = 'currentCloudProvider' in input;
  const existingInput = isExisting ? input : null;

  const totalAwsCost = arch.awsServices.reduce((acc, s) => acc + s.monthlyCost, 0);

  let engineeringDiagnosis = 'Well-Architected';
  let potentialSavings = 0;
  const recommendations = [];

  if (isExisting && existingInput) {
    if (existingInput.currentServices?.includes('Amazon EC2') && input.serverlessPreference === 'Yes') {
      engineeringDiagnosis = 'Over-engineered';
      potentialSavings = 65;
      recommendations.push('Replace EC2 virtual machines with AWS Lambda / Bedrock serverless endpoints to cut compute overhead by ~60%.');
    }
    if (existingInput.currentServices?.includes('Amazon RDS') && input.expectedTraffic?.includes('Low')) {
      potentialSavings += 40;
      recommendations.push('Migrate RDS relational instance to DynamoDB On-Demand to avoid paying for idle DB instance hours.');
    }
    if (existingInput.currentServices?.includes('Amazon SageMaker') && input.needsAI) {
      recommendations.push('Switch custom SageMaker self-hosted endpoint to Amazon Bedrock managed API to eliminate GPU instance hosting fees.');
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('Adopt AWS Lambda + API Gateway for zero idle costs during low traffic hours.');
    recommendations.push('Enable DynamoDB Auto-scaling or On-Demand pricing to match traffic bursts seamlessly.');
    recommendations.push('Use Amazon CloudFront CDN caching to reduce API Gateway request volume by up to 40%.');
    recommendations.push('Configure AWS Secrets Manager for automated API key rotation and strict compliance audits.');
  }

  return {
    patternScore: 94,
    cloudFitScore: multiCloud.awsTotal,
    operationalComplexity: arch.deploymentComplexity,
    engineeringDiagnosis,
    estimatedMonthlyCost: totalAwsCost,
    potentialSavings,
    futureGrowthOutlook: 'Excellent',
    recommendations,
    suitabilityReasoning: `The recommended ${arch.patternName} pattern eliminates unneeded infrastructure management while ensuring high resilience and compliance with ${input.complianceRequirements?.join(', ') || 'standard'} framework.`
  };
}

function generateSamTemplate(input, arch) {
  const titleSlug = (input.projectTitle || 'cloudpilot-app').toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: >
  CloudPilot / CloudCompass AI Generated Infrastructure Template
  Project: ${input.projectTitle || 'AI Workload'}
  Pattern: ${arch.patternName}

Globals:
  Function:
    Timeout: 30
    MemorySize: 512
    Runtime: nodejs20.x
    Architectures:
      - arm64
    Environment:
      Variables:
        STAGE: prod
        BEDROCK_REGION: ${input.targetRegion?.includes('Mumbai') ? 'ap-south-1' : 'us-east-1'}

Resources:
  # --- Storage & Asset Distribution ---
  AppBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "\${AWS::StackName}-assets-\${AWS::AccountId}"
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256

  # --- Database ---
  ProjectDataTable:
    Type: AWS::Serverless::SimpleTable
    Properties:
      TableName: !Sub "\${AWS::StackName}-data"
      PrimaryKey:
        Name: PK
        Type: String
      ProvisionedThroughput:
        ReadCapacityUnits: 5
        WriteCapacityUnits: 5

  # --- API Gateway Ingress ---
  ApiGateway:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
      Cors: "'*'"
      Auth:
        DefaultAuthorizer: AWS_IAM

  # --- Serverless Compute & Bedrock AI Orchestrator ---
  OrchestratorFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: !Sub "\${AWS::StackName}-orchestrator"
      CodeUri: src/
      Handler: app.lambdaHandler
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref ProjectDataTable
        - Statement:
            - Effect: Allow
              Action:
                - bedrock:InvokeModel
                - bedrock:InvokeModelWithResponseStream
              Resource: "*"
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /analyze
            Method: post
            RestApiId: !Ref ApiGateway

Outputs:
  ApiUrl:
    Description: "API Gateway HTTP Live Endpoint"
    Value: !Sub "https://\${ApiGateway}.execute-api.\${AWS::Region}.amazonaws.com/prod/analyze"
  DataTableName:
    Description: "DynamoDB Table Name"
    Value: !Ref ProjectDataTable
`;
}

function buildVisualGraph(input, arch, provider) {
  const visualNodes = [
    {
      id: 'client',
      label: 'End User / Client',
      service: 'Web / Mobile Client',
      provider: provider,
      type: 'client',
      description: 'HTTPS requests from browser or mobile client',
      estCost: '$0'
    },
    {
      id: 'cdn',
      label: 'Edge Network / CDN',
      service: provider === 'AWS' ? 'Amazon CloudFront' : provider === 'Azure' ? 'Azure CDN' : 'Cloud CDN',
      provider: provider,
      type: 'security',
      description: 'Global SSL termination & edge asset caching',
      estCost: '$8/mo'
    },
    {
      id: 'gateway',
      label: 'API Gateway',
      service: provider === 'AWS' ? 'Amazon API Gateway' : provider === 'Azure' ? 'Azure API Management' : 'GCP API Gateway',
      provider: provider,
      type: 'gateway',
      description: 'Request routing, auth verification, and rate limiting',
      estCost: '$10/mo'
    },
    {
      id: 'compute',
      label: 'Orchestration Engine',
      service: provider === 'AWS' ? 'AWS Lambda' : provider === 'Azure' ? 'Azure Functions' : 'Cloud Run',
      provider: provider,
      type: 'compute',
      description: 'Business logic execution and multi-cloud decision graph',
      estCost: '$15/mo'
    },
    {
      id: 'database',
      label: 'State Store',
      service: provider === 'AWS' ? 'Amazon DynamoDB' : provider === 'Azure' ? 'Azure Cosmos DB' : 'Firestore',
      provider: provider,
      type: 'database',
      description: 'Sub-10ms persistence for project specs and reports',
      estCost: '$12/mo'
    }
  ];

  if (input.needsAI) {
    visualNodes.push({
      id: 'ai_mentor',
      label: 'AI Mentor Engine',
      service: provider === 'AWS' ? 'Amazon Bedrock' : provider === 'Azure' ? 'Azure AI Foundry' : 'Vertex AI Gemini',
      provider: provider,
      type: 'ai',
      description: 'Foundation model inference for natural language explanation',
      estCost: '$45/mo'
    });
  }

  const visualLinks = [
    { source: 'client', target: 'cdn', label: 'HTTPS / TLS 1.3', protocol: 'HTTPS' },
    { source: 'cdn', target: 'gateway', label: 'REST Call', protocol: 'JSON' },
    { source: 'gateway', target: 'compute', label: 'Trigger Event', protocol: 'gRPC/Event' },
    { source: 'compute', target: 'database', label: 'Read/Write', protocol: 'NoSQL' }
  ];

  if (input.needsAI) {
    visualLinks.push({ source: 'compute', target: 'ai_mentor', label: 'Invoke LLM', protocol: 'Bedrock API' });
  }

  return { visualNodes, visualLinks };
}
