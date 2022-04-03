const axios = require('axios').default;
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const { json } = require('body-parser');
const { nanoid } = require('nanoid');

dotenv.config({ path: './config.env' });

const app = express();

app.use(cors());
app.use(json());

let todos = [
  {
    id: nanoid(),
    title: 'todo 1',
    completed: true,
  },
  {
    id: nanoid(),
    title: 'todo 2',
    completed: false,
  },
  {
    id: nanoid(),
    title: 'todo 3',
    completed: false,
  },
  {
    id: nanoid(),
    title: 'todo 4',
    completed: false,
  },
  {
    id: nanoid(),
    title: 'todo 5',
    completed: false,
  },
];

async function getData() {
  try {
    const response = await axios.get('https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history?endDate=2022-01-26&startDate=2022-01-26');
    return response.data
  } catch (error) {
    return error
  }
}

app.get('/epiasDataByAPI', async (req, res) => {
  let result = await getData()
  await res.send(result)
});

const PORT = 7000;

app.listen(PORT, console.log(`Server running on port ${PORT}`.green.bold));