# ESG Geburtstags
Webapp to show all birthdays in ESG Aachen.

## Deployment
We suggest deploying the App using [Docker](https://docker.com). To do so, there is a `Dockerfile` in the root of the repository.

### Building the container
Currently, the environment variables are built into the container at build time.
Therefore, supply them to `docker build` as build arguments.

> [!WARNING]
> Because environment variables are built into the containers, do not share them.
> If you need to change the configuration, build a new container.

To build the container, run the following command in the project root:
```sh
docker build \
  --build-arg "UCS_BASE_URL=<base-url>" \
  --build-arg "UCS_USERNAME=<username>" \
  --build-arg "UCS_PASSWORD=<password>" \
  -t <tag> .
```

#### Trusting self-signed certificates
If you need to trust a self-signed certificate, supply the
certificate that should be trusted and uncomment
the corresponding lines in the `Dockerfile` before building the
container.

### Running the server
The service is exposed on port `3000`, so make sure
to publish and map the port accordingly.

Example when running using the CLI:
```sh
docker run -p 80:3000 <tag>
```

## Development
The app is written in [Next.js](https://nextjs.org) using App Router.

### Dependencies
The app requires `node` to be installed. To install the other dependencies, execute the
following command from the project root:
```sh
npm i
```

### Running the dev server
Then, use this command to run the development server:

```bash
npm run dev
```
