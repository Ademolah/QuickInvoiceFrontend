export default function Footer() {
  return (
    <footer className="bg-[#001325] text-gray-300">
  <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    {/* Brand */}
    <div>
      <h2 className="text-white text-xl font-semibold mb-3">
        QuickInvoice
      </h2>
      <p className="text-sm leading-relaxed">
        Smart invoicing, inventory, receipts, and business management —
        built to help African businesses grow faster and smarter.
      </p>
    </div>
    {/* Product */}
    <div>
      <h3 className="text-white font-medium mb-3">Product</h3>
      <ul className="space-y-2 text-sm">
        <li><p  className="hover:text-white">Smart Invoicing</p></li>
        <li><p className="hover:text-white">Automated Receipt</p></li>
        <li><p className="hover:text-white">Reports</p></li>
        <li><p  className="hover:text-white">Inventory</p></li>
      </ul>
    </div>
    {/* Company */}
    <div>
      <h3 className="text-white font-medium mb-3">Company</h3>
      <ul className="space-y-2 text-sm">
        <li><a href="/" className="hover:text-white">About</a></li>
        <li><a href="/contact" className="hover:text-white">Contact</a></li>
        <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
        <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
      </ul>
    </div>
    {/* Trust / CTA */}
    <div>
      <h3 className="text-white font-medium mb-3">Built for Growth</h3>
      <p className="text-sm mb-4">
        Trusted by growing businesses across Nigeria and beyond.
      </p>
      <a
        href="/register"
        className="inline-block bg-[#0046A5] hover:bg-[#003a8c] transition text-white text-sm px-4 py-2 rounded-lg"
      >
        Get Started
      </a>
    </div>
  </div>
  {/* Bottom bar */}
  <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
    © {new Date().getFullYear()} QuickInvoice NG. All rights reserved.
    <span className="block mt-1">
      Built & Powered by <span className="text-white font-medium">QuickInvoice Technologies</span>
    </span>
  </div>
</footer>
  );
}
