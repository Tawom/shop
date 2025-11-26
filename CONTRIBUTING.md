# Contributing to E-Commerce Platform

Thank you for considering contributing to this project! This document provides guidelines for contributing.

## 🎯 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Features

1. Check if the feature has been requested
2. Create an issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit**: `git commit -m 'Add: feature description'`
6. **Push**: `git push origin feature/your-feature-name`
7. **Create Pull Request**

## 📝 Coding Standards

### JavaScript/React
- Use ES6+ syntax
- Follow React Hooks best practices
- Use functional components
- Keep components small and focused
- Use meaningful variable/function names

### Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues: "Fix: resolve login bug (#123)"

### Code Style
```javascript
// Good
const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Avoid
function fetchProducts(){
  return api.get('/products').then(r=>r.data).catch(e=>console.log(e))
}
```

## 🧪 Testing

- Test your changes locally
- Ensure no console errors
- Test on different screen sizes
- Verify API responses

## 📚 Documentation

- Update README if adding features
- Add JSDoc comments for complex functions
- Update API documentation if changing endpoints

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.
