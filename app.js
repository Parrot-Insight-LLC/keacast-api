const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
app.use(morgan('combined'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(compression())
app.use(cors())

app.all('/*', allowCORS)
// Home Route
app.get('/', (req, res) => {
  res.send('Hello, this is the Cashflow API')
})

// Routes
let users = require('./routes/UserRoutes.js')
let themes = require('./routes/ThemesRoutes.js')
let account = require('./routes/AccountRoutes.js')
let plaid = require('./routes/PlaidRoutes.js')
let coinbase = require('./routes/CoinbaseRoutes.js')
let transactions = require('./routes/TransactionsRoutes.js')
let balances = require('./routes/BalancesRoutes.js')
let subscriptions = require('./routes/SubscriptionRoutes.js')
let circle = require('./routes/CircleRoutes.js')

app.use(
  users,
  themes,
  account,
  plaid,
  coinbase,
  transactions,
  balances,
  subscriptions,
  circle,
)

async function allowCORS(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With',
  )
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')

  // intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(200)
  } else {
    next()
  }
}

app.listen(process.env.PORT || 8080, () => {
  console.log('Server is running on PORT: ' + process.env.PORT)
})
