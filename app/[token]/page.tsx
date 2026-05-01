import AlbumClient from "./AlbumClient";

export default function AlbumPage({ params }: { params: { token: string } }) {
  return <AlbumClient token={params.token} />;
}
