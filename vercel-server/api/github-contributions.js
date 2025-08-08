export default async function handler(req, res) {
	// CORS
	const allowed = (process.env.ALLOWED_ORIGINS || "*").split(",").map(s => s.trim());
	const origin = req.headers.origin || "";
	const allowAny = allowed.includes("*");
	if (allowAny || allowed.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", allowAny ? "*" : origin);
	}
	res.setHeader("Vary", "Origin");
	res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		return res.status(204).end();
	}

	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const token = process.env.GITHUB_TOKEN;
	if (!token) {
		return res.status(500).json({ error: "Missing GITHUB_TOKEN" });
	}

	const username = (req.query.username || "Abhash157").trim();
	const now = new Date();
	const defaultTo = now.toISOString();
	const oneYearAgo = new Date(now);
	oneYearAgo.setFullYear(now.getFullYear() - 1);
	const defaultFrom = oneYearAgo.toISOString();

	const fromISO = req.query.from ? new Date(req.query.from).toISOString() : defaultFrom;
	const toISO = req.query.to ? new Date(req.query.to).toISOString() : defaultTo;

	const query = `
      query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  color
                }
              }
            }
          }
        }
      }
    `;

	try {
		const ghRes = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				query,
				variables: { login: username, from: fromISO, to: toISO }
			})
		});

		if (!ghRes.ok) {
			const text = await ghRes.text();
			return res.status(ghRes.status).json({ error: "Upstream GitHub error", details: text });
		}

		const json = await ghRes.json();

		// Edge cache: 1 hour; clients can revalidate as needed
		res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
		return res.status(200).json(json);
	} catch (err) {
		return res.status(500).json({ error: "Request failed", details: String(err) });
	}
}
