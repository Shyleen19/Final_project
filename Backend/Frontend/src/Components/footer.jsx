const Footer = () => {
  return (
    <>
      <footer className="bg-[#43E3FD] py-8 text-gray-800">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          {/* Contact Information */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Information</h3>
            <p>Email: dialicare@gmail.com</p>
            <p>Phone: +254 743208323</p>
            <p>Email: dialicare@gmail.com</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links</h3>
            <ul>
              <li><a href="#home" className="hover:underline">Home</a></li>
              <li><a href="#about" className="hover:underline">About Us</a></li>
              <li><a href="#services" className="hover:underline">Services</a></li>
              <li><a href="#contact" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <ul>
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">LinkedIn</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
            </ul>
            <a href="/login">
              <button className="bg-cyan-600 text-white mt-4 px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-white hover:text-black">
                Get Started
              </button>
            </a>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>© 2026 DialiCare. All Rights Reserved.</p>
        </div>
      </footer>
    </>)
}

export default Footer;