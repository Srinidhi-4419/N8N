"use client";

export default function Landing() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="w-full py-4 border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            AutoFlow
          </h1>

          <nav className="flex items-center gap-6">
            <a className="text-gray-700 hover:text-black" href="#features">
              Features
            </a>
            <a className="text-gray-700 hover:text-black" href="#pricing">
              Pricing
            </a>
            <a
              href="/signin"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Sign In
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Automate Your Trading <span className="text-blue-600">Visually</span>
          </h2>

          <p className="text-lg text-gray-600 mt-4">
            Build powerful trading automations with a drag-and-drop workflow
            editor. No coding required. Execute trades across multiple exchanges
            with precision.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
            >
              Get Started
            </a>

            <a
              href="#demo"
              className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg text-lg hover:bg-gray-100 transition"
            >
              View Demo
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-900">Why AutoFlow?</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            <div className="p-6 border rounded-xl bg-gray-50">
              <h4 className="text-xl font-semibold">Visual Editor</h4>
              <p className="mt-2 text-gray-600">
                Build workflows using simple drag-and-drop nodes.
              </p>
            </div>

            <div className="p-6 border rounded-xl bg-gray-50">
              <h4 className="text-xl font-semibold">Multi-Exchange Support</h4>
              <p className="mt-2 text-gray-600">
                Connect APIs from major trading platforms seamlessly.
              </p>
            </div>

            <div className="p-6 border rounded-xl bg-gray-50">
              <h4 className="text-xl font-semibold">Reliable Execution</h4>
              <p className="mt-2 text-gray-600">
                Run workflows with secure and trackable executions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t bg-gray-50 text-center text-gray-600">
        © {new Date().getFullYear()} AutoFlow. All rights reserved.
      </footer>
    </main>
  );
}
