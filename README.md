# React Full Stack Starter-Kit

A complete boilerplate with React + NextJS SSR, GraphQL API and Relay.

## Project Structure

The top-level directly layout looks as follows:

```bash
.
├── packages/                   # Shared components (modules) managed by Lerna
├── api/                        # GraphQL API gateway
├── web/                        # NextJS website
├── lerna.json                  # Lerna configuration
└── package.json                # List of project dependencies
```

## Tech Stack

- [React][react] for building component-based UIs ([docs][reactdocs])
- [NextJS][nextjs] for building SSR websites ([docs][nextjsdocs])
- [GraphQL][gqljs] and [Relay][relay] for declarative data fetching and maximum performance
- [Babel][babel] + [Flow][flow] for modern JavaScript syntax with static type checking

## Prerequisites

- [Node.js][node] v9 or higher + [Yarn][yarn] package manager
- [Lerna][lerna] a tool for managing JavaScript projects with multiple packages
- [Watchman][watchman] a file watcher used by Relay
- [Docker][docker] Community Edition v17 or higher (only for the API project)
- [VS Code][code] editor (preferred) + [Project Snippets][vcsnippets],
  [EditorConfig][vceditconfig], [ESLint][vceslint], [Flow][vcflow], and [Prettier][vcprettier]
  plug-ins.

## Getting Started

**Start API**

```bash
$ cd api
$ yarn                          # Install Node.js dependencies)
$ yarn start                    # Build and launch API service
```

**Start WEB**

```bash
$ cd web
$ yarn                          # Install Node.js dependencies)
$ yarn dev                      # Build and launch WEB service
```

# Task

## Setup

## Database

- Create a new migration file using the yarn script

```bash
$ yarn db-change your-migration-name:
```

- Edit the newly created migration file to add the following 3 new columns to the properties table:

```
- land_surface (float)
- number_of_rooms (float)
- number_of_parkings (int)
```

- Run migration

```bash
$ yarn db-migrate
```

## API

- Add new fields to PropertyType and PropertyInputType
- Update the validator and the migration to make the new fields work

## WEB

- Create a form to upsert a property on this page (we recommend using Formik)
- Create a new page to display all created properties

## Bonus

- Deploy the project somewhere on the web (AWS Labmda, Google Cloud Functions, Zeit, Heroku...)

## Submit

- Send us a link of your repo
- Bonus: Send us a link to your deployed application

# Mockups

![](https://res.realadvisor.ch/fetch//https://storage.googleapis.com/img-dev.realadvisor.ch/imjvhaxukv__property.png)

![](https://res.realadvisor.ch/fetch//https://storage.googleapis.com/img-dev.realadvisor.ch/glbjottofx__properties.png)

[react]: https://reactjs.org/
[reactdocs]: https://reactjs.org/docs/
[nextjs]: https://nextjs.org/
[nextjsdocs]: https://nextjs.org/docs/
[gqljs]: http://graphql.org/graphql-js/
[relay]: http://facebook.github.io/relay/
[sc]: https://www.styled-components.com/
[scdocs]: https://www.styled-components.com/docs
[babel]: http://babeljs.io/
[flow]: https://flow.org/
[node]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[lerna]: https://lernajs.io/
[watchman]: https://facebook.github.io/watchman/
[docker]: https://www.docker.com/community-edition
[code]: https://code.visualstudio.com/
[vcsnippets]: https://marketplace.visualstudio.com/items?itemName=rebornix.project-snippets
[vceditconfig]: https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig
[vceslint]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[vcflow]: https://marketplace.visualstudio.com/items?itemName=flowtype.flow-for-vscode
[vcprettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
