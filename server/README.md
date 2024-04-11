# Project Documentation

## Introduction

This project aims to create a robust image processing and management system that efficiently handles image uploads, performs automatic annotations using AI, implements user authentication and authorization, and provides a review and approval workflow for administrators.

## Tech Stack

- Backend Server: NestJs
- Image Storage: Firebase Storage
- Image Annotation: Google Cloud Vision

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository_url>
   ```

2. Install dependencies:

   ```bash
   cd <project_directory>
   npm install
   ```

3. Set up Firebase configuration:

   - Create a Firebase project and obtain the necessary credentials.
   - Configure Firebase in the project.

4. Set up Google Cloud Vision API:

   - Select or create a Cloud Platform project.
   - Enable billing for your project.
   - Enable the Google Cloud Vision API API.
   - Set up authentication with a service account so you can access the API from your local workstation.

5. Configure environment variables:

   - Set up environment variables for Firebase and Google Cloud Vision credentials. Refer to `.env.example` to see what's necessary to run the project.

6. Run the server:

   ```bash
   npm run start:debug
   ```

## Features

1. Automatic priority annotation
2. Manual annotations
3. Rate Limiting API calls - image uploads
4. JWT Token based authentication with `Bearer` token and Cookie based authentication for admins.

## Usage

### Image Upload

- Users can upload images from the mobile frontend.
- Images are securely stored in Firebase storage.

### Automatic Annotation

- Upon image upload, automatic annotations are performed using Google Cloud Vision API.
- Annotations provide preliminary insights into image content.

### User Authentication

- Users need to authenticate using their credentials to access the system.
- Admins have additional privileges for managing users and image workflows.

### Review & Approval

- Admins can review annotated images and approve or reject them based on accuracy and relevance.
- Approved images can proceed to further processing steps.

### Data Export

- Admins can export the data in `csv` or `json` format for all the approved images.

## Future Scope

- Better Documentation Support with Swagger
- Implement more robust authentication system with refresh tokens and magic link sign-in.
- Cron jobs to clean-up database with unused or revoked tokens.
- Reduce Google Cloud Vision API calls by implementing annotation queues and priority annotations for paid users.
- Robust error handling with database queues to deal with it later.
- Add python microservice for image annotations using HTTP requests/Message brokers
