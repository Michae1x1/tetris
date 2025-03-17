# Neon Tetris

A modern implementation of the classic Tetris game with a neon aesthetic and enhanced features. Built using vanilla JavaScript, HTML5 Canvas, and CSS3.

### Play @ https://michae1x1.github.io/tetris/

## Features

-  Classic Tetris gameplay mechanics
-  Neon visual design with glowing effects
 

## Game Controls

- **←/→ Arrow Keys**: Move piece left/right
- **↑ Arrow Key**: Rotate piece
- **↓ Arrow Key**: Soft drop
- **Space Bar**: Hard drop
- **Alt Key**: Hold piece
- **P Key**: Pause/Resume game

## Scoring System

- Single line clear: 100 × level
- Double line clear: 300 × level
- Triple line clear: 500 × level
- Tetris (4 lines): 800 × level

## Technical Implementation

### Core Components

- **Canvas Rendering**: Uses HTML5 Canvas for game graphics
- **Piece Movement**: Implements collision detection and rotation systems
- **Ghost Piece**: Shows where the current piece will land
- **Hold System**: Allows storing one piece for later use
- **Level System**: Increases speed and difficulty progressively
- **High Score System**: Maintains top 5 scores using localStorage

### Code Structure

- `index.html`: Game structure and UI elements
- `style.css`: Neon styling and responsive design
- `script.js`: Game logic and mechanics


## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera


## Contributing

Feel free to contribute to this project.


## Known Issues

- Some browsers might have varying performance
- Alt-key might conflict with browser shortcuts

## Future Enhancements

- Touch controls for mobile devices
- Online multiplayer support
- Additional visual themes
- Sound effects and background music
- Additional game modes
- Global leaderboard
