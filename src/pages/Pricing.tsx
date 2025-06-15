
import GlassNavbar from "@/components/GlassNavbar";

const Pricing = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-10">
    <GlassNavbar />
    <div className="pt-28 max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Pricing</h1>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-md w-full md:w-1/2 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Basic</h2>
          <p className="text-gray-700 mb-6">Try our core features for free.</p>
          <span className="text-3xl font-bold text-gray-900">$0</span>
          <ul className="mt-6 text-gray-600 space-y-2 text-left text-base">
            <li>✔️ 1 Resume analysis</li>
            <li>✔️ Basic AI optimization</li>
            <li>✔️ Secure upload/download</li>
            <li>✔️ Email support</li>
          </ul>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full md:w-1/2 border border-blue-200">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">Pro</h2>
          <p className="text-gray-700 mb-6">Unlock unlimited AI resume power and priority support.</p>
          <span className="text-3xl font-bold text-indigo-900">$12<span className="text-xl">/mo</span></span>
          <ul className="mt-6 text-gray-600 space-y-2 text-left text-base">
            <li>✔️ Unlimited resume optimizations</li>
            <li>✔️ Advanced keyword matching</li>
            <li>✔️ Priority support</li>
            <li>✔️ All future updates</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 text-center">
        <span className="inline-block font-semibold text-xl text-blue-700 px-8 py-4 bg-white/60 rounded-xl shadow-lg backdrop-blur-md">
          Risk free. Cancel anytime.
        </span>
      </div>
    </div>
  </div>
);
export default Pricing;
