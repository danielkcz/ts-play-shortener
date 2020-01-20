import * as express from 'express'
import * as cors from 'cors'
import { getConfig } from './config'
import { getEntry } from './store'
import { handleNewEntry } from './entry'

const app = express()

// Automatically allow cross-origin requests
app.use(cors({ origin: true }))

app.get<{ slug: string }>('/:slug', async (req, res) => {
  const entry = await getEntry(req.params.slug)
  if (entry) {
    const baseUrl = getConfig('playground', 'baseurl')
    res.redirect(`${baseUrl}${entry.source}`)
  } else {
    res.sendStatus(404)
  }
})

// Keep sources mapped to slugs just to ease on DB read/write
// for repeated attempts at saving the playground code
const slugCache = new Map<string, string>()

app.post('/add', async (req, res) => {
  const { source } = req.body
  if (!source) {
    res.sendStatus(422)
    return
  }

  const slug = slugCache.get(source) ?? (await handleNewEntry(source))
  if (slug) {
    slugCache.set(source, slug)
    const baseUrl = getConfig('redirector', 'baseurl')
    res
      .status(200)
      .type('text')
      .send(`${baseUrl}/${slug}`)
    return
  }

  res.sendStatus(409)
})

module.exports = app
