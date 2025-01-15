import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 overflow-x-hidden">
      <div className="container flex flex-wrap gap-1 gap-y-2 py-4 justify-between items-center">
        {/* About Us */}
        <div className="col-span-1 w-full md:w-3/6 py-4">
          <h2 className="text-2xl font-bold mb-4">About Me</h2>
          <p className="text-sm">I am a seasoned web developer with a wealth of experience, specializing in the creation of robust and innovative web solutions. My expertise encompasses a broad range of technologies and frameworks, allowing me to craft dynamic and efficient web applications tailored to meet the unique requirements of diverse projects.</p>
        </div>

        {/* Contact */}
        <div className="col-span-1 w-full md:w-auto py-4">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p className="text-sm">Email: mohdtoufeeq1447@gmail.com</p>
        </div>

        {/* Social Media */}
        <div className="col-span-1 w-full md:w-auto">
          <h2 className="text-2xl font-bold mb-4">Connect with Me</h2>
          <div className="flex space-x-4">
            <a href="https://www.linkedin.com/in/mohammed-toufeeq-956042266/" target='_blank' className="text-blue-500 text-white hover:text-blue-700" title="LinkedIn">
              LinkedIn
            </a>
            <a href="https://github.com/MOHDTOUFEEQ" target='_blank' className="text-blue-400 text-white hover:text-blue-600" title="Github">
              Github
            </a>
            <a href="#" className="text-red-500 hover:text-red-700" title="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center">
        <p className="text-sm md:w-25vw lg:w-80vw">&copy; 2023 Toufeeq. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
