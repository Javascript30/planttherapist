# PlantTherapist

PlantTherapist is a plant-care web app designed to help users monitor and maintain healthy plants. The site combines plant tracking with guidance for diagnosing issues, managing care routines, and making better decisions about watering, lighting, and overall plant health.

## What the site does

The app is built around a simple idea: a user maintains a collection of plants and receives helpful recommendations based on each plant's condition. Common features for this kind of app include:

- adding and managing plants
- viewing plant profiles and care details
- tracking plant health over time
- identifying symptoms or stress indicators
- receiving advice for watering, nutrients, and environment
- reviewing a dashboard for routine upkeep and plant wellness

## Intended user experience

A typical user journey is:

1. Sign in or access the app.
2. Add plants to their account.
3. Record care information such as type, environment, and notes.
4. Review health status or diagnose issues.
5. Get recommendations to help the plant recover or stay healthy.
6. Continue monitoring the plant through a dashboard or care log.

## Project purpose

PlantTherapist is essentially a digital plant assistant. It gives plant owners a structured way to keep track of their plants, understand common problems, and apply useful care routines without having to remember everything manually.

## Technology direction

The project appears to be a web application using a Python-based backend, HTML/CSS/JS frontend, and a containerized setup for easier development and deployment. The overall goal is to make plant care more accessible, organized, and proactive.

## Automatic deployment with DockerHub and Render

The GitHub Actions workflow at `.github/workflows/cicd.yml` can build and publish the Docker image to DockerHub, then trigger deployment on Render using a deploy hook URL. Add these repository secrets under **Settings → Secrets and variables → Actions**:

- `DOCKERHUB_USERNAME`: DockerHub username
- `DOCKERHUB_TOKEN`: DockerHub access token with push permission
- `RENDER_DEPLOY_HOOK`: Render service deploy hook URL

Example workflow code:

```yaml
name: CI/CD

on:
	push:
		branches: [main]
	workflow_dispatch:

jobs:
	build-and-deploy:
		runs-on: ubuntu-latest
		steps:
			- name: Check out repository
				uses: actions/checkout@v4

			- name: Log in to DockerHub
				uses: docker/login-action@v3
				with:
					username: ${{ secrets.DOCKERHUB_USERNAME }}
					password: ${{ secrets.DOCKERHUB_TOKEN }}

			- name: Build and push Docker image
				uses: docker/build-push-action@v6
				with:
					context: .
					push: true
					tags: ${{ secrets.DOCKERHUB_USERNAME }}/planttherapist:latest

			- name: Trigger Render deployment
				env:
					RENDER_DEPLOY_HOOK: ${{ secrets.RENDER_DEPLOY_HOOK }}
				run: curl --fail --silent --show-error -X POST "$RENDER_DEPLOY_HOOK"
```

Configure the Render service to deploy the same DockerHub image. Keep the deploy hook URL in a GitHub secret rather than committing it to the repository.

The CI/CD workflow also runs automatic database migrations during deployment, ensuring the app's schema stays in sync with the latest release without needing a manual migration step.

### Auto Migrations

#### Backfill
```bash
    npm run db:generate -- --custom --name:backfill_email_address
```
```sql
    -- Custom SQL migration file, put your code below! --
    UPDATE "subscribers" SET "email_address" = "email" WHERE "email_address" IS NULL;
    -- populates the NULL email with email from email column to email_address column
```
## Summary

In short, PlantTherapist is a gardening and plant wellness app focused on helping users care for plants more intelligently. It blends plant management, health insight, and practical recommendations into a single experience for everyday plant owners.