import { FaCertificate, FaClock, FaBookOpen } from 'react-icons/fa'; // Importing icons

import PublicHeading from '@/components/common/PublicHeading';

const WhyChooseUs = () => {
  return (
    <div className="py-24 bg-gray-100 ">
      <div className="app-container">
        <div className="grid grid-cols-2 gap-8">
          {/* Section 1: Image with Icons and Stats */}
          <div className="col-span-1 ">
            <div className="relative flex justify-center">
              <div className="w-[400px] h-[500px] bg-gradient-to-tr  rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 ease-in-out from-publicBlue to-publicRed">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-5xl font-extrabold">Join Us</h3>
                </div>
              </div>

              {/* Overlaying Cards */}
              <div className="absolute -top-8 right-8 bg-white p-6 rounded-xl shadow-lg transform rotate-6 hover:rotate-0 transition-all duration-500 ease-in-out">
                <h4 className="text-3xl font-bold text-publicRed">98%</h4>
                <p className="text-gray-600">Success Rate</p>
              </div>
              <div className="absolute -bottom-8 left-8 bg-white p-6 rounded-xl shadow-lg transform -rotate-6 hover:rotate-0 transition-all duration-500 ease-in-out">
                <h4 className="text-3xl font-bold text-publicRed">50+</h4>
                <p className="text-gray-600">Courses Offered</p>
              </div>
            </div>
          </div>

          {/* Section 2: Why Choose Us Content */}
          <div className="col-span-1 pl-">
            <PublicHeading
              containerClasses="text-left"
              backGroundHeading="Excellent"
              mainHeading=" Why Choose Us?"
              bgHeadingClasses="text-left"
            />
            <p className="text-lg text-gray-600 mb-8">
              We provide a unique blend of flexibility, real-world application, and internationally recognized
              certifications, designed for the modern learner.
            </p>

            {/* Modernized Cards */}
            <div className="space-y-8">
              {/* Card 1 */}
              <div className="flex items-start bg-gradient-to-r from-white to-gray-100 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-t-4 border-gradient-to-r ">
                <div className="bg-publicRed p-4 rounded-full mr-6">
                  <FaCertificate className="text-white text-3xl" />
                </div>
                <div>
                  <h3 className="text-xl  text-gray-800">Globally Recognized Certifications</h3>
                  <p className="text-gray-600 mt-2">
                    Receive certifications from industry-leading institutions, accepted and verifiable
                    worldwide.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex items-start bg-gradient-to-r from-white to-gray-100 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-t-4 border-gradient-to-r ">
                <div className="bg-publicRed p-4 rounded-full mr-6">
                  <FaClock className="text-white text-3xl" />
                </div>
                <div>
                  <h3 className="text-xl  text-gray-800">Learn at Your Own Pace</h3>
                  <p className="text-gray-600 mt-2">
                    Flexible course timings and progress, allowing you to manage your learning schedule
                    efficiently.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex items-start bg-gradient-to-r from-white to-gray-100 p-8 rounded-lg shadow-lg hover:shadow-2xl  duration-300 transform hover:scale-105 border-t-4 border-gradient-to-r  transition-all">
                <div className="bg-publicRed p-4 rounded-full mr-6">
                  <FaBookOpen className="text-white text-3xl" />
                </div>
                <div>
                  <h3 className="text-xl  text-gray-800">Hands-on Learning</h3>
                  <p className="text-gray-600 mt-2">
                    Engage with real-time simulations and 100+ case studies to apply concepts in practical
                    scenarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
