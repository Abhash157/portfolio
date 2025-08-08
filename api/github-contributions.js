export default async function handler(req, res) {
    const username = req.query.username || "Abhash157";
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return res.status(500).json({ error: "GitHub token not set" });
    }
    const response = await fetch(`https://api.github.com/users/${username}/events`, {
        headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json"
        }
    });
    if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch contributions" });
    }
    const data = await response.json();
    res.status(200).json(data);
}
