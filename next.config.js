/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AUTOCOMPLETE_API_KEY: process.env.AUTOCOMPLETE_API_KEY,
  },
};

module.exports = nextConfig;
