type Project = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.projectUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.imageUrl}
          alt={project.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{project.name}</h3>
        {project.description && (
          <p className="mt-2 flex-1 text-sm text-ink/60">{project.description}</p>
        )}
        <span className="mt-4 text-sm font-semibold text-tech group-hover:underline">
          Ver proyecto →
        </span>
      </div>
    </a>
  );
}
