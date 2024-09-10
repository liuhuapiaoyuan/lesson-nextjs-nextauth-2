export default function QRCodePage(params: {
  searchParams: Record<string, string>;
}) {
  return <div>{JSON.stringify(params.searchParams)}</div>;
}
