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
  },
  env: {
    secretKey: "H_eYjpvJahXtSMfRIrmCkdQJMCAisriug3OF765x89c",
  },
};
export default nextConfig;
