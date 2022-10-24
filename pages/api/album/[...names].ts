import { NextApiRequest, NextApiResponse } from "next";
import { getAlbumInfo } from "../../../lib/scraper";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { names } = req.query;
  const [artistName, albumName] = names as string[];

  getAlbumInfo(albumName as string, artistName as string)
    .then((album) => {
      res.status(200).json({ album });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

export default handler;
