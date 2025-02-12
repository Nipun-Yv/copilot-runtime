import express from 'express';
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNodeHttpEndpoint,
  GoogleGenerativeAIAdapter,
} from '@copilotkit/runtime';
import { configDotenv } from 'dotenv';

configDotenv()

const app = express();
// const serviceAdapter = new GoogleGenerativeAIAdapter({
//   model: 'gemini-1.5-pro',
//   apiKey: process.env.GOOGLE_API_KEY,
// });
const serviceAdapter = new OpenAIAdapter({ apiKey: process.env.OPENAI_API_KEY});
 
app.use(express.json());

app.use('/', (req, res) => {
  res.send('Hello, World');
});

app.use('/health', (req, res) => {
  res.send('Service is up and running');
});
app.use('/copilotkit', (req, res, next) => {
  (async () => {
    const runtime = new CopilotRuntime(
        {

        remoteEndpoints: [ 
            { url: process.env.REMOTE_URL},
        ],
    }
    );
    const handler = copilotRuntimeNodeHttpEndpoint({
      endpoint: '/copilotkit',
      runtime,
      serviceAdapter,
    });
 
    return handler(req, res);
  })().catch(next);
});
 
app.listen(4000, () => {
  console.log('Listening at /copilotkit endpoint');
});
