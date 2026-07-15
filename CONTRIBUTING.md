# 🤝 Contributing to FIFA StadiumOS

Thank you for your interest in contributing! To maintain high code quality and secure GenAI implementations, please read the following guidelines.

## Code Quality Standards

- **TypeScript**: All additions must be type-safe. Run `npx tsc --noEmit` to verify type checking passes before opening a Pull Request.
- **ESLint**: Lint guidelines must be followed. Run `npm run lint` or `eslint` to check syntax.
- **Tailwind CSS**: Use utility classes styled dynamically under our design system. Avoid writing plain CSS.

## Pull Request Guidelines

1. Fork the repository and create your feature branch: `git checkout -b feature/amazing-feature`.
2. Follow descriptive commit guidelines (e.g. `feat: add shuttle schedules`, `fix: correct visual alignment`).
3. Make sure all tests pass.
4. Open a Pull Request referencing the related issue or feature spec.
5. Code reviews are required by at least one core maintainer before merging.

## Coding Style Rules

- We use standard ES Modules imports.
- Reusable UI elements must be created under `src/components/ui/` with proper ARIA accessibility labels.
- Sensitive environment keys must NEVER be checked into git. Always declare mock fallbacks for local tests.
