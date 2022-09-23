import { Element } from "cheerio";
import * as cheerio from "cheerio";
import axios, { CancelToken } from "axios";

const artists_to_ignore = ["christopher-atkins"];

const url_to_fix = {
  "https://www.metacritic.com/music/the-dream/alt-j":
    "https://www.metacritic.com/music/dream/alt-j",
  "https://www.metacritic.com/music/huncho-jack-jack-huncho/travis-scott":
    "https://www.metacritic.com/music/huncho-jack-jack-huncho/huncho-jack",
};

export type CriticReview = {
  score: number;
  critic: string;
  summary: string;
  date: string;
  link: string;
};

export type UserReview = {
  score: number;
  username: string;
  content: string;
  date: string;
  thumbsUp: number;
  totalThumbs: number;
};

export type AwaitingReview = {
  reviewCount: number;
  awaitingCount: number;
  description: string;
};

export type Album = {
  name: string;
  score: number | AwaitingReview;
  releaseDate: string;
  image: string;
  criticReviewCount: number;
  userScore: number;
  userRatingCount: number;
  summary: string;
  recordLabel: string;
  genres: string[];
  awardsAndRankings: string[];
  criticReviews: CriticReview[];
  userReviews: UserReview[];
  status: "success" | "error";
};

export type Artist = {
  name: string;
  avgCareerScore: number;
  albumNames: string[];
  status: "success" | "error";
};

export function getCleanArtistName(artistName: string): string {
  if (!artistName) return "";
  return artistName
    .toString()
    .toLowerCase()
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/[.+]/g, "")
    .replace(/[^a-zA-Z_0-9+]/g, "-")
    .replace(/--+/g, "-");
}

export function checkSameArtistName(
  artistName1: string,
  artistName2: string
): boolean {
  return getCleanArtistName(artistName1) === getCleanArtistName(artistName2);
}

export function getCleanAlbumName(albumName: string): string {
  if (!albumName) return "";
  return albumName
    .toString()
    .toLowerCase()
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/[?[\]'().&:=]/g, "")
    .replace(/[^a-zA-Z_0-9+!]/g, "-")
    .replace(/--+/g, "-");
}

export function checkSameAlbumName(
  albumName1: string,
  albumName2: string
): boolean {
  return getCleanAlbumName(albumName1) === getCleanAlbumName(albumName2);
}

/**
 * This function takes in an album name and an artist name
 * and scrapes their metacritic page to get all critic reviews
 * @param albumName
 * @param artistName
 * @returns reviewList: CriticReview[]
 */

async function getCriticReviews(albumName: string, artistName: string) {
  try {
    let url = [
      "https://www.metacritic.com/music/",
      getCleanAlbumName(albumName),
      "/",
      getCleanArtistName(artistName),
    ].join("");
    if (url in url_to_fix) {
      url = url_to_fix[url as keyof typeof url_to_fix];
    }
    url = [url, "/critic-reviews"].join("");

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const reviewList: CriticReview[] = [];

    $("#main .critic_reviews_module .body ol.critic_reviews li.critic_review")
      .toArray()
      .forEach((el: Element) => {
        const criticReview: CriticReview = {
          score: 0,
          critic: "",
          summary: "",
          date: "",
          link: "",
        };
        criticReview.score = $(
          ".review_content .review_stats .review_grade .metascore_w",
          el
        ).text() as unknown as number;
        criticReview.critic = $(
          ".review_content .review_stats .review_critic .source",
          el
        ).text();
        criticReview.summary = $(".review_content .review_body", el)
          .text()
          .trim();
        criticReview.date = $(
          ".review_content .review_stats .review_critic .date",
          el
        ).text();
        criticReview.link =
          $(".review_content .review_actions .full_review a", el).attr(
            "href"
          ) ?? "";
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

async function getUserReviews(albumName: string, artistName: string) {
  try {
    let url = [
      "https://www.metacritic.com/music/",
      getCleanAlbumName(albumName),
      "/",
      getCleanArtistName(artistName),
    ].join("");
    if (url in url_to_fix) {
      url = url_to_fix[url as keyof typeof url_to_fix];
    }
    url = [url, "/user-reviews"].join("");

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const reviewList: UserReview[] = [];

    $("#main .user_reviews_module .body ol.user_reviews li.user_review")
      .toArray()
      .forEach((el: Element) => {
        const userReview: UserReview = {
          score: 0,
          username: "",
          content: "",
          date: "",
          thumbsUp: 0,
          totalThumbs: 0,
        };
        userReview.score = $(
          ".review_content .review_stats .review_grade .metascore_w",
          el
        ).text() as unknown as number;
        userReview.username = $(
          ".review_content .review_stats .review_critic .name a",
          el
        ).text();
        userReview.content = $(".review_content .review_body span", el)
          .text()
          .trim();
        userReview.date = $(
          ".review_content .review_stats .review_critic .date",
          el
        ).text();
        userReview.thumbsUp = $(
          ".review_content .review_actions .review_helpful .helpful_summary .total_ups",
          el
        ).text() as unknown as number;
        userReview.totalThumbs = $(
          ".review_content .review_actions .review_helpful .helpful_summary .total_thumbs",
          el
        ).text() as unknown as number;
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

export async function getAlbumInfo(
  albumName: string,
  artistName: string,
  cancelToken: CancelToken
) {
  //console.log('getAlbumInfo', albumName, artistName);
  const albumInfo: Album = {
    name: "",
    score: 0,
    releaseDate: "",
    image: "",
    criticReviewCount: 0,
    userScore: 0,
    userRatingCount: 0,
    summary: "",
    recordLabel: "",
    genres: [],
    awardsAndRankings: [],
    criticReviews: [],
    userReviews: [],
    status: "error",
  };

  let url = [
    "https://www.metacritic.com/music/",
    getCleanAlbumName(albumName),
    "/",
    getCleanArtistName(artistName),
  ].join("");

  //console.log(url);

  if (url in url_to_fix) {
    url = url_to_fix[url as keyof typeof url_to_fix];
  }
  try {
    const { data } = await axios.get(url, { cancelToken });
    const $ = cheerio.load(data);

    albumInfo.name = $(".product_title a span h1").text();

    let tempScore: number | AwaitingReview = $(
      ".main_details .score_summary .metascore_w span"
    ).text() as unknown as number;
    if (!tempScore) {
      const awaitingCount = $(
        ".main_details .score_summary .summary .connect4_msg"
      )
        .text()
        .match(/Awaiting (\d)* more review/);
      tempScore = {
        awaitingCount: awaitingCount
          ? (awaitingCount[1] as unknown as number)
          : 0,
        reviewCount: $(".main_details .score_summary .summary .count a span")
          .text()
          .trim() as unknown as number,
        description: $(".main_details .score_summary .summary .desc")
          .text()
          .trim(),
      };
    }
    albumInfo.score = tempScore;

    albumInfo.releaseDate = $(
      "#main .product_split .left .product_content_head .product_data .release"
    )
      .children()
      .last()
      .text();

    albumInfo.image =
      $(
        "#main .product_split .left .product_data_summary .has_image .product_image img"
      ).attr("src") ?? "";

    $("#main .product_split .right .list_rankings .body .rankings tbody tr")
      .toArray()
      .forEach((el: Element) => {
        albumInfo.awardsAndRankings.push(
          $(".ranking_wrap .ranking_title a", el).text()
        );
      });

    albumInfo.criticReviewCount = $(
      '.main_details .score_summary .summary .count a span[itemprop="reviewCount"]'
    )
      .text()
      .trim() as unknown as number;

    albumInfo.userScore = $(
      ".side_details .score_summary .metascore_anchor .metascore_w"
    ).text() as unknown as number;

    albumInfo.userRatingCount = $(
      ".side_details .score_summary .summary p .count a"
    )
      .text()
      .replace(/ Ratings/g, "") as unknown as number;

    albumInfo.summary = $(
      ".product_details .main_details .summary_details .summary_detail .data span[itemprop='description']"
    ).text();

    albumInfo.recordLabel = $(
      '.product_details .side_details .summary_details .summary_detail span:contains("Record Label")'
    )
      .next()
      .text()
      .replace(/Record Label:/g, "")
      .trim();

    $(
      '.product_details .side_details .summary_details .summary_detail span:contains("Genre(s):")'
    )
      .parent()
      .children()
      .toArray()
      .forEach((el: Element) => {
        if ($(el).text() !== "Genre(s): ") albumInfo.genres.push($(el).text());
      });

    albumInfo.criticReviews = await getCriticReviews(albumName, artistName);
    albumInfo.userReviews = await getUserReviews(albumName, artistName);

    albumInfo.status = "success";

    return albumInfo;
  } catch (err) {
    //console.log(url);
    //console.log(err);
    return {
      name: albumName,
      score: 0,
      releaseDate: "No release date found",
      image:
        "https://www.escapeauthority.com/wp-content/uploads/2116/11/No-image-found.jpg",
      criticReviewCount: 0,
      userScore: 0,
      userRatingCount: 0,
      summary: "",
      recordLabel: "",
      genres: [],
      awardsAndRankings: [],
      criticReviews: [],
      userReviews: [],
      status: "error",
    };
  }
}

// Async function which scrapes the data
export async function getArtist(
  artistName: string
): Promise<Artist | undefined> {
  //console.log("Looking for", formattedName);
  if (artists_to_ignore.includes(getCleanArtistName(artistName))) {
    return undefined;
  }

  const artistInfo: Artist = {
    name: "",
    avgCareerScore: 0,
    albumNames: [],
    status: "error",
  };
  const url = [
    "https://www.metacritic.com/person/",
    getCleanArtistName(artistName),
    "?filter-options=music",
  ].join("");

  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url, {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    });
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    artistInfo.name = $("#main .person_title").text().trim();
    artistInfo.avgCareerScore = $("#main .review_average .textscore")
      .text()
      .trim() as unknown as number;

    $("#main .credits tbody tr")
      .toArray()
      .forEach((el: Element) => {
        artistInfo.albumNames.push($("a", el).text().trim());
      });

    artistInfo.status = "success";

    return artistInfo;
  } catch (err) {
    console.log("Could not find", url);
    //console.log(err);
    return undefined;
  }
}
