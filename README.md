```markdown
# Product Listing Application

A modern React application built with TypeScript and Vite that features a product listing page with search, category filtering, and a favorites system.

## Features

-   **Product Listing**: Displays a grid of products showing title, price, category, image, and a favorite toggle.
-   **Search & Filter**: Real-time search by product name (with debouncing for better performance) and filtering by category.
-   **Favorites Management**: Add/remove products from favorites with state persisted via Redux.
-   **Responsive Design**: Fully responsive layout that works seamlessly on desktop and mobile devices.
-   **Comprehensive Testing**: Unit and integration tests using Vitest and React Testing Library.
-   **Test Coverage**: Easy generation of coverage reports for code quality assurance.

## Project Structure
```

src/
├─ components/ # Reusable UI components
├─ features/ # Redux slices (products and favorites)
├─ pages/ # Page-level components (e.g., ProductList)
├─ utils/ # Helper functions and utilities
├─ App.tsx # Main application component
└─ main.tsx # Application entry point

````

## Getting Started

### Installation

First, install the dependencies:

```bash
npm install
````

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in the console).

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` folder.

### Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage report:

```bash
npx vitest run --coverage
```

Coverage reports are generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in your browser to view the detailed HTML report.

#### Testing Notes

-   Unit tests focus on individual components and utilities.
-   Integration tests verify interactions between the product list, search input, filters, and favorite functionality.
-   Debounced search behavior is tested using Vitest's fake timers for reliable results.

<img width="1917" height="866" alt="image" src="https://github.com/user-attachments/assets/85617a91-176a-4f59-991a-d62b1f6a24f1" />


## Additional Information

-   **State Management**: Redux Toolkit is used for managing global state (products and favorites).
-   **Type Safety**: Full TypeScript support for improved developer experience and maintainability.
-   **Code Quality**: ESLint is configured to enforce consistent styling and catch potential issues early.

```

```
