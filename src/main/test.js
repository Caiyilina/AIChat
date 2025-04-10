import axios from 'axios'
import * as cheerio from 'cheerio'
const url = 'https://www.cheeriojs.cn/docs/intro'
const response = await axios.get(url, {
  timeout: 5000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
})
const $ = cheerio.load(response.data)
console.log($('title').text())
