import { Link } from 'react-router-dom';
import { FileText, Search, TrendingUp, Shield, ArrowRight, CheckCircle, Target } from 'lucide-react';
import heroImage from '../assets/fda-image.png';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center animate-fade-in">
           <div className="mb-6 flex justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <img
              src={heroImage}
              alt="Industry Iceberg Logo"
              className="h-16 w-auto"
            />
          </div>
</div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              CompliSense
              <br />
              {/* <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                Intelligence Platform
              </span> */}
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Transform FDA 483 Observations into Actionable Compliance Insights
              <br />
              <span className="text-lg text-blue-200">Analyze 261,811+ observations from 2007-2025</span>
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/dashboard"
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/request-demo"
                className="btn-secondary text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* What is GMP Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">What is GMP?</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              <strong>Good Manufacturing Practice (GMP)</strong> is a system for ensuring that products are consistently 
              produced and controlled according to quality standards. It is designed to minimize the risks involved in 
              any pharmaceutical production that cannot be eliminated through testing the final product.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              GMP covers all aspects of production from the starting materials, premises, and equipment to the training 
              and personal hygiene of staff. Detailed, written procedures are essential for each process that could affect 
              the quality of the finished product. There must be systems to provide documented proof that correct procedures 
              are consistently followed at each step in the manufacturing process.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mt-6">
              <p className="text-gray-800 font-semibold">
                The FDA conducts inspections to ensure companies comply with GMP regulations. When violations are found, 
                inspectors issue Form 483 observations, which document objectionable conditions that may lead to enforcement action.
              </p>
            </div>
          </div>
        </div>

        {/* Project Focus Section */}
        <div className="card mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Our Project Focus</h2>
          </div>
          <p className="text-gray-700 text-lg mb-6">
            Our platform is specifically designed for <strong>GMP audits and compliance management</strong>. 
            Here's how we help organizations navigate FDA inspections and improve their compliance posture:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Search className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Observation Analysis</h3>
              </div>
              <p className="text-gray-700">
                Users can enter an FDA 483 observation, and our AI-powered system analyzes it to identify relevant 
                <strong> Code of Federal Regulations (CFR)</strong> sections.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800">Historical Pattern Analysis</h3>
              </div>
              <p className="text-gray-700">
                The system shows how many times a specific CFR number has been cited in observations from 
                <strong> 2007 to 2025</strong>, helping identify recurring compliance issues.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-800">Corrective & Preventive Actions</h3>
              </div>
              <p className="text-gray-700">
                Based on the observation and CFR analysis, the platform provides recommended 
                <strong> Corrective and Preventive Actions (CAPA)</strong> to address the identified issues.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Complete GMP Audit Solution</h3>
            <p className="text-blue-100 text-lg mb-4">
              Our comprehensive platform combines historical FDA inspection data with intelligent analysis to help 
              pharmaceutical, medical device, food, and cosmetic companies:
            </p>
            <ul className="space-y-2 text-blue-100">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Identify common compliance pitfalls before inspections</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Understand regulatory requirements through CFR mapping</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Learn from historical observations to prevent future violations</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Implement effective CAPA strategies based on industry best practices</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card card-hover">
            <FileText className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">261,811+ Observations</h3>
            <p className="text-gray-600">
              Comprehensive database of FDA 483 observations from 2007 to 2025, covering all program areas 
              including Drugs, Food, Cosmetics, Biologics, and Medical Devices.
            </p>
          </div>

          <div className="card card-hover">
            <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Intelligent Analytics</h3>
            <p className="text-gray-600">
              Advanced analytics and visualization tools to identify trends, patterns, and insights 
              from historical inspection data across six cGMP systems.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Compliance Strategy?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Explore our interactive dashboard or request a personalized demo
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/dashboard"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-200 shadow-lg"
            >
              View Dashboard
            </Link>
            <Link
              to="/request-demo"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-200"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

