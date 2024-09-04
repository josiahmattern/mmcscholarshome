export default function ProjectCard(props) {
  return (
    <main>
      <div className="card bg-base-100 w-96 shadow-lg">
        <iframe
          className="w-full aspect-video self-stretch rounded-t-lg"
          src={props.id}
          title={props.title}
          aria-hidden="true"
        />
        <div className="card-body">
          <h2 className="card-title">{props.title}</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
        </div>
      </div>
    </main>
  );
}
