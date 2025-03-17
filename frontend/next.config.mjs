/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "servicosweb.cnpq.br",
        port: "",
        pathname: "/wspessoa/servletrecuperafoto/**",
      }
    ]
  }
};
export default nextConfig;
