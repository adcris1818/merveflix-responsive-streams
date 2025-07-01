
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Basic',
      icon: Star,
      monthlyPrice: 8.99,
      yearlyPrice: 89.99,
      description: 'Perfect for individuals',
      features: [
        'HD streaming',
        '1 screen at a time',
        'Phone, tablet, computer',
        'Unlimited movies & TV shows',
        'Cancel anytime'
      ],
      popular: false,
      color: 'gray'
    },
    {
      name: 'Standard',
      icon: Zap,
      monthlyPrice: 13.99,
      yearlyPrice: 139.99,
      description: 'Great for families',
      features: [
        'Full HD streaming',
        '2 screens at a time',
        'Phone, tablet, computer, TV',
        'Unlimited movies & TV shows',
        'Download for offline viewing',
        'Cancel anytime'
      ],
      popular: true,
      color: 'red'
    },
    {
      name: 'Premium',
      icon: Crown,
      monthlyPrice: 17.99,
      yearlyPrice: 179.99,
      description: 'Ultimate viewing experience',
      features: [
        '4K + HDR streaming',
        '4 screens at a time',
        'Phone, tablet, computer, TV',
        'Unlimited movies & TV shows',
        'Download for offline viewing',
        'Spatial audio',
        'Cancel anytime'
      ],
      popular: false,
      color: 'purple'
    }
  ];

  const faqs = [
    {
      question: 'What is Merflix?',
      answer: 'Merflix is a streaming service that offers a wide variety of award-winning TV shows, movies and documentaries on thousands of internet-connected devices.'
    },
    {
      question: 'How much does Merflix cost?',
      answer: 'Watch Merflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $8.99 to $17.99 a month.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes! There are no contracts, no cancellation fees, and no commitments. You can cancel your account online in two clicks.'
    },
    {
      question: 'Where can I watch?',
      answer: 'Watch anywhere, anytime. Sign in with your Merflix account to watch instantly on the web or on any internet-connected device.'
    },
    {
      question: 'What can I watch on Merflix?',
      answer: 'Merflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Merflix originals, and more.'
    }
  ];

  const getCurrentPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    return Math.round((savings / monthlyTotal) * 100);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="px-4 md:px-8 lg:px-12 xl:px-16 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choose the plan that's right for you
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join millions of people who enjoy unlimited movies, TV shows and more.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-gray-800 rounded-full p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full transition-all ${
                  billingCycle === 'yearly' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly
                <span className="ml-2 bg-green-600 text-xs px-2 py-1 rounded-full">Save 17%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 md:px-8 lg:px-12 xl:px-16 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card key={plan.name} className={`relative bg-gray-900 border-gray-700 ${
                  plan.popular ? 'border-red-600 ring-2 ring-red-600' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <Icon className={`w-12 h-12 ${plan.color === 'red' ? 'text-red-500' : plan.color === 'purple' ? 'text-purple-500' : 'text-gray-500'}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                    <p className="text-gray-400">{plan.description}</p>
                    
                    <div className="mt-4">
                      <div className="text-4xl font-bold text-white">
                        ${getCurrentPrice(plan)}
                      </div>
                      <div className="text-gray-400">
                        per {billingCycle === 'monthly' ? 'month' : 'year'}
                      </div>
                      {billingCycle === 'yearly' && (
                        <div className="text-green-400 text-sm mt-1">
                          Save {getSavings(plan)}% annually
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      } text-white`}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Features Comparison */}
        <section className="px-4 md:px-8 lg:px-12 xl:px-16 py-16 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-4 text-gray-400">Features</th>
                    <th className="pb-4 text-center">Basic</th>
                    <th className="pb-4 text-center">Standard</th>
                    <th className="pb-4 text-center">Premium</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  <tr className="border-b border-gray-800">
                    <td className="py-4 text-gray-300">Monthly price</td>
                    <td className="py-4 text-center">$8.99</td>
                    <td className="py-4 text-center">$13.99</td>
                    <td className="py-4 text-center">$17.99</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 text-gray-300">Video quality</td>
                    <td className="py-4 text-center">Good</td>
                    <td className="py-4 text-center">Better</td>
                    <td className="py-4 text-center">Best</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 text-gray-300">Resolution</td>
                    <td className="py-4 text-center">720p</td>
                    <td className="py-4 text-center">1080p</td>
                    <td className="py-4 text-center">4K+HDR</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 text-gray-300">Screens you can watch on at the same time</td>
                    <td className="py-4 text-center">1</td>
                    <td className="py-4 text-center">2</td>
                    <td className="py-4 text-center">4</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 text-gray-300">Download devices</td>
                    <td className="py-4 text-center">1</td>
                    <td className="py-4 text-center">2</td>
                    <td className="py-4 text-center">6</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 md:px-8 lg:px-12 xl:px-16 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-8 lg:px-12 xl:px-16 py-16 text-center bg-red-600">
          <h2 className="text-4xl font-bold mb-4">Ready to watch? Enter your email to create or restart your membership.</h2>
          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto mt-8">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-4 py-3 rounded bg-white text-black"
            />
            <Button className="bg-black hover:bg-gray-900 text-white px-8 py-3">
              Get Started
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
