const fs = require('fs');
const path = require('path');

const wranglerPath = path.join(__dirname, 'dist', 'my_react_app', 'wrangler.json');

if (fs.existsSync(wranglerPath)) {
  const config = JSON.parse(fs.readFileSync(wranglerPath, 'utf8'));

  config.d1_databases = [{
    "binding": "D1",
    "database_name": "moto3-training-db",
    "database_id": "7b8ece38-8b9e-4d95-9ee5-df0a6335d015",
    "id": "7b8ece38-8b9e-4d95-9ee5-df0a6335d015",
    "migrations_dir": "./drizzle"
  }];

  config.name = "moto3-training-app";

  fs.writeFileSync(wranglerPath, JSON.stringify(config));
  console.log('✅ Fixed wrangler.json with correct database config');
} else {
  console.log('⚠️  wrangler.json not found at', wranglerPath);
}
