import Link from "next/link";

export default function ProjectCard(props) {
  return (
    <div className="flex justify-center w-full">
      <div className="card bg-base-100 shadow-md h-60 max-w-lg w-full">
        <div className="card-body flex flex-col h-full">
          <h2 className="card-title text-2xl text-primary mb-2">
            <Link
              className="hover:text-sky-300"
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.title}
            </Link>
          </h2>
          <div className="flex-grow overflow-auto">
            <p>{props.desc}</p>
          </div>
          <div className="">
            <p>Length: {props.length} weeks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
