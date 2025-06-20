class GitHubService {
    constructor() {
        this.cache = {
            contributions: null,
            lastFetched: 0,
            cacheDuration: 3600000 // 1 hour cache
        };
    }

    async getContributions() {
        const now = Date.now();
        
        // Return cached data if still valid
        if (this.cache.contributions && (now - this.cache.lastFetched) < this.cache.cacheDuration) {
            return this.cache.contributions;
        }

        try {
            // This will be replaced with a serverless function in production
            const response = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${atob('Z2hwX1BRWm9teDlqSVB0U2FUTVFFTU41TUZQUlEwZFFTVDFHbkdIaw==')}`
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
                throw new Error('Failed to fetch GitHub contributions');
            }

            const data = await response.json();
            const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
            
            // Cache the response
            this.cache = {
                contributions: weeks,
                lastFetched: now
            };
            
            return weeks;
        } catch (error) {
            console.error('GitHub API Error:', error);
            throw error;
        }
    }

    renderGraph(weeks, container) {
        if (!weeks || !weeks.length) return;

        // Clear previous graph
        container.innerHTML = '';
        
        // Create graph container
        const graph = document.createElement('div');
        graph.className = 'github-graph';
        graph.style.display = 'flex';
        graph.style.gap = '4px';
        graph.style.marginTop = '10px';
        graph.style.flexWrap = 'wrap';
        graph.style.width = '100%';

        // Get last 90 days of contributions
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 90);
        
        // Flatten all contribution days
        let allDays = [];
        weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                const dayDate = new Date(day.date);
                if (dayDate >= startDate) {
                    allDays.push(day);
                }
            });
        });

        // Group by week
        const weeksToShow = [];
        let currentWeek = [];
        let currentWeekDay = -1;
        
        allDays.forEach(day => {
            const dayOfWeek = new Date(day.date).getDay();
            
            // Start new week if needed
            if (dayOfWeek <= currentWeekDay) {
                weeksToShow.push([...currentWeek]);
                currentWeek = [];
            }
            
            currentWeek.push(day);
            currentWeekDay = dayOfWeek;
        });
        
        if (currentWeek.length > 0) {
            weeksToShow.push(currentWeek);
        }

        // Render graph
        weeksToShow.forEach(week => {
            const weekContainer = document.createElement('div');
            weekContainer.style.display = 'flex';
            weekContainer.style.flexDirection = 'column';
            weekContainer.style.gap = '4px';
            
            week.forEach(day => {
                const dayElement = document.createElement('div');
                const count = day.contributionCount;
                
                // Determine color based on contribution count
                let color = '#161b22';
                if (count > 0) color = '#0e4429';
                if (count > 3) color = '#006d32';
                if (count > 7) color = '#26a641';
                if (count > 15) color = '#39d353';
                
                dayElement.style.width = '12px';
                dayElement.style.height = '12px';
                dayElement.style.backgroundColor = color;
                dayElement.style.borderRadius = '2px';
                dayElement.style.position = 'relative';
                
                // Add tooltip
                dayElement.title = `${count} contribution${count !== 1 ? 's' : ''} on ${new Date(day.date).toLocaleDateString()}`;
                
                weekContainer.appendChild(dayElement);
            });
            
            graph.appendChild(weekContainer);
        });
        
        // Add legend
        const legend = document.createElement('div');
        legend.style.display = 'flex';
        legend.style.justifyContent = 'space-between';
        legend.style.width = '100%';
        legend.style.marginTop = '8px';
        legend.style.fontSize = '10px';
        legend.style.color = '#8b949e';
        
        const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const startDateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        legend.textContent = `Last 90 days • ${startDateStr} - ${todayStr}`;
        
        container.appendChild(graph);
        container.appendChild(legend);
    }
}

// Export the class instead of an instance
export default GitHubService;
