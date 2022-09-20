// console.log(`You're at ${path.join(__dirname, '../.env')}`)
import path from 'path';
import { config } from 'dotenv';
import { ApolloServer } from 'apollo-server';

config({ path: path.join(__dirname, '../.env') });

import { context } from './context';
import { schema } from './schema';

const server = new ApolloServer({
  schema: schema,
  context: context,
});

server.listen(process.env.PORT || 4000).then(async ({ url }) => {
  console.log(`🚀 Server ready at: ${url}`);
});
