# 📜 Available Scripts Documentation

This document outlines all available npm/yarn scripts in the Smart Fuel Station project, their purposes, usage examples, and expected outputs.

## 🚀 Development Scripts

### `dev`
**Purpose**: Starts the Vite development server with hot module replacement (HMR)
**Command**: 
```bash
npm run dev
# or
yarn dev
```
**Functionality**: 
- Launches local development server
- Enables hot module replacement for instant updates
- Provides source maps for debugging
- Watches for file changes and auto-reloads

**Expected Output**:
```bash
  VITE v5.0.0  ready in 342 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Common Use Cases**:
- Daily development work
- Testing component changes in real-time
- Debugging with browser dev tools
- Rapid prototyping

**Environment Variables Required**: None (optional for customization)

---

## 🏗️ Build Scripts

### `build`
**Purpose**: Creates optimized production build
**Command**:
```bash
npm run build
# or
yarn build
```
**Functionality**:
- Compiles TypeScript to JavaScript
- Bundles and minifies all assets
- Optimizes images and static files
- Generates source maps for production debugging
- Tree-shakes unused code

**Expected Output**:
```bash
vite v5.0.0 building for production...
✓ 120 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-4c3a2e1f.css   14.25 kB │ gzip:  3.77 kB
dist/assets/index-f7d8e2b1.js   186.43 kB │ gzip: 60.15 kB
✓ built in 2.84s
```

**Common Use Cases**:
- Preparing for production deployment
- Performance testing
- Bundle size analysis
- CI/CD pipeline integration

**Environment Variables Required**: 
- `VITE_*` variables for production configuration

---

### `preview`
**Purpose**: Preview the production build locally
**Command**:
```bash
npm run preview
# or
yarn preview
```
**Functionality**:
- Serves the built `dist/` folder
- Simulates production environment
- Tests build integrity locally
- Verifies static asset paths

**Expected Output**:
```bash
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Common Use Cases**:
- Final testing before deployment
- Verifying build output
- Performance testing with production assets
- Debugging production-specific issues

**Environment Variables Required**: Same as production deployment

---

## 🔍 Quality Assurance Scripts

### `lint`
**Purpose**: Run ESLint to check code quality and style
**Command**:
```bash
npm run lint
# or
yarn lint
```
**Functionality**:
- Analyzes JavaScript/TypeScript code
- Identifies potential bugs and code smells
- Enforces coding standards
- Reports style violations

**Expected Output** (Clean code):
```bash
✨ 42 files linted, no errors found
```

**Expected Output** (With issues):
```bash
src/components/Example.tsx
  15:7  error    'unused' is assigned a value but never used  @typescript-eslint/no-unused-vars
  23:1  warning  Missing return type annotation                @typescript-eslint/explicit-function-return-type

✖ 2 problems (1 error, 1 warning)
```

**Common Use Cases**:
- Pre-commit code validation
- Maintaining code quality standards
- Identifying potential bugs early
- Team code consistency

**Environment Variables Required**: None

---

### `lint:fix`
**Purpose**: Automatically fix linting issues where possible
**Command**:
```bash
npm run lint:fix
# or
yarn lint:fix
```
**Functionality**:
- Runs ESLint with `--fix` flag
- Automatically corrects formatting issues
- Fixes simple rule violations
- Reports remaining manual fixes needed

**Expected Output**:
```bash
✨ 42 files linted, 15 issues fixed automatically
⚠️  3 issues require manual attention
```

**Common Use Cases**:
- Quick code cleanup
- Preparing code for commits
- Bulk formatting corrections
- Onboarding new team members

---

## 🧪 Testing Scripts

### `test`
**Purpose**: Run the test suite (when configured)
**Command**:
```bash
npm run test
# or
yarn test
```
**Functionality**:
- Executes unit tests
- Runs integration tests
- Generates coverage reports
- Provides test result summary

**Expected Output**:
```bash
 PASS  src/components/FuelAmountSelector.test.tsx
 PASS  src/hooks/usePaymentSession.test.ts
 PASS  src/utils/validation.test.ts

Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        2.84s
```

**Common Use Cases**:
- Continuous integration
- Pre-deployment validation
- Regression testing
- Test-driven development

**Environment Variables Required**: 
- `NODE_ENV=test`
- Test-specific configuration variables

---

### `test:watch`
**Purpose**: Run tests in watch mode for development
**Command**:
```bash
npm run test:watch
# or
yarn test:watch
```
**Functionality**:
- Watches for file changes
- Re-runs affected tests automatically
- Provides interactive test runner
- Shows real-time test results

**Expected Output**:
```bash
 PASS  src/components/FuelAmountSelector.test.tsx
 PASS  src/hooks/usePaymentSession.test.ts

Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.
```

---

## 🔧 Utility Scripts

### `type-check`
**Purpose**: Run TypeScript compiler for type checking only
**Command**:
```bash
npm run type-check
# or
yarn type-check
```
**Functionality**:
- Validates TypeScript types
- Checks for type errors
- Verifies interface compliance
- Reports compilation issues

**Expected Output** (Success):
```bash
✅ TypeScript compilation completed successfully
No type errors found in 42 files
```

**Expected Output** (Errors):
```bash
src/components/PaymentForm.tsx:15:7
Error: Type 'string' is not assignable to type 'number'

src/hooks/usePaymentSession.ts:32:12
Error: Property 'amount' does not exist on type 'PaymentSession'

Found 2 errors in 2 files.
```

**Common Use Cases**:
- Pre-commit validation
- IDE integration
- CI/CD type safety checks
- Refactoring verification

---

### `format`
**Purpose**: Format code using Prettier
**Command**:
```bash
npm run format
# or
yarn format
```
**Functionality**:
- Formats code according to Prettier rules
- Ensures consistent code style
- Formats multiple file types (JS, TS, CSS, MD)
- Integrates with editor settings

**Expected Output**:
```bash
src/components/FuelAmountSelector.tsx 127ms
src/hooks/usePaymentSession.ts 89ms
src/types/fuel.ts 45ms
✨ 3 files formatted
```

---

## 🚀 Deployment Scripts

### `deploy:vercel`
**Purpose**: Deploy to Vercel platform
**Command**:
```bash
npm run deploy:vercel
# or
yarn deploy:vercel
```
**Functionality**:
- Builds production version
- Uploads to Vercel
- Configures custom domain
- Sets up environment variables

**Environment Variables Required**:
```bash
VERCEL_TOKEN="your-vercel-token"
VERCEL_PROJECT_ID="your-project-id"
```

---

### `deploy:netlify`
**Purpose**: Deploy to Netlify platform
**Command**:
```bash
npm run deploy:netlify
# or
yarn deploy:netlify
```
**Functionality**:
- Creates optimized build
- Uploads to Netlify CDN
- Configures redirects
- Sets up form handling

**Environment Variables Required**:
```bash
NETLIFY_SITE_ID="your-site-id"
NETLIFY_AUTH_TOKEN="your-auth-token"
```

---

## 📊 Analysis Scripts

### `analyze`
**Purpose**: Analyze bundle size and dependencies
**Command**:
```bash
npm run analyze
# or
yarn analyze
```
**Functionality**:
- Generates bundle analysis report
- Identifies large dependencies
- Shows code splitting opportunities
- Provides optimization recommendations

**Expected Output**:
- Opens browser with interactive bundle analyzer
- Shows detailed dependency tree
- Highlights optimization opportunities

---

### `lighthouse`
**Purpose**: Run Lighthouse performance audit
**Command**:
```bash
npm run lighthouse
# or
yarn lighthouse
```
**Functionality**:
- Measures performance metrics
- Checks accessibility compliance
- Validates SEO best practices
- Generates detailed reports

**Expected Output**:
```bash
Performance: 95/100
Accessibility: 98/100
Best Practices: 92/100
SEO: 100/100
```

---

## 🔧 Custom Script Configuration

### Adding New Scripts
To add custom scripts, modify `package.json`:

```json
{
  "scripts": {
    "custom:script": "your-command-here",
    "db:migrate": "prisma migrate dev",
    "seed:data": "tsx scripts/seed.ts"
  }
}
```

### Script Chaining
Combine multiple scripts:
```json
{
  "scripts": {
    "full-check": "npm run type-check && npm run lint && npm run test",
    "deploy:production": "npm run build && npm run lighthouse && npm run deploy:vercel"
  }
}
```

### Cross-platform Compatibility
Use cross-env for environment variables:
```json
{
  "scripts": {
    "dev:production": "cross-env NODE_ENV=production npm run dev"
  }
}
```

## 📝 Best Practices

1. **Always test before deploying**: Run `npm run build && npm run preview`
2. **Use type checking**: Regular `npm run type-check` catches issues early
3. **Lint before commits**: Set up pre-commit hooks with `npm run lint`
4. **Monitor bundle size**: Regular `npm run analyze` prevents bloat
5. **Environment consistency**: Use same Node.js version across environments

## 🚨 Troubleshooting

### Common Issues and Solutions

**Build Fails**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**TypeScript Errors**:
```bash
# Update TypeScript and regenerate types
npm update typescript
npm run type-check
```

**Linting Issues**:
```bash
# Fix auto-fixable issues first
npm run lint:fix
# Then address remaining issues manually
npm run lint
```