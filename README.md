<div style="text-align: center;">
    <img src="assets/icons.svg" alt="Project Icon" width="200" height="100" />
</div>

# Sky Serve Builder Server

## Overview

Sky Serve Builder Server is a service that allows users to host websites by automating the process of building and deploying applications from Git repositories. This service runs as a Docker container, which clones a specified Git repository, builds the project, and uploads the resulting assets to cloud storage (S3 or GCS).

## Features

- Clone Git repositories from provided URLs.
- Build projects using defined build commands.
- Upload built assets to S3 or Google Cloud Storage.
- Docker container running the builder process in a isolated environment.

## Requirements

- Docker
- Node.js (for local development)
- Access to S3 or GCS credentials for deployment

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/peekaboo5149/sky-serve-builder-server.git
cd sky-serve-builder-server
```

### 2. Create an Environment File

Create a `.env` file in the root of the project with the following variables:

```
BUCKET_NAME=<your_bucket_name>
BLOB_STORE_REGION=<your_blob_store_region>
BLOB_STORE_ACCESS_KEY_ID=<your_access_key_id>
BLOB_STORE_SECRET_ACCESS_KEY=<your_secret_access_key>
GIT_REPOSITORY_URL=<your_git_repository_url>
PROJECT_ID=<your_project_id>
BLOB_STORE=S3
```

### 3. Build the Docker Image

```bash
docker build -t sky_server_build_server:1.0.0 .
```

### 4. Run the Docker Container

```bash
docker run --env-file ./.env sky_server_build_server:1.0.0
```

### 5. Process Flow

Once the container is run, it will:

- Clone the specified Git repository.
- Build the project.
- Upload the built assets to the configured cloud storage.
- Terminate automatically after completing the tasks.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Git](https://git-scm.com/) for version control.
- [Docker](https://www.docker.com/) for containerization.
- [AWS SDK](https://aws.amazon.com/sdk-for-node-js/) and [Google Cloud Storage Client](https://cloud.google.com/nodejs/docs/reference/storage/latest) for cloud storage integration.
