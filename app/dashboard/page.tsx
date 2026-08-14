export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6">
        <h2 className="text-2xl font-bold mb-8">
          Vorix Security
        </h2>

        <nav className="space-y-4">
          <p>Dashboard</p>
          <p>Security</p>
          <p>Threats</p>
          <p>Reports</p>
          <p>Settings</p>
        </nav>
      </aside>


      {/* Main */}
      <section className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Security Dashboard
          </h1>

          <button className="bg-black text-white px-5 py-2 rounded">
            Admin
          </button>
        </div>


        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">
              Security Status
            </h3>
            <p className="mt-3 text-green-600">
              Protected
            </p>
          </div>


          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">
              Threat Detection
            </h3>
            <p className="mt-3">
              0 Threats Found
            </p>
          </div>


          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">
              System Status
            </h3>
            <p className="mt-3">
              Online
            </p>
          </div>

        </div>


        {/* Reports */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h2 className="text-xl font-bold">
            Security Reports
          </h2>

          <p className="mt-3">
            No recent security events.
          </p>
        </div>


      </section>

    </main>
  );
}
