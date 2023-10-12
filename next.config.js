/** @type {import("next").NextConfig} */
module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/",
        destination: "https://ai-proxy.epam-rail.com/:path*",
      },
    ];
  };
  return {
    rewrites,
  };
};
