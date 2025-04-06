export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.MONGODB_URI,
  },
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  resume: {
    shortlistThreshold: parseInt(process.env.SHORTLIST_THRESHOLD, 10) || 70,
  },
});
