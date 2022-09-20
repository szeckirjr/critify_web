import { makeSchema } from 'nexus';
// import { DateTimeResolver } from 'graphql-scalars'
import * as types from './types';

// export const DateTime = asNexusMethod(DateTimeResolver, 'date')

export const schema = makeSchema({
  types,
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
});
