# Volition API

Stryds API for Mobile App
<details>
<summary><h2>Techs and port</h2></summary>

## Techs
Node.js, Express.js, Firebase

## Port
8001

## Swagger
```
/Stryds-swagger-api-test
```

</details>

<details>
<summary><h2>To get started</h2></summary>

### Requirements

1. Latest Node (currently 14.9.0)
2. Yarn v1

### Common

1. Copy .env.example to .env

```sh
# Copy files to non-example filenames, ie `.env.example -> .env`,
# but only if the destination doesn't already exist.
for src in .*.example; do dst="${src%.example}" && ([[ -f "$dst" ]] || cp -av "$src" "$dst"); done
```

### Native

Use node v14.2.0 or up

**1. Install packages**

```
yarn
```

**2. To run in dev mode:**

```
yarn start
```

## Linting

**To run linter:**

```
yarn lint
```

**To run typescript:**

```
yarn check-types
```

**To run tests:**

```
yarn test
```
</details>

<details>
<summary><h2>Auth</h2></summary>

## Get All Users Data
```
get /api/v1/auth/all
```

## Login
```
get /api/v1/auth/login/:email/:password
```

## Signin
```
put /api/v1/auth/signin
```

## Update Demographic Data
```
put /api/v1/auth/update
```
</details>
