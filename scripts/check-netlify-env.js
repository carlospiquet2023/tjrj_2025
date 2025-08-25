// Simple check script used in CI to ensure necessary Netlify env vars are set
const required = ['GEMINI_API_KEY'];
const missing = required.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(2);
}
console.log('All required Netlify environment variables are present.');
