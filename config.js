var config = {}
var fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()
// const serverCa = [
//   fs.readFileSync(process.env.WEBSITE_PUBLIC_CERTS_PATH, 'utf8'),
// ]

config.connection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  //   ssl: {
  //     ca: serverCa,
  //   },
}

config.twilio = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
}

module.exports = config
