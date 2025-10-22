"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useTokenInfoStorage } from "@/store/authStore";

interface PlanFeature {
  text: string;
}

interface Plan {
  id: string;
  title: string;
  price: string;
  period: string;
  features: PlanFeature[];
  isRecommended?: boolean;
  isPopular?: boolean;
}

export default function Plans() {
  const router = useRouter();
  const { token } = useTokenInfoStorage();
  
  const plans: Plan[] = [
    {
      id: "1",
      title: "Team - CLUB",
      price: "80.000VND",
      period: "/month",
      features: [
        { text: "Ad-free experience" },
        { text: "Unlimited members" },
        { text: "Frame Club" },
      ],
    },
    {
      id: "2",
      title: "Premium",
      price: "30.000VND",
      period: "/month",
      features: [
        { text: "Ad-free experience" },
        { text: "Unlimited studyrooms" },
        { text: "Avatar frame" },
        { text: "Expression of the mascot series" },
        { text: "AI analysis" },
      ],
      isRecommended: true,
    },
    {
      id: "3",
      title: "Unique Mascot",
      price: "29.000VND",
      period: "/month",
      features: [
        { text: "Special-shaped mascot" },
        { text: "Sold separately" },
      ],
    },
    {
      id: "4",
      title: "Style Combo",
      price: "59.000VND",
      period: "/month",
      features: [
        { text: "Mascot Outfit" },
        { text: "Mascot Expression" },
      ],
    },
    {
      id: "5",
      title: "Style Combo",
      price: "89.000VND",
      period: "/month",
      features: [
        { text: "Full new mascot combo" },
        { text: "10 bonus coins" },
      ],
    },
  ];

  const handleBuyNow = (planId: string) => {
    console.log(`Buying plan: ${planId}`);
    
    // Check if user is authenticated
    if (!token) {
      // Guest user - redirect to login
      router.push('/login');
      return;
    }
    
    // Authenticated user - redirect to payment page
    // You can pass the planId as a query parameter
    router.push(`/payment?planId=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />
      
      {/* Header */}
      

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Unlock Premium Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Unlock Premium Features</h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Upgrade to Premium and elevate your study experience with exclusive features designed to help you achieve your academic goals faster and more efficiently.
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative ${
                plan.isRecommended ? 'border-2 border-orange-500' : ''
              }`}
            >
              {/* Recommended Badge */}
              {plan.isRecommended && (
                <div className="absolute -top-3 -right-3 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recommended
                </div>
              )}
              
              <div className="p-8">
                {/* Plan Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {plan.title}
                </h3>
                
                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-orange-500">{plan.price}</span>
                  <span className="text-base text-gray-600 dark:text-gray-400 ml-2">{plan.period}</span>
                </div>
                
                {/* Features */}
                <div className="mb-6">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Buy Now Button */}
                <Button
                  onClick={() => handleBuyNow(plan.id)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  BUY NOW
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}