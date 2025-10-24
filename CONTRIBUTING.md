# Contributing to @content-growth/content-widget

Thank you for your interest in contributing! We welcome contributions from the community.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- TypeScript knowledge (for core contributions)
- Framework knowledge (React, Vue, or Astro for framework-specific contributions)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/content-package.git
   cd content-package
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

### Project Structure

```
src/
├── core/       # Framework-agnostic API client
├── widget/     # Vanilla JavaScript widget
├── react/      # React components and hooks
├── vue/        # Vue components and composables
├── astro/      # Astro components
├── types/      # TypeScript type definitions
└── styles.css  # Widget styles
```

### Building

```bash
npm run build
```

This will:
1. Compile TypeScript to JavaScript
2. Generate type definitions
3. Copy Astro components
4. Copy widget files
5. Copy CSS

### Testing

```bash
# Run TypeScript compiler
npm run dev

# Test in a local project
npm link
cd /path/to/test-project
npm link @content-growth/content-widget
```

## Making Changes

### Code Style

- Use TypeScript for new code
- Follow existing code style
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add new feature`
- `fix: fix bug`
- `docs: update documentation`
- `style: format code`
- `refactor: refactor code`
- `test: add tests`
- `chore: update dependencies`

### Pull Requests

1. Update documentation if needed
2. Add tests if applicable
3. Ensure build passes: `npm run build`
4. Write a clear PR description
5. Link related issues

## Adding Framework Support

Want to add support for a new framework? Great!

### Steps

1. Create a new directory: `src/your-framework/`
2. Implement components using the vanilla JS widget
3. Add framework-specific utilities (hooks, composables, etc.)
4. Update `package.json` exports
5. Update README with examples
6. Add to peer dependencies if needed

### Example Structure

```
src/svelte/
├── BlogList.svelte
├── BlogPost.svelte
├── stores.ts (if needed)
└── index.ts
```

## Reporting Issues

### Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Framework and version
- Browser and version
- Code example (if possible)

### Feature Requests

Include:
- Description of the feature
- Use case
- Proposed API (if applicable)
- Alternatives considered

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other unethical or unprofessional conduct

## Questions?

- Open an issue for questions
- Email: support@content-growth.com
- Discord: [Coming soon]

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
