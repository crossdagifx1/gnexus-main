# 🤝 Contributing to G-Nexus

Thank you for your interest in contributing to G-Nexus! This guide will help you get started.

## Development Workflow

### 1. Fork and Clone

```bash
# Clone the repository
git clone https://github.com/your-username/gnexus-main.git
cd gnexus-main

# Add upstream remote
git remote add upstream https://github.com/original-owner/gnexus-main.git
```

### 2. Create a Feature Branch

Always create a new branch from `develop`:

```bash
# Update develop branch
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name
```

**Branch naming conventions**:
- `feature/` - New features (e.g., `feature/user-authentication`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `docs/` - Documentation updates (e.g., `docs/api-guide`)
- `refactor/` - Code refactoring (e.g., `refactor/payment-module`)
- `test/` - Adding tests (e.g., `test/chat-component`)

### 3. Make Your Changes

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Make your changes in your editor
# Test your changes locally
```

### 4. Run Quality Checks

Before committing, ensure your code passes all checks:

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Run type checking
npm run type-check

# Run tests
npm run test

# Build the project
npm run build
```

### 5. Commit Your Changes

We follow conventional commit messages:

```bash
git add .
git commit -m "feat: add user profile page"
```

**Commit message format**:
```
<type>: <description>

[optional body]

[optional footer]
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Build process or tooling changes

**Examples**:
```bash
git commit -m "feat: add dark mode toggle"
git commit -m "fix: resolve chat message rendering bug"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify authentication logic"
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to GitHub repository
2. Click **Pull Request** → **New Pull Request**
3. Select `develop` as the base branch
4. Select your feature branch as the compare branch
5. Fill out the PR template:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Type checking passes
- [ ] Documentation updated (if needed)
```

### 8. Code Review

- Address review comments promptly
- Push additional commits to the same branch
- Be respectful and constructive in discussions

### 9. Merge

Once approved:
- The maintainer will merge your PR into `develop`
- Your changes will be deployed to the test environment
- After testing, they'll be merged to `main` for production

## Development Setup

### Prerequisites

- **Node.js**: v20 or higher
- **npm**: v9 or higher
- **Git**: Latest version

### Environment Setup

1. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

2. Add your environment variables:
   ```bash
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-key"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` types when possible
- Use type inference where appropriate

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = (id: string): Promise<User> => {
  // ...
}

// ❌ Bad
const getUser = (id: any): any => {
  // ...
}
```

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Use descriptive component names
- Extract reusable logic into custom hooks

```tsx
// ✅ Good
export const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const { user, loading } = useUser(userId);
  
  if (loading) return <LoadingSpinner />;
  
  return <div>{user.name}</div>;
}

// ❌ Bad
export default function Component(props: any) {
  // ...
}
```

### File Organization

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and libraries
├── types/            # TypeScript type definitions
└── styles/           # Global styles
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('renders user name', () => {
    render(<UserProfile userId="123" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## Pull Request Guidelines

### PR Size

- Keep PRs small and focused
- One feature/fix per PR
- Large changes should be split into multiple PRs

### PR Description

- Clearly describe what the PR does
- Include screenshots for UI changes
- Link to related issues
- List breaking changes (if any)

### Review Process

1. At least one approval required
2. All CI checks must pass
3. No merge conflicts with base branch
4. Code follows style guidelines

## Getting Help

- **Documentation**: Check `README.md` and `DEPLOYMENT.md`
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to G-Nexus! 🎉
