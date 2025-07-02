
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              Privacy Policy
            </h1>
            
            <p className="text-gray-400 mb-8">Last updated: January 1, 2024</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                <p className="text-gray-300 mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  subscribe to our service, or contact us for support.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Account information (name, email address, password)</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                  <li>Viewing history and preferences</li>
                  <li>Device and technical information</li>
                  <li>Communication preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-300 mb-4">
                  We use the information we collect to provide, maintain, and improve our services:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Provide and deliver content and services</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Personalize your viewing experience</li>
                  <li>Send you service-related communications</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                <p className="text-gray-300 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties, 
                  except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To service providers who assist in our operations</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <p className="text-gray-300">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
                  secure servers, and regular security audits.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Your Rights and Choices</h2>
                <p className="text-gray-300 mb-4">
                  You have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Access and update your account information</li>
                  <li>Delete your account and personal data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Control viewing history and recommendations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
                <p className="text-gray-300">
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                  and provide personalized content. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
                <p className="text-gray-300">
                  Our service is not intended for children under 13. We do not knowingly collect personal 
                  information from children under 13. If you are a parent and believe your child has provided 
                  us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. International Data Transfers</h2>
                <p className="text-gray-300">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your data during such transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Changes to This Policy</h2>
                <p className="text-gray-300">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
                <p className="text-gray-300">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-gray-900 rounded-lg p-6 mt-4">
                  <p className="text-white mb-2">Email: privacy@merflix.com</p>
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

export default Privacy;
