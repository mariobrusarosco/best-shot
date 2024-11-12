# Local Env Setup

## Install

We need to initialize a local Database. This project uses Postgres, so we need to:

- Install Postgres on the machine (It will vary depending on the OS)
- Create a user with a password
- Crete a database (recommended name 'bestshot')
- Set a _connection string_ inside the `.env` under the name of _DB_CREDENTIALS_

`DB_CREDENTIALS="postgresql://{userNameHere}:{passwordHere}@localhost:5432/{dbNameHere}"`

e.g. `DB_CREDENTIALS="postgresql://jonh_doe:12345@localhost:5432/best-shot"`

- Apply the last versioned migration using `Drizzle`

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

- create a Member - a local member of the App

```
yarn drizzle-kit studio
```

Then access `https://local.drizzle.studio`. Use Studio's UI to create a Member
