const excelToJson = require('convert-excel-to-json')
const fs = require('fs')

const excel = excelToJson({
  sourceFile: './1st_part.xlsx',
  columnToKey: {
    A: 'photos',
    B: 'sizes',
    C: 'brand',
    D: 'model',
    E: 'color',
    F: 'code',
    G: 'price',
    H: 'category'
  }
})

const products = excel[Object.keys(excel)[0]]

const photoNames = fs.readdirSync('./photos')
photoNames.forEach(n => {
  const name = n.replace(/\s/g, '').replace(/-/g, '').replace(/'/g, '')
  fs.renameSync(`./photos/${n}`, `./photos/${name}`)
})

const result = products.map(p => {
  const now = new Date()
  p.photos = p.photos.replace(/new_pictures\//g, '')
  p.photos = p.photos
    .replace(/\s/g, '')
    .replace(/-/g, '')
    .replace(/'/g, '')
    .split(',')
  p.sizes = p.sizes
    .toLowerCase()
    .replace(/ us/gi, '')
    .replace(/ eu/gi, '')
    .split(',')

  p.createdAt = {
    $date: now
  }
  p.updateAt = {
    $date: now
  }
  return p
})

fs.writeFileSync('./products.json', JSON.stringify(result), 'utf8')
