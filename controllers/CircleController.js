const circle_sdk = require('api')('@circle-api/v1#3j78yrx1rl0tlc3mx')
const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const CIRCLE_SANDBOX_API_KEY = process.env.CIRCLE_SANDBOX_URL
const CIRCLE_SANDBOX_API_URL = process.env.CIRCLE_SANDBOX_URL

exports.circlePing = async (req, res) => {
  //code = req.query.code;

  axios({
    method: 'get',
    url: `${CIRCLE_SANDBOX_API_URL}`,
    headers: {
      Authorization: `Bearer ${CIRCLE_SANDBOX_API_KEY}`,
      'Access-Control-Allow-Origin': '*',
      Accept: 'application/json',
    },
    data: {},
  })
    .then((response) => {
      console.log(response)
      res.send(response.data)
    })
    .catch(function (error) {
      console.log(error)
    })
}
//   circle_sdk
//     .rootPing()
//     .then((res) => console.log(res))
//     .catch((err) => console.error(err))
