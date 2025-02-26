# GitHub Actions for Shift SlackBot

This directory contains GitHub Actions workflows for the Shift SlackBot project.

## Continuous Integration (CI)

The main CI workflow (`ci.yml`) runs on every push to the main/master branch and on every pull request. It performs the following steps:

1. **Setup**: Checks out the repository and sets up Node.js (testing on multiple versions)
2. **Install**: Installs dependencies for the main project and all components
3. **Build**: Builds all TypeScript components
4. **Test**: Runs the test suite to ensure everything works correctly

## Status Badge

You can add the following badge to your README to show the current status of the CI workflow:

```markdown
![Shift SlackBot CI](https://github.com/yourusername/slack-bot/workflows/Shift%20SlackBot%20CI/badge.svg)
```

## Adding More Workflows

To add additional workflows, create new YAML files in this directory. For example:

- `deploy.yml` - For deployment to production
- `lint.yml` - For running linting checks
- `release.yml` - For creating releases

## Troubleshooting

If the CI workflow fails, check the following:

1. Make sure all dependencies are correctly specified in package.json files
2. Ensure TypeScript is properly configured in all tsconfig.json files
3. Look for failing tests and fix the underlying issues
4. Verify that the build process completes successfully for all components