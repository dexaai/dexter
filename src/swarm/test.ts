import { z } from 'zod';

import { runSwarmRepl } from './repl.js';
import { swarmFunction, swarmHandoff } from './swarm-tools.js';

const weatherFunc = swarmFunction(
  {
    name: 'get_weather',
    description: 'Gets the weather for a given location',
    argsSchema: z.object({
      location: z
        .string()
        .describe('The city and state e.g. San Francisco, CA'),
    }),
  },
  async ({ location }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const temperature = (30 + Math.random() * 70) | 0;
    return { location, temperature };
  }
);

const weatherAgent = {
  name: 'weather',
  instructions: 'Get the weather for a given location.',
  functions: [weatherFunc],
};

const calendarFunc = swarmFunction(
  {
    name: 'get_calendar',
    description: 'Gets the calendar events for today',
    argsSchema: z.object({}),
  },
  async () => {
    return Promise.resolve(
      'Calendar events for today: Go to the central park zoo at 10am'
    );
  }
);

const calendarAgent = {
  name: 'calendar',
  instructions: 'Get the calendar events for today.',
  functions: [calendarFunc],
};

const weatherHandoff = swarmHandoff({ agent: weatherAgent });
const calendarHandoff = swarmHandoff({ agent: calendarAgent });

const dispatchAgent = {
  name: 'dispatch',
  instructions:
    'You are a helpful assistant that can dispatch tasks to other agents.',
  functions: [weatherHandoff, calendarHandoff],
};

const dispatchHandoff = swarmHandoff({
  agent: dispatchAgent,
  description:
    "Transfer to the dispatch agent if you aren't able to handle the user's request.",
});
weatherAgent.functions.push(dispatchHandoff);
calendarAgent.functions.push(dispatchHandoff);

await runSwarmRepl(dispatchAgent).catch((err) => {
  console.error(err);
  process.exit(1);
});
