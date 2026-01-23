import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Footer from '../Components/footer';

library.add(fas, fab)

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="flex justify-between p-6 bg-[#EDFCFF] sticky top-0 z-50">
        <div className="text-black font-bold text-2xl ml-4">DialiCare</div>
        <nav>
          <ul className="flex space-x-16 text-black">
            <li><a href="#home" className="hover:text-[#00D9FF]">Home</a></li>
            <li><a href="#services" className="hover:text-[#00D9FF]">Our Services</a></li>
            <li><a href="#about" className="hover:text-[#00D9FF]">About Us</a></li>
            <li><a href="#contact" className="hover:text-[#00D9FF]">Contact Us</a></li>
            <li>
              <a href="/login" className="bg-[#00D9FF] text-white px-4 py-2 rounded transition-colors duration-300 hover:bg-white hover:text-[#00D9FF]">
                Get Started
              </a>
            </li>
          </ul>
        </nav>
      </header>
      {/* Hero Section */}
      <section id="home" className="flex flex-col md:flex-row items-center pt-8 pb-14 bg-[#FFFF] text-center md:text-left">
        <div className="flex flex-col items-center mb-8 ml-16 md:items-start md:mb-0 md:w-1/2">
          <h1 className="text-5xl font-bold mb-4">
            Get Kidney Care with <span className="text-[#00D9FF]">DialiCare</span>
          </h1>
          <p className="text-lg mb-8">
            Self-monitoring monitoring and secure access for your family to track your kidney's health, all from home.
          </p>
          <div className="flex flex-col md:flex-row md:justify-start">
            <a href="/login">
              <button className="bg-[#00D9FF] text-white px-9 py-2 rounded shadow-lg mb-4 md:mb-0 md:mr-4 hover:bg-white hover:text-[#00D9FF] transition duration-200 mr-7 ml-12">Get Started</button>
            </a>
            <a href="#how-it-works">

              <button className="text-[#00D9FF] border border-[#00D9FF] px-6 py-2 rounded shadow-lg hover:bg-[#00D9FF] hover:text-white transition duration-200 md:ml-4">How It Works</button>
            </a>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:w-1/1">
          <img
            src="dialysis picture.webp"
            alt="DialiCare Illustration"
            className="w-full max-w-[95%]"
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-[#EDFCFF] py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
        <div className="flex justify-center space-x-20 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs flex flex-col">
            <img src="self monitoring.png" alt="Continuous Vitals Monitoring" className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-left flex-grow">Self Vitals Monitoring</h3>
            <p className="text-black text-left">
              Stay connected with your health.Track key health signs between dialysis sessions, promoting early awareness of changes and better day-to-day health management.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs flex flex-col">
            <img src="Free Vector _ Flat parental control geolocation of child with tracking on phone.jpg" alt="Connect Patients to Family" className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-left">Connect Patients to Family</h3>
            <p className="text-black text-left">
              Ensure your loved ones are always in the loop about your health, fostering better communication and support.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Why Choose Us</h2>
          <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto text-left">
            Living with dialysis is more than hospital visits. We help you stay aware of changes in your health, feel supported between sessions, and take control of your wellbeing—one day at a time, with confidence and peace of mind.
          </p>
          <div className="flex justify-center">
            <button className="bg-[#00D9FF] text-white px-6 py-2 rounded hover:bg-white hover:text-[#00D9FF]">Get Started</button>
          </div>
        </div>
      </section>
      {/* About Us Section */}
      <section id="about" className="py-16 bg-white flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-8 text-center-right">About Us</h2>
        <div className="flex flex-col md:flex-row md:w-full">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img src="How Much Does It Cost to Implement Telemedicine_.jpg" alt="About Us" className="w-full h-auto rounded" />
          </div>
          <div className="md:w-1/2">
            <p className="mb-4">Diali Care is a patient-focused health solution designed to support dialysis patients beyond hospital. It helps patients track key health indicators, recognize early warning signs, and stay aware of changes in their condition between dialysis sessions. <br /> By promoting self-monitoring and shared access with caregivers, Diali Care empowers <br /> patients to take control of their health and feel supported in their day-to-day lives.</p>

            <div className="flex flex-col space-y-4 ml-8">
              <div className="bg-[#EDFCFF] p-3 rounded shadow transform transition-transform duration-300 hover:-translate-y-1 ml-20" style={{ width: '200px' }}>
                <h3 className="text-2xl font-bold text-center">50+</h3>
                <p className="text-center">Professional Doctors</p>
              </div>
              <div className="bg-blue-100 p-3 rounded shadow transform transition-transform duration-300 hover:-translate-y-1 ml-40" style={{ width: '200px' }}>
                <h3 className="text-2xl font-bold text-center">1000+</h3>
                <p className="text-center">Satisfied Patients</p>
              </div>
              <div className="bg-[#EDFCFF] p-3 rounded shadow transform transition-transform duration-300 hover:-translate-y-1 ml-60" style={{ width: '200px' }}>
                <h3 className="text-2xl font-bold text-center">5+</h3>
                <p className="text-center">Years of Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-8">How It Works</h2>
        <div className="container mx-auto flex flex-col space-y-8 items-center justify-center">

          <div>
            <div className="flex items-center justify-center w-12 h-12 bg-[#00D9FF] rounded-full text-white font-bold text-lg ml-8">
              1
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold">Patient Self-Monitoring</h3>
              <p>Manual entry of key health indicators including:Body weight,Blood pressure,Edema,Shortness of breath<br /> Daily and periodic symptom logging by the patient, and more.</p> </div>
          </div>

          <div className='ml-60'>
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full text-black font-bold text-lg ml-8">
              2
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold">Rule-Based Risk Assessment</h3>
              <p>Application of predefined clinical rules to analyze patient-entered data.Identification of potential risk patterns such as fluid overload or uncontrolled blood pressure.</p> </div>
          </div>

          <div>
            <div className="flex items-center justify-center w-12 h-12 bg-black rounded-full text-[#00D9FF] font-bold text-lg ml-8">
              3
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold">Caregiver Remote Monitoring</h3>
              <p>Read-only access for caregivers to view patient-submitted health data. <br /> Visualization of trends and flagged risk indicators</p>
            </div>
          </div>

          <div className='ml-60'>
            <div className="flex items-center justify-center w-12 h-12 bg-[#00D9FF] rounded-full text-white font-bold text-lg ml-8">
              4
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold">Instant Notifications</h3>
              <p>If an issue is identified, both the patient and their next of kin are promptly<br /> notified, allowing for timely action.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Get In Touch Section */}
      <section id="contact" className="bg-[#EAFBFE] p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Get in touch with us</h2>
        </div>
        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-lg p-5 w-full max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-[#67EAFF] p-5 rounded-lg flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Contact information</h3>
                <p className="flex items-center mb-2 justify-center">
                  <FontAwesomeIcon icon={faPhoneAlt} className="mr-2 text-white" /> +254 743208323
                </p>
                <p className="flex items-center mb-2 justify-center">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-white" /> dialicare@gmail.com
                </p>
                <p className="flex items-center mb-2 justify-center">
                  <FontAwesomeIcon icon={faWhatsapp} className="mr-2 text-white" /> dialicare
                </p>
                <p className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-white" /> Nairobi, Kenya
                </p>
              </div>
              <div className="p-5 flex flex-col justify-center">
                <form>
                  <div className="flex mb-4">
                    <div className="mr-2 w-1/2">
                      <label className="block mb-1">First name</label>
                      <input
                        type="text"
                        className="border-b border-black focus:border-[#00D9FF] focus:outline-none w-full p-2"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block mb-1">Last name</label>
                      <input
                        type="text"
                        className="border-b border-black focus:border-[#00D9FF] focus:outline-none w-full p-2"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Your subject</label>
                    <input
                      type="text"
                      className="border-b border-black focus:border-[#00D9FF] focus:outline-none w-full p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Message</label>
                    <textarea
                      className="border-b border-black focus:border-[#00D9FF] focus:outline-none w-full p-2"
                      rows="4"
                    ></textarea>
                  </div>
                  <button className="bg-[#00D9FF] text-white p-2 rounded hover:bg-white hover:text-[#00D9FF] transition">
                    Submit Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage;