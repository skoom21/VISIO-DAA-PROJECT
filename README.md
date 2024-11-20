# VISIO - Algorithm Visualization Platform ![VISIO Logo](gui/my-app/public/visio-logo.svg#bg=white)
## Design and Analysis of Algorithms (Fall 2024)
### Project Part 2

**Group Members:**
- M.Talha Yousif (22k-5146)
- Rehan Khan (22k-5031)
- Ruhan Ahmed (22k-6014)

**Instructor:** Dr. Nasir Uddin

## Project Overview
VISIO is an interactive web application designed to visualize complex algorithms in computational mathematics and geometry. The platform currently features two main algorithms:

1. **Karatsuba Multiplication Algorithm**
    - Visualizes the recursive multiplication process
    - Shows step-by-step breakdown of the algorithm
    - Includes performance metrics and complexity analysis
    - Supports file input for custom test cases

2. **Closest Pair of Points Algorithm**
    - Implements the line-sweep approach
    - Interactive visualization with step-by-step playback
    - Real-time display of algorithm states
    - Supports both random point generation and file input

## Technical Stack
- Next.js (React Framework)
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)
- React Flow (for graph visualization)
- Shadcn/ui (for UI components)

## Features

### Karatsuba Algorithm Visualizer
- Input validation for numbers
- Visual representation of recursive calls
- Performance metrics:
  - Execution time
  - Number of recursive calls
  - Time and space complexity analysis
- Support for file upload (JSON format)
- Interactive graph visualization

### Closest Pair Visualizer
- Interactive canvas-based visualization
- Step-by-step algorithm progression
- Animation controls (play, pause, step forward/backward)
- Dynamic point generation
- File upload support for custom point sets
- Real-time visualization of:
  - Frontier set
  - Current sweep line
  - Zone of interest
  - Closest pair found so far

## Getting Started

1. **Installation**
    ```bash
    npm install
    # or
    yarn install
    ```

2. **Running the Development Server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

3. **Building for Production**
    ```bash
    npm run build
    # or
    yarn build
    ```

## File Input Format

### Karatsuba Algorithm
```json
{
  "x": 1234,
  "y": 5678
}
```

### Closest Pair
```json
[
  [x1, y1],
  [x2, y2],
  ...
]
```

## Performance Characteristics

### Karatsuba Algorithm
- Time Complexity: O(n^log₂3) ≈ O(n^1.585)
- Space Complexity: O(log n)

### Closest Pair Algorithm
- Time Complexity: O(n log n)
- Space Complexity: O(n)

## Notes
- The application includes a loading screen with the VISIO logo
- Both visualizations include detailed performance metrics and algorithm states
- The UI is fully responsive and supports dark/light modes
- All file uploads validate both filename and content format

## Future Enhancements
1. Additional algorithm visualizations
2. Enhanced animation controls
3. Export functionality for visualization states
4. Comparative analysis between different algorithms
5. Educational mode with step-by-step explanations

## Acknowledgments
Special thanks to Dr. Nasir Uddin for guidance.