import { NextApiRequest, NextApiResponse } from "next";
import { getArtist } from "../../../lib/scraper";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query;

  getArtist(name as string)
    .then((artist) => {
      res.status(200).json({ artist });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

export default handler;
