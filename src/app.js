const cheerio = require('cheerio')
const superagent = require('superagent')
const HttpRequest = require('superagent-charset')(superagent)
const fs = require('fs')
const path = require('path')

// 要爬去的目标网络地址
const personUrl = 'http://fcfantasy.cn/fe2015/character/growth_rates.html'
const classcalUrl = 'http://fcfantasy.cn/fe2015/class/growth_rates.html'
const baseUrl = 'http://fcfantasy.cn/fe2015'
// 请求函数
const Request = (url, charset) => {
  return new Promise(resolve => {
    HttpRequest.get(url).charset(charset).then(res => {
      const data = res.text
      // console.log(data)
      const $ = cheerio.load(data)
      // console.log($)
      resolve($)
    })
  })
}

// 获取人物数据
Request(personUrl, 'utf-8').then(res => {
  // console.log(res)
  const $ = res
  const persons = []
  $('.type2 tr').each((i, el) => {
    if ($(el).find('img').attr('src')) {
      const img = $(el).find('img').attr('src')
      // console.log(typeof avatar)
      const avatar = img.replace(/../, baseUrl)
      const person = {
        avatar,
        name: $(el).find('img').attr('alt'),
        growth: {
          hp: $(el).find('td').eq(2).text(),
          strength: $(el).find('td').eq(3).text(),
          magic: $(el).find('td').eq(4).text(),
          skill: $(el).find('td').eq(5).text(),
          speed: $(el).find('td').eq(6).text(),
          luck: $(el).find('td').eq(7).text(),
          defense: $(el).find('td').eq(8).text(),
          mdf: $(el).find('td').eq(9).text()
        }
      }
      persons.push(person)
    }
  })
  if (fs.existsSync(path.join(__dirname, './data/person.json'))) {
    fs.unlinkSync(path.join(__dirname, './data/person.json'))
  }
  fs.writeFileSync(path.join(__dirname, './data/person.json'), JSON.stringify(persons, '', 2), err => {
    if (err) console.log(err)
  })
}).catch(err => {
  console.log(err)
})

// 获取职业数据
Request(classcalUrl, 'utf-8').then(res => {
  const $ = res
  const classcals = []
  $('.type2 tr').each((i, el) => {
    if ($(el).find('th').eq(0).text() !== '职业名称') {
      const classcal = {
        name: $(el).find('th').eq(0).text(),
        growth: {
          hp: $(el).find('td').eq(0).text(),
          strength: $(el).find('td').eq(1).text(),
          magic: $(el).find('td').eq(2).text(),
          skill: $(el).find('td').eq(3).text(),
          speed: $(el).find('td').eq(4).text(),
          luck: $(el).find('td').eq(5).text(),
          defense: $(el).find('td').eq(6).text(),
          mdf: $(el).find('td').eq(7).text()
        }
      }
      classcals.push(classcal)
      // console.log(classcals)
    }
  })
  if (fs.existsSync(path.join(__dirname, './data/classcals.json'))) {
    fs.unlinkSync(path.join(__dirname, './data/classcals.json'))
  }
  fs.writeFileSync(path.join(__dirname, './data/classcals.json'), JSON.stringify(classcals, '', 2), err => {
    if (err) console.log(err)
  })
})