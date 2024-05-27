# WhiteBlob Streaming Documentation

## Overview

WhiteBlob Streaming is a React.js-based web application that allows users to stream videos, including movies and shows, in multiple resolutions ranging from 144p to 1080p. Registered users can also upload their own videos and stream them on the platform. The application leverages modern web technologies and libraries to provide a seamless streaming experience.

## Features

- **Video Streaming:** Stream videos in resolutions from 144p to 1080p.
- **User Registration:** Register and log in to upload and manage your own videos.
- **Video Uploading:** Registered users can upload videos to the platform.
- **Responsive Design:** Optimized for various devices and screen sizes.
- **Customizable Player:** Integrated with `react-player` for flexible video playback.

## Technologies Used

- **React:** Frontend library for building user interfaces.
- **HLS.js:** JavaScript library for playing HLS (HTTP Live Streaming) videos.
- **React Player:** A customizable video player component for React.
- **Axios:** HTTP client for making requests to the backend.
- **React Router:** For handling routing within the application.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **UUID:** For generating unique identifiers.
- **Testing Libraries:** Jest, React Testing Library for testing components.
- **Prettier:** Code formatter to ensure consistent code style.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tidancadlab/whiteBLOB.git
   cd whiteBLOB
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the application in development mode, run:
```bash
npm start
```
This will start the application on port 80.

### Building for Production

To create a production build of the application, run:
```bash
npm run build
```
The build artifacts will be stored in the `build/` directory.

### Running Tests

To execute the tests for the application, run:
```bash
npm test
```

## Directory Structure

```
whiteBLOB/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── VideoPlayer.js
│   │   ├── VideoUpload.js
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── ...
├── .eslintrc.js
├── .prettierrc
├── package.json
└── ...
```

## Key Dependencies

- **React (`react`, `react-dom`):** Core library for building the user interface.
- **React Router (`react-router-dom`):** For navigation and routing.
- **React Player (`react-player`):** Video player component.
- **HLS.js (`hls.js`):** For handling HLS video streaming.
- **Axios (`axios`):** For making HTTP requests.
- **Tailwind CSS (`tailwindcss`, `tailwind-merge`):** For styling.
- **UUID (`uuid`):** For generating unique identifiers.
- **Testing Libraries (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`):** For testing the application.
- **Prettier (`prettier`, `prettier-plugin-tailwindcss`):** For code formatting.

## Configuration

### Environment Variables

Create a `.env` file in the root directory to define any necessary environment variables. Example:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Prettier Configuration

The application uses Prettier for code formatting. The configuration is defined in `.prettierrc`:
```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "useTabs": false,
    "endOfLine": "auto",
    "arrowParens": "always",
    "printWidth": 160,
    "bracketSameLine": true,
    "trailingComma": "all",
    "plugins": [
        "prettier-plugin-tailwindcss"
    ]
}
```

## Deployment

To deploy the application, follow these steps:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `build/` directory to your web server or hosting service.

## Contribution

We welcome contributions to improve WhiteBlob Streaming. To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes.
4. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
5. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a pull request on GitHub.

## License

This project is licensed under the MIT License.

---

For any further questions or support, please contact us at [info@whiteblob.site](mailto:info@whiteblob.site).
