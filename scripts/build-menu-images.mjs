import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
// Images extracted without retouching from the restaurant's menu PDF.
const sources = {
  'kitfo':'p03-04', 'doro-wot':'p03-05', 'siga-firfir':'p03-06',
  'doro-tibs':'p03-02', 'dekak-tibs':'p03-08', 'dulet':'p04-08',
  'yeawaze-tibs':'p03-07', 'merek-tibs':'p04-11', 'shekla-tibs':'p03-03',
  'key-wot':'p04-09', 'dinch-be-siga':'p04-07', 'bozena-shiro':'p04-10',
  'half-half':'p04-12', 'misir-wot':'p05-03', 'kik-wot':'p05-05',
  'gomen-be-dinch':'p05-07', 'keysir':'p05-01', 'tikil-gomen':'p05-04',
  'fosolia':'p05-06', 'shiro':'p05-02', 'alicha-dinich':'p06-05',
  'firfir':'p05-08', 'suf-fitfit':'p06-04', 'pasta':'p06-07',
  'salad':'p06-03', 'timatim-kurt':'p06-09', 'veggie-rice':'p06-02',
  'karya-sineg':'p06-06', 'plain-rice':'p06-08',
  'meat-combo':'p07-10', 'vegan-combo':'p07-08', 'basket':'p07-09',
  'tej':'p08-04', 'coffee':'p08-03',
  'step-tear':'p04-06', 'step-scoop':'p04-02', 'step-eat':'p04-04',
}
await mkdir('public/food', {recursive:true})
const sizes = {}
for (const [name, source] of Object.entries(sources)) {
  const width = name.endsWith('combo') ? 860 : name.startsWith('step-') ? 320 : 360
  const result = await sharp(`reference/menu-images/${source}.png`)
    .resize({width, withoutEnlargement:true}).webp({quality:76, alphaQuality:80}).toFile(`public/food/${name}.webp`)
  await sharp(`reference/menu-images/${source}.png`)
    .resize({width, withoutEnlargement:true}).avif({quality:50, effort:4}).toFile(`public/food/${name}.avif`)
  sizes[name] = {width:result.width,height:result.height}
}
await writeFile('src/content/food-sizes.json',JSON.stringify(sizes,null,2)+'\n')
console.log(`Prepared ${Object.keys(sizes).length} menu images`)
