import { g, auth, config } from '@grafbase/sdk'

// @ts-ignore
const User = g.model('User', {
  name: g.string().length({ min: 2, max: 20 }),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().optional(),
  githubUrl: g.url().optional(),
  linkedInUrl: g.url().optional(),
  projects: g.relation(() => Project).list().optional(),
}).auth((rules) => {
  return rules.public().read() // Explicitly return rules
})

// @ts-ignore
const Project = g.model('Project', {
  title: g.string().length({ min: 3, max: 20 }),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url(),
  category: g.string().search(),
  createdBy: g.relation(() => User),
}).auth((rules) => {
  return rules.public().read(), // Explicitly return rules
    rules.private().create().delete().update() // Explicitly return rules
})

const jwt = auth.JWT({
  issuer: 'grafbase',
  secret: g.env('NEXTAUTH_SECRET'),
})

export default config({
  schema: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private(),
  },
})
