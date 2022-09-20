import { extendType, nonNull, objectType, stringArg } from 'nexus';
import { getCleanName, numDaysBetween } from '../../utils/functions';
import { scrapeAlbumInfo } from '../../utils/scraper';
import { getAuth } from 'firebase/auth';
import { get, ref, set } from 'firebase/database';

export const CriticReview = objectType({
  name: 'CriticReview',
  definition(t) {
    t.int('score');
    t.string('critic');
    t.string('summary');
    t.string('date');
    t.string('url');
  },
});
export type CriticReviewType = {
  score: number
  critic: string
  summary: string
  date: string
  url: string
}

export const UserReview = objectType({
  name: 'UserReview',
  definition(t) {
    t.float('score');
    t.string('username');
    t.string('content');
    t.string('date');
    t.int('thumbsUp');
    t.int('thumbsTotal');
  },
});
export type UserReviewType = {
  score: number
  username: string
  content: string
  date: string
  thumbsUp: number
  thumbsTotal: number
}

export const AwaitingReview = objectType({
  name: 'AwaitingReview',
  definition(t) {
    t.int('reviewCount');
    t.int('awaitingCount');
    t.string('description');
  },
});
export type AwaitingReviewType = {
  reviewCount: number
  awaitingCount: number
  description: string
}

export const Album = objectType({
  name: 'Album',
  definition(t) {
    t.string('title');
    t.string('artistName');
    t.int('score');
    t.string('releaseDate');
    t.string('image');
    t.int('criticReviewCount');
    t.float('userScore');
    t.int('userRatingCount');
    t.string('summary');
    t.string('recordLabel');
    t.list.string('genres');
    t.list.string('awardsAndRankings');
    t.list.field('criticReviews', { type: CriticReview });
    t.list.field('userReviews', { type: UserReview });
  },
});
export type AlbumType = {
  title: string
  artistName: string
  score: number
  scoreAwaitingReview?: AwaitingReviewType
  releaseDate: string
  image: string
  criticReviewCount: number
  userScore: number
  userRatingCount: number
  summary: string
  recordLabel: string
  genres: string[]
  awardsAndRankings: string[]
  criticReviews: CriticReviewType[]
  userReviews: UserReviewType[]
}

export const AlbumResponse = objectType({
  name: 'AlbumResponse',
  definition(t) {
    t.field('status', { type: 'status' });
    t.string('message');
    t.field('data', { type: Album });
  },
});

export const AlbumQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getMetaAlbum', {
      type: AlbumResponse,
      description: 'Get a Metacritic album by name',
      args: {
        title: nonNull(stringArg()),
        artistName: nonNull(stringArg()),
      },
      resolve: async (_, { title, artistName }, { db }) => {
        const user = getAuth().currentUser;
        if (!user) return { status: 'error', message: 'Invalid credentials' };

        const albumRef = ref(db, `metaAlbums/${getCleanName(artistName)}/${getCleanName(title)}`);
        const dataSnapshot = await get(albumRef);
        if (dataSnapshot.exists() && numDaysBetween(new Date(dataSnapshot.val().lastUpdated), new Date()) < 7) {
          return {
            status: 'success',
            message: `Album queried from remote database by ${user.displayName}`,
            data: dataSnapshot.val(),
          };
        }

        const scrapedAlbum = await scrapeAlbumInfo(title, artistName);
        if (scrapedAlbum) {
          const albumObj = {...scrapedAlbum, lastUpdated: new Date().toISOString()};
          set(albumRef, albumObj);
          return {
            status: 'success',
            message: `Album successfully scraped by ${user.displayName}`,
            data: albumObj,
          };
        }

        return { status: 'error', message: 'Album not found' };
      },
    });
  },
});
