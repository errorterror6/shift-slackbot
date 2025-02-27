# Shift SlackBot

![Shift SlackBot CI](https://github.com/yourusername/slack-bot/workflows/Shift%20SlackBot%20CI/badge.svg)

## Project Overview
This SlackBot application integrates Slack with Google Calendar and ChatGPT to help teams manage shifts, schedule meetings, and provide AI-assisted responses to common questions.

## Learning Outcomes
This portfolio project has a few learning outcomes
- Learn how to work with latest AI assistants.
- Gain experience working and integrating API's
- fine tune a LLM, based on existing concepts found in papers such as deepseek r1's rf method.

As learning to use AI conflicts with learning the concepts themselves, the code is separated into two sections
- folder "ai-code" will be almost all AI generated, AI reviewed and AI debugged. it will satisfy the first learning outcome and provide a sample implementation (assuming it works) if I get stuck on the second learning outcome.
- folder "shift-slackbot" will be implemented by hand, with minimal AI assistance beyond autocompletion or simple function generation.
- Finally, after the MVP works, the LLM will be fine-tuned for this task - to be completed with minimal AI assistance.

## Features
- **Shift Request Detection**: Automatically detects when someone needs their shift covered
- **Calendar Integration**: Checks your Google Calendar for availability before responding
- **Automatic Responses**: Responds to shift requests when you're available
- **Calendar Management**: Adds accepted shifts to your Google Calendar
- **Class Time Handling**: Understands different class formats (M16B, H11A, etc.)
- **Component Recognition**: Distinguishes between tutorial, lab, or both tutorial+lab requests

## Project Structure
```
/
├── slack-api/         # Slack Bot API implementation
├── gcal-integration/  # Google Calendar integration services
├── chatgpt-api/       # ChatGPT API integration
└── front-end/         # Optional web dashboard interface
```

## Technology Stack
- Node.js
- TypeScript
- Slack API (Bolt framework)
- Google Calendar API
- ChatGPT API
- React (for front-end)

## Prerequisites
- Node.js (v16+) and npm
- Slack Workspace with admin privileges
- Google Cloud account with Calendar API enabled
- OpenAI API key

## Setup and Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd slack-bot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the example configuration file:
```bash
cp .env.example .env
```

Then edit the `.env` file with your API keys and configuration details:
- Slack Bot Token and Signing Secret
- Google Cloud API credentials
- OpenAI API key

### 4. Build the project
```bash
npm run build
```

### 5. Run the application
```bash
npm start
```

Alternatively, you can run the web dashboard:
```bash
cd front-end
npm start
```

## Usage

### Slack Configuration
1. Create a Slack App in the [Slack API Console](https://api.slack.com/apps)
2. Add the Bot User OAuth Token to your `.env` file
3. Subscribe to the `message.channels` event
4. Install the app to your workspace

### Google Calendar Configuration
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google Calendar API
3. Create OAuth credentials and configure the redirect URI
4. Get a refresh token by authorizing with your Google account

### Bot Functionality
The bot will:
1. Monitor messages in the configured Slack channel
2. Detect shift coverage requests using pattern matching and NLP
3. Check your Google Calendar for availability during the requested time
4. Automatically respond to requests if you're available
5. Add accepted shifts to your Google Calendar with the appropriate details

## Development

### Running in Development Mode
```bash
npm run dev
```

### Testing
```bash
npm test
```

### Continuous Integration
This project uses GitHub Actions for continuous integration. Every push and pull request triggers:
- Building all components
- Running unit tests
- Verifying the project structure

## License
MIT