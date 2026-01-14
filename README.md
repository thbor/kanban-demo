# Kanban Board Application

A responsive Kanban board application built with React and TypeScript. Features drag-and-drop functionality, priority indicators, and mobile-responsive design.

## Features

- **Drag-and-drop cards** between columns
- **Priority indicators** (low, medium, high) with color coding
- **Card tagging system** for categorization
- **Assignee tracking** with avatar initials
- **Responsive design** that works on mobile and desktop
- **Real-time card counting** per column
- **Interactive UI** with hover effects and smooth transitions

## Live Demo

The application is running at [http://localhost:3000](http://localhost:3000) when started locally.

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Project Structure

```
src/
├── components/
│   ├── KanbanBoard.tsx    # Main board component with drag-and-drop
│   ├── KanbanColumn.tsx   # Column component with card counting
│   └── KanbanCard.tsx     # Individual card component
├── App.tsx                # Main application component
├── App.css                # Application styles
└── index.css             # Global styles with utility classes
```

## Deployment to GitHub Pages

To deploy this application to GitHub Pages:

1. **Create a new repository** on GitHub
2. **Update the remote URL**:
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
3. **Push your code**:
   ```bash
   git push -u origin main
   ```
4. **Install gh-pages**:
   ```bash
   npm install --save gh-pages
   ```
5. **Update package.json**:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
6. **Deploy**:
   ```bash
   npm run deploy
   ```

## Technologies Used

- React 19
- TypeScript
- CSS3 with custom utility classes
- HTML5 Drag and Drop API

## License

MIT
