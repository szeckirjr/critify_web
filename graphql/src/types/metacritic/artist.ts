import { extendType, nonNull, objectType, stringArg } from 'nexus';
import { getCleanName, numDaysBetween } from '../../utils/functions';
import { scrapeArtist } from '../../utils/scraper';
import { getAuth } from 'firebase/auth';
import { get, ref, set } from 'firebase/database';

export const Artist = objectType({
  name: 'Artist',
  definition(t) {
    t.string('name');
    t.int('avgCareerScore');
    t.list.string('albumNames');
  },
});
export type ArtistType = {
  name: string
  avgCareerScore: number
  albumNames: string[]
}

export const ArtistResponse = objectType({
  name: 'ArtistResponse',
  definition(t) {
    t.field('status', { type: 'status' });
    t.string('message');
    t.field('data', { type: Artist });
  },
});

export const ArtistQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getMetaArtist', {
      type: ArtistResponse,
      description: 'Get a Metacritic artist by name',
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_, { name }, { db }) => {
        const user = getAuth().currentUser;
        if (!user) return { status: 'error', message: 'Invalid credentials' };

        const artistRef = ref(db, `metaArtists/${getCleanName(name)}`);
        const dataSnapshot = await get(artistRef);
        if (dataSnapshot.exists() && numDaysBetween(new Date(dataSnapshot.val().lastUpdated), new Date()) <= 3 ) {
          return {
            status: 'success',
            message: `Artist queried from remote database by ${user.displayName}`,
            data: dataSnapshot.val(),
          };
        }

        const scrapedArtist = await scrapeArtist(name);
        if (scrapedArtist) {
          const artistObj = {...scrapedArtist, lastUpdated: new Date().toISOString()};
          await set(artistRef, artistObj);
          return {
            status: 'success',
            message: `Artist successfully scraped by ${user.displayName}`,
            data: artistObj,
          };
        }

        return { status: 'error', message: 'Artist not found' };
      },
    });
  },
});
