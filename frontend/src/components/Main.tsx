export function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 w-full justify-center h-screen p-8">
      {children}
    </main>
  );
}
