# CI/CD

This App has a _Continuous Integration_ via _Github Actions_.

## How?

Files responsible for any integration are placed at `.github/workflows`. These files watch for changes on the codebase. It's up to us, to analyze those changes and decide if we wanna trigger an "Action". Actions could be _"running tests on files, deploying our App on a Hosting Service, etc"_

### Where Actions run?

The run on `Github`. We can watch them over here `https://github.com/mariobrusarosco/best-shot/actions`.

## Active Actions

### Deploy

#### When

We deploy our App _everytime_ we `push` code to our _main_ branch.

#### Where

1. To `Staging`, at `best-shot-staging.mariobrusarosco.com`.
2. To `Production`, at `best-shot.mariobrusarosco.com`
