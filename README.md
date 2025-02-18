# Neon Tetris

A modern implementation of the classic Tetris game with a neon aesthetic and enhanced features. Built using vanilla JavaScript, HTML5 Canvas, and CSS3.

## Features

- 🎮 Classic Tetris gameplay mechanics
- 💫 Neon visual design with glowing effects
- 🏆 High score system with local storage
- 🎯 Next piece preview
- 💼 Piece holding functionality
- 👻 Ghost piece preview
- ⏸️ Pause/Resume functionality
- 🎚️ Progressive difficulty with increasing levels
- 🎯 Score multiplier system
  

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

### Key Features Implementation

1. **Piece Movement & Rotation**
   - Collision detection system
   - Wall kick implementation
   - SRS (Super Rotation System) based rotation

2. **Scoring & Levels**
   - Progressive difficulty
   - Score multiplier system
   - Level-based speed adjustment

3. **Visual Effects**
   - Neon glow effects using CSS
   - Ghost piece preview
   - Next piece preview
   - Hold piece display

4. **Game State Management**
   - Pause/Resume functionality
   - Game over detection
   - High score tracking

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera


## Contributing

Feel free to contribute to this project!

## License

This project is released under the MIT License.

## Known Issues

- Some browsers might have varying performance
- Alt key might conflict with browser shortcuts

## Future Enhancements

- Touch controls for mobile devices
- Online multiplayer support
- Additional visual themes
- Sound effects and background music
- Additional game modes
- Global leaderboard
