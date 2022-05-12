var config = {}
var fs = require('fs')
const serverCa = [
  fs.readFileSync(
    'C:/Users/garobins/Documents/ParrotInsights/keacast-api/DigiCertGlobalRootCA.crt.pem',
    'utf8',
  ),
]

config.connection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    ca: fs.readFileSync(
      'C:/Users/garobins/Documents/ParrotInsights/keacast-api/DigiCertGlobalRootCA.crt.pem',
    ),
  },
}

config.twilio = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
}

module.exports = config
