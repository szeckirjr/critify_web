import { NextPage } from "next";
import { useRouter } from "next/router";

const AlbumPage: NextPage = () => {
  const { artist, album } = useRouter().query;

  return (
    <div>
      Album Page {artist} {album}
    </div>
  );
};

export default AlbumPage;
