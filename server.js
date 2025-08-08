const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const config = require('./config');

const app = express();

// Serve static files from the root directory
app.use(express.static('.'));

// API endpoint to get GitHub contributions
app.get('/api/github/contributions', async (req, res) => {
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${config.githubToken}`,
        'User-Agent': 'Abhash157-Portfolio'
      },
      body: JSON.stringify({
        query: `
          query {
            user(login: "Abhash157") {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                      weekday
                    }
                  }
                }
              }
            }
          }
        `
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/github/contributions`);
});
