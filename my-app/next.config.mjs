/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/my-app', // Set the sub-path for deployment
    reactStrictMode: true, // Optional: Enable React strict mode for better debugging
    images: {
      unoptimized: true, // If you're not using Next.js image optimization
    },
  };
  
  export default nextConfig;
  