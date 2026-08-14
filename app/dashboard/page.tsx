export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold">
        Vorix Security Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6 mt-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold">Security Status</h2>
          <p className="mt-2">Protected</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold">Threats</h2>
          <p className="mt-2">0 Detected</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold">System</h2>
          <p className="mt-2">Online</p>
        </div>

      </div>
    </main>
  );
}
