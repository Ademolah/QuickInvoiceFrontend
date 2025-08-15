import React from "react";

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "/month",
    description: "Perfect for freelancers and small projects.",
    features: ["5 invoices per month", "Basic support", "Email reminders"],
    buttonText: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₦4,500",
    period: "/month",
    description: "For growing businesses needing more power.",
    features: ["Unlimited invoices", "Payment tracking", "Priority email support", "Custom branding"],
    buttonText: "Upgrade",
    highlighted: true,
  },
  {
    name: "Business",
    price: "₦12,000",
    period: "/month",
    description: "Best for established companies.",
    features: ["Unlimited invoices", "Multi-user access", "Advanced analytics", "Priority phone & email support"],
    buttonText: "Go Business",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large-scale operations.",
    features: ["Custom integrations", "Dedicated account manager", "On-site training"],
    buttonText: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-20 bg-gray-50" id="pricing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-gray-600">Choose the plan that fits your needs — upgrade anytime.</p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl shadow-lg p-8 flex flex-col justify-between border ${
                plan.highlighted ? "border-blue-500 bg-white scale-105" : "border-gray-200 bg-white"
              } transition-transform duration-300`}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-4xl font-bold text-gray-900">
                  {plan.price} <span className="text-lg font-medium text-gray-500">{plan.period}</span>
                </p>
                <p className="mt-4 text-gray-600">{plan.description}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition">
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
