const fs = require('fs');
const path = require('path');

describe('Project Build Tests', () => {
  test('package.json exists and is valid', () => {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    expect(packageJson).toHaveProperty('name');
    expect(packageJson).toHaveProperty('version');
    expect(packageJson).toHaveProperty('scripts');
    expect(packageJson.scripts).toHaveProperty('build');
  });

  test('main component package.json files exist', () => {
    const components = ['slack-api', 'gcal-integration', 'chatgpt-api', 'front-end'];
    
    for (const component of components) {
      const componentPackageJsonPath = path.join(__dirname, '..', component, 'package.json');
      expect(fs.existsSync(componentPackageJsonPath)).toBe(true);
      
      const packageJson = JSON.parse(fs.readFileSync(componentPackageJsonPath, 'utf8'));
      expect(packageJson).toHaveProperty('name', component);
    }
  });

  test('TypeScript configuration files exist', () => {
    const tsConfigPath = path.join(__dirname, '..', 'tsconfig.json');
    expect(fs.existsSync(tsConfigPath)).toBe(true);
    
    const components = ['slack-api', 'gcal-integration', 'chatgpt-api', 'front-end'];
    
    for (const component of components) {
      const componentTsConfigPath = path.join(__dirname, '..', component, 'tsconfig.json');
      expect(fs.existsSync(componentTsConfigPath)).toBe(true);
    }
  });

  test('main source files exist', () => {
    const sourceFiles = [
      path.join(__dirname, '..', 'slack-api', 'src', 'index.ts'),
      path.join(__dirname, '..', 'gcal-integration', 'src', 'index.ts'),
      path.join(__dirname, '..', 'chatgpt-api', 'src', 'index.ts'),
      path.join(__dirname, '..', 'front-end', 'src', 'index.tsx'),
      path.join(__dirname, '..', 'front-end', 'src', 'App.tsx')
    ];
    
    for (const file of sourceFiles) {
      expect(fs.existsSync(file)).toBe(true);
    }
  });
});