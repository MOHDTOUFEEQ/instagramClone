import { Link } from "react-router-dom";

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
          <Link
  to="https://www.linkedin.com/in/mohammed-toufeeq-956042266/"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-500 hover:text-blue-700 transition-colors"
  title="LinkedIn"
>
  LinkedIn
</Link>
<Link
  to="https://github.com/MOHDTOUFEEQ"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-400 hover:text-blue-600 transition-colors"
  title="Github"
>
  Github
</Link>

            <Link href="#" className="text-red-500 hover:text-red-700" title="YouTube">
              <i className="fab fa-youtube"></i>
            </Link>
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
