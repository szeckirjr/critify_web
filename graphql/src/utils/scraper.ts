import axios from 'axios';
import {
  AlbumType,
  ArtistType,
  AwaitingReviewType,
  CriticReviewType,
  UserReviewType,
} from '../types';
import { getCleanName } from './functions';
import * as cheerio from 'cheerio';
import { Element } from 'cheerio';

const artists_to_ignore = ['christopher-atkins'];

const url_to_fix: { [key: string]: string } = {
  'https://www.metacritic.com/music/the-dream/alt-j':
    'https://www.metacritic.com/music/dream/alt-j',
  'https://www.metacritic.com/music/huncho-jack-jack-huncho/travis-scott':
    'https://www.metacritic.com/music/huncho-jack-jack-huncho/huncho-jack',
};

// Async function which scrapes the data
export async function scrapeArtist(
  artistName: string,
): Promise<ArtistType | undefined> {
  if (artists_to_ignore.includes(getCleanName(artistName))) {
    return undefined;
  }

  const artistInfo: ArtistType = {
    name: '',
    avgCareerScore: 0,
    albumNames: [],
  };
  const url = [
    'https://www.metacritic.com/person/',
    getCleanName(artistName),
    '?filter-options=music',
  ].join('');

  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    artistInfo.name = $('#main .person_title').text().trim();
    const tempAvgCareerScore = $('#main .review_average .textscore')
      .text()
      .trim();
    artistInfo.avgCareerScore = parseInt(tempAvgCareerScore) || 0; 

    $('#main .credits tbody tr')
      .toArray()
      .forEach((el: Element) =>
        artistInfo.albumNames.push($('a', el).text().trim()),
      );

    return artistInfo.name ? artistInfo : undefined;
  } catch (err) {
    console.log('Could not find', url);
    //console.log(err);
    return undefined;
  }
}

/**
 * This function takes in an album name and an artist name
 * and scrapes their metacritic page to get all critic reviews
 * @param albumName
 * @param artistName
 * @returns reviewList: CriticReview[]
 */

async function scrapeCriticReviews(albumName: string, artistName: string) {
  try {
    let url = [
      'https://www.metacritic.com/music/',
      getCleanName(albumName),
      '/',
      getCleanName(artistName),
    ].join('');

    if (url in url_to_fix) {
      url = url_to_fix[url];
    }
    url = [url, '/critic-reviews'].join('');

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const reviewList: CriticReviewType[] = [];

    $('#main .critic_reviews_module .body ol.critic_reviews li.critic_review')
      .toArray()
      .forEach((el: Element) => {
        const criticReview: CriticReviewType = {
          score: 0,
          critic: '',
          summary: '',
          date: '',
          url: '',
        };
        criticReview.score = parseInt($(
          '.review_content .review_stats .review_grade .metascore_w',
          el,
        ).text()) || 0;
        criticReview.critic = $(
          '.review_content .review_stats .review_critic .source',
          el,
        ).text();
        criticReview.summary = $('.review_content .review_body', el)
          .text()
          .trim();
        criticReview.date = $(
          '.review_content .review_stats .review_critic .date',
          el,
        ).text();
        criticReview.url =
          $('.review_content .review_actions .full_review a', el).attr(
            'href',
          ) ?? '';
        reviewList.push(criticReview);
      });

    return reviewList;
  } catch (err) {
    //console.log(err);
    return [];
  }
}

/**
 * This function takes in an album name and an artist name
 * and scrapes their metacritic page to get all user reviews
 * @param albumName
 * @param artistName
 * @returns
 */

async function scrapeUserReviews(albumName: string, artistName: string) {
  try {
    let url = [
      'https://www.metacritic.com/music/',
      getCleanName(albumName),
      '/',
      getCleanName(artistName),
    ].join('');
    if (url in url_to_fix) {
      url = url_to_fix[url];
    }
    url = [url, '/user-reviews'].join('');

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const reviewList: UserReviewType[] = [];

    $('#main .user_reviews_module .body ol.user_reviews li.user_review')
      .toArray()
      .forEach((el: Element) => {
        const userReview: UserReviewType = {
          score: 0,
          username: '',
          content: '',
          date: '',
          thumbsUp: 0,
          thumbsTotal: 0,
        };
        userReview.score = parseFloat($(
          '.review_content .review_stats .review_grade .metascore_w',
          el,
        ).text()) || 0;
        userReview.username = $(
          '.review_content .review_stats .review_critic .name a',
          el,
        ).text();
        userReview.content = $('.review_content .review_body span', el)
          .text()
          .trim();
        userReview.date = $(
          '.review_content .review_stats .review_critic .date',
          el,
        ).text();
        userReview.thumbsUp = parseInt($(
          '.review_content .review_actions .review_helpful .helpful_summary .total_ups',
          el,
        ).text()) || 0;
        userReview.thumbsTotal = parseInt($(
          '.review_content .review_actions .review_helpful .helpful_summary .total_thumbs',
          el,
        ).text()) || 0;
        reviewList.push(userReview);
      });

    return reviewList;
  } catch (err) {
    //console.log(err);
    return [];
  }
}

/**
 * This function takes in an album name and an artist name
 * and scrapes the album's metacritic page to get info on it
 * @param albumName
 * @param artistName
 * @returns
 */

export async function scrapeAlbumInfo(
  albumName: string,
  artistName: string,
): Promise<AlbumType> {
  const albumInfo: AlbumType = {
    title: '',
    artistName: '',
    score: 0,
    releaseDate: '',
    image: '',
    criticReviewCount: 0,
    userScore: 0,
    userRatingCount: 0,
    summary: '',
    recordLabel: '',
    genres: [],
    awardsAndRankings: [],
    criticReviews: [],
    userReviews: [],
  };

  let url = [
    'https://www.metacritic.com/music/',
    getCleanName(albumName),
    '/',
    getCleanName(artistName),
  ].join('');

  if (url in url_to_fix) {
    url = url_to_fix[url];
  }
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    albumInfo.title = $('.product_title a span h1').text();

    albumInfo.artistName = $('.product_artist a span').text();

    const tempScore: number = parseInt($(
      '.main_details .score_summary .metascore_w span',
    ).text());
    if (tempScore) albumInfo.score = tempScore;
    if (!tempScore) {
      const awaitingCount = $('.main_details .score_summary .summary .connect4_msg')
        .text()
        .match(/Awaiting (\d)* more review/);
      const tempAwaitingScore: AwaitingReviewType = {
        awaitingCount: awaitingCount ? awaitingCount[1] as unknown as number : 0,
        reviewCount: parseInt($('.main_details .score_summary .summary .count a span')
          .text()
          .trim()) || 0,
        description: $('.main_details .score_summary .summary .desc')
          .text()
          .trim(),
      };
      albumInfo.scoreAwaitingReview = tempAwaitingScore;
    }

    albumInfo.releaseDate = $(
      '#main .product_split .left .product_content_head .product_data .release',
    )
      .children()
      .last()
      .text();

    albumInfo.image =
      $(
        '#main .product_split .left .product_data_summary .has_image .product_image img',
      ).attr('src') ?? '';

    $('#main .product_split .right .list_rankings .body .rankings tbody tr')
      .toArray()
      .forEach((el: Element) => {
        albumInfo.awardsAndRankings.push(
          $('.ranking_wrap .ranking_title a', el).text(),
        );
      });

    albumInfo.criticReviewCount = parseInt($(
      '.main_details .score_summary .summary .count a span[itemprop="reviewCount"]',
    )
      .text()
      .trim());

    albumInfo.userScore = $(
      '.side_details .score_summary .metascore_anchor .metascore_w',
    ).text() as unknown as number;

    albumInfo.userRatingCount = $(
      '.side_details .score_summary .summary p .count a',
    )
      .text()
      .replace(/ Ratings/g, '') as unknown as number;

    albumInfo.summary = $(
      '.product_details .main_details .summary_details .summary_detail .data span[itemprop=\'description\']',
    ).text();

    albumInfo.recordLabel = $(
      '.product_details .side_details .summary_details .summary_detail span:contains("Record Label")',
    )
      .next()
      .text()
      .replace(/Record Label:/g, '')
      .trim();

    $(
      '.product_details .side_details .summary_details .summary_detail span:contains("Genre(s):")',
    )
      .parent()
      .children()
      .toArray()
      .forEach((el: Element) => {
        if ($(el).text() !== 'Genre(s): ') albumInfo.genres.push($(el).text());
      });

    albumInfo.criticReviews = await scrapeCriticReviews(albumName, artistName);
    albumInfo.userReviews = await scrapeUserReviews(albumName, artistName);

    return albumInfo;
  } catch (err) {
    //console.log(err);
    return {
      title: albumName,
      artistName,
      score: 0,
      releaseDate: 'No release date found',
      image:
        'https://www.escapeauthority.com/wp-content/uploads/2116/11/No-image-found.jpg',
      criticReviewCount: 0,
      userScore: 0,
      userRatingCount: 0,
      summary: '',
      recordLabel: '',
      genres: [],
      awardsAndRankings: [],
      criticReviews: [],
      userReviews: [],
    };
  }
}
