import Link from "next/link";

export default function ProjectCard(props) {
  return (
    <div className="flex justify-center w-full">
      <div className="card bg-base-100 shadow-md h-60 max-w-lg w-full">
        <div className="card-body flex flex-col h-full">
          <h2 className="card-title text-2xl text-primary mb-2 flex items-center">
            <Link
              className="hover:text-sky-300 flex items-center"
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.title}
              <svg
                className="ml-2 w-5 h-5"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5 3v18l15-9L5 3z" />
              </svg>
            </Link>
          </h2>
          <div className="flex-grow overflow-auto">
            <p>{props.desc}</p>
          </div>
          <div>
            <p>Length: {props.length} weeks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
