export default function Navbar() {
  return (
    <nav className="border-b p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          AI Test Case Generator
        </h1>

        <button className="px-4 py-2 rounded-lg bg-black text-white">
          Login
        </button>
      </div>
    </nav>
  );
}