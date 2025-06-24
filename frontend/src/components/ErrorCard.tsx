interface ErrorCardProps {
  title: string;
  description: string;
}

export function ErrorCard({ title, description }: ErrorCardProps) {
  return (
    <div className="flex flex-col gap-1 bg-red-500/10 p-4 rounded-md border border-red-500/20">
      <h2 className="text-red-700 font-bold">{title}</h2>
      <p className="text-sm">{description}</p>
    </div>
  );
}
