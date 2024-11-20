import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full h-max bg-slate-950 text-white py-4 mt-25">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center ">
        <div className="flex items-center space-x-2">
          <Github className="h-5 w-5" />
          <a
            href="https://github.com/skoom21"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
        </div>
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} M.Talha Yousif. MIT License.
        </p>
      </div>
    </footer>
  );
};

export default Footer;