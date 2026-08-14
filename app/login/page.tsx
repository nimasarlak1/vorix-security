export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-8 border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">
          Login
        </h1>

        <input
          className="border p-2 mb-3 block"
          placeholder="Email"
        />

        <input
          className="border p-2 mb-3 block"
          placeholder="Password"
          type="password"
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Login
        </button>
      </div>
    </main>
  );
}
