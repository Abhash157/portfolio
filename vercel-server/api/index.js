export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    message: "Vercel server is running.",
    endpoints: ["/api/github-contributions?username=Abhash157&from=YYYY-MM-DD&to=YYYY-MM-DD"]
  });
}
