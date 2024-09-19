export default function YoutubeVideo({ embedCode }) {
  return (
    <div className="w-full max-w-3xl mx-auto aspect-video p-4 bg-base-200 rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${embedCode}`}
        frameborder="0"
        allowFullScreen
        className="w-full h-full rounded-md"
        title={`Youtube Video ${embedCode}`}
      />
    </div>
  );
}
