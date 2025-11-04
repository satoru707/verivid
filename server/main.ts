import express from 'express'

const app = express()

app.get('/health', (req, res) => {
  res.json({ error: null, data: {timestamp: Date.now()} })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
})