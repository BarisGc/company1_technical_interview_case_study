const axios = require('axios').default;
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const { json } = require('body-parser');
const { nanoid } = require('nanoid');
const url = require('url');

dotenv.config({ path: './config.env' });

const app = express();

app.use(cors());
app.use(json());

// Example for Cors Problem
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });

// app.get('/jokes/random', (req, res) => {
//   request(
//     { url: 'https://joke-api-strict-cors.appspot.com/jokes/random' },
//     (error, response, body) => {
//       if (error || response.statusCode !== 200) {
//         return res.status(500).json({ type: 'error', message: err.message });
//       }
//       res.json(JSON.parse(body));
//     }
//   )
// });

async function getData(endDate, startDate) {
  try {
    const response = await axios.get(`https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history?endDate=${endDate}&startDate=${startDate}`);
    console.log(response.data)
    return response.data
    // catch block will be handled later
  } catch (error) {
    return error
  }
}

app.get('/epiasDataByAPI', async (req, res) => {
  console.log("req:", req.url)
  // ----------------------------------
  const current_url = new URL(`http://localhost:7000${req.url}`);
  const search_params = current_url.searchParams;

  const endDate = search_params.getAll('endDate');
  const startDate = search_params.getAll('startDate');
  // --------------------------------
  let result = await getData(endDate, startDate)
  // try/catch blocks will be added later
  await res.send(result)
});

// app.patch('/todos/:id', (req, res) => {
//   const id = req.params.id;
//   const index = todos.findIndex((todo) => todo.id == id);
//   const completed = Boolean(req.body.completed);
//   if (index > -1) {
//     todos[index].completed = completed;
//   }
//   return res.send(todos[index]);
// });

const PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`Server running on port ${PORT}`.green.bold));
