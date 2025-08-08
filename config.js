require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    githubToken: process.env.GITHUB_TOKEN,
    port: process.env.PORT || 3000,
    apiBaseUrl: process.env.API_BASE_URL || 'https://api.github.com'
  },
  production: {
    githubToken: process.env.GITHUB_TOKEN,
    port: process.env.PORT || 3000,
    apiBaseUrl: process.env.API_BASE_URL || 'https://api.github.com'
  }
};

// Validate required environment variables
if (!config[env].githubToken) {
  console.error('FATAL: GITHUB_TOKEN is not defined');
  process.exit(1);
}

module.exports = config[env];
