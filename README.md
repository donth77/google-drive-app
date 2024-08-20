# Google Drive App

## Overview

Allows the user to sign in with Google and lists Google Drive files in a table. Multiple files can be selected in the table to download or delete. Files can also be uploaded to Google Drive.

### Demo Video

https://github.com/user-attachments/assets/2a8bb871-6e4d-49da-822a-00494d9332cc

### Sign In

<img src="https://i.imgur.com/trdT63H.png" width="500">

### List Files

<img src="https://i.imgur.com/QzRAJJA.png" width="500">

### Upload

<img src="https://i.imgur.com/wDz4nD0.png" width="500">

### Download

<img src="https://i.imgur.com/vhZEeHv.png" width="500">

### Delete

<img src="https://i.imgur.com/OUCex5j.png" width="500">

## Dev Environment Setup

##### Prerequisities

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/getting-started)

Follow these steps to set up the development environment:

1. **Install dependencies**

   ```bash
   yarn
   ```

2. **Set up environment variables**

   - Add the required environment variables to the `.env` file:
     ```plaintext
     VITE_GDRIVE_API_KEY=your_api_key
     VITE_GDRIVE_CLIENT_ID=your_client_id
     ```
   - To get a client ID and API key ,from Google, go to your [Google Cloud Console](https://console.cloud.google.com/) and create a new project
   - Enable the Google Drive API in the Google Cloud console

[How to enable Google Drive API and get client credentials](https://www.iperiusbackup.net/en/how-to-enable-google-drive-api-and-get-client-credentials/)

## Running the App

Navigate to the live Site URL:

[https://google-drive-app-riqx.onrender.com](https://google-drive-app-riqx.onrender.com)

Or to run the application locally:

1.  Run the command:

    ```bash
    yarn dev
    ```

2.  Open web browser and navigate to `http://localhost:5173`

### Running tests

Run the command:

```bash
yarn test
```

## Built with

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Google Drive API](https://developers.google.com/drive/api/guides/about-sdk)
- [AG Grid](https://www.ag-grid.com/)
- [Material UI](https://mui.com/)
