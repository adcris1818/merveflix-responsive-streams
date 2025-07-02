
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              Terms of Service
            </h1>
            
            <p className="text-gray-400 mb-8">Last updated: January 1, 2024</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-300">
                  By accessing and using MERFLIX, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
                <p className="text-gray-300 mb-4">
                  MERFLIX is a subscription-based streaming service that provides access to movies, 
                  TV shows, documentaries, and other video content.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Unlimited streaming of available content</li>
                  <li>Multiple device support</li>
                  <li>Personalized recommendations</li>
                  <li>Offline viewing on supported devices</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Subscription and Payment</h2>
                <p className="text-gray-300 mb-4">
                  Your subscription to MERFLIX will continue and automatically renew until cancelled.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Monthly or annual billing cycles</li>
                  <li>Payment due at the start of each billing period</li>
                  <li>Price changes will be communicated 30 days in advance</li>
                  <li>No refunds for partial months</li>
                  <li>Free trial periods may be offered to new subscribers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Account Registration</h2>
                <p className="text-gray-300 mb-4">
                  To use MERFLIX, you must register for an account and provide accurate information.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>You must be 18 years or older to create an account</li>
                  <li>One account per person</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>Account sharing is limited to household members</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Acceptable Use</h2>
                <p className="text-gray-300 mb-4">
                  You agree to use MERFLIX only for lawful purposes and in accordance with these terms.
                </p>
                <h3 className="text-lg font-semibold mb-2 text-red-600">Prohibited Activities:</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Downloading, copying, or redistributing content</li>
                  <li>Using automated systems to access the service</li>
                  <li>Attempting to circumvent security measures</li>
                  <li>Sharing account credentials with non-household members</li>
                  <li>Using VPNs to access content not available in your region</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Content and Intellectual Property</h2>
                <p className="text-gray-300 mb-4">
                  All content on MERFLIX is protected by copyright and other intellectual property laws.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Content is licensed for personal, non-commercial use only</li>
                  <li>Content availability may vary by region</li>
                  <li>We may add or remove content at any time</li>
                  <li>MERFLIX owns all rights to original content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Privacy and Data Protection</h2>
                <p className="text-gray-300">
                  Your privacy is important to us. Please review our Privacy Policy, which also 
                  governs your use of the service, to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Service Availability</h2>
                <p className="text-gray-300">
                  We strive to provide uninterrupted service but cannot guarantee 100% uptime. 
                  Service may be temporarily unavailable due to maintenance, updates, or technical issues.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Cancellation</h2>
                <p className="text-gray-300 mb-4">
                  You may cancel your subscription at any time:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Access continues until the end of your current billing period</li>
                  <li>No refunds for unused portions of subscription</li>
                  <li>Reactivation available at any time</li>
                  <li>Account data retained for 90 days after cancellation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-300">
                  MERFLIX shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages resulting from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
                <p className="text-gray-300">
                  We reserve the right to modify these terms at any time. Changes will be effective 
                  immediately upon posting. Continued use of the service constitutes acceptance of 
                  modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
                <p className="text-gray-300">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-900 rounded-lg p-6 mt-4">
                  <p className="text-white mb-2">Email: legal@merflix.com</p>
                  <p className="text-white mb-2">Phone: 1-800-MERFLIX</p>
                  <p className="text-white">Address: 123 Streaming St, Entertainment City, EC 12345</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
