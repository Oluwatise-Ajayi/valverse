# Catch Hearts Game - V2 Improvements

## 🎉 Major Enhancements

### 1. **Lives System** ❤️
- **3 Lives**: Players start with 3 hearts
- **Lose Life on Miss**: Every time a heart falls off the screen without being caught, player loses 1 life
- **Visual Feedback**: 
  - Lives displayed as heart icons in top-left corner
  - Red hearts = remaining lives
  - Gray hearts = lost lives
  - Camera shake effect when losing a life
- **Game Over**: When all 3 lives are lost, game ends

### 2. **Beautiful Forest Background** 🌲☁️
- **Sky**: Beautiful gradient sky blue background (#87CEEB)
- **Animated Clouds**: 4 fluffy clouds slowly moving across the sky
- **Trees**: 4 stylized trees positioned at the edges of the screen
- **Grass Ground**: Green grass strip at the bottom (0x7cb342)
- **Depth Layers**: Proper z-index layering for realistic scene

### 3. **Improved Basket Design** 🧺
- **Wicker Pattern**: Detailed basket with weave pattern
- **Gradient Fill**: Brown gradient for realistic look
- **Handle**: Curved handle on top
- **Highlights**: Subtle light reflections
- **Larger Size**: 80x60 instead of 64x64 for easier gameplay

### 4. **PC Width Constraint** 💻
- **Max Width**: Limited to `max-w-4xl` (896px) on larger screens
- **Centered**: Game container centered on PC screens
- **Responsive**: Still works on all screen sizes
- **Better Gameplay**: Prevents overly wide play area on ultrawide monitors

### 5. **Enhanced Visual Effects** ✨
- **Heart Rotation**: Hearts spin while falling for more dynamic movement
- **Flash Effect**: Pink flash when catching a heart
- **Camera Shake**: Screen shakes when losing a life
- **Game Over Screen**: 
  - Semi-transparent overlay
  - White card with final score
  - "Play Again" button
  - Shows in-game and as React overlay

### 6. **Improved UI/UX** 🎨
- **Lives Display**: Heart icons in top-left with white background
- **Score Display**: Enhanced with better positioning
- **Instructions**: Updated to reflect gameplay ("Catch hearts! Don't let them fall!")
- **Game Over Modal**: Beautiful overlay with final score and restart button

## 📂 New Assets Created

1. **`/assets/basket.svg`** - Improved wicker basket with gradient and handle
2. **`/assets/cloud.svg`** - Fluffy white cloud with shadow
3. **`/assets/tree.svg`** - Stylized forest tree with foliage
4. **`/assets/life-heart.svg`** - Heart icon for lives display (created but using lucide-react instead)

## 🎮 Updated Game Mechanics

### Lives System Flow
```
Start: 3 Lives (❤️ ❤️ ❤️)
Miss 1 heart → 2 Lives (❤️ ❤️ 🖤) + Camera Shake
Miss 2 hearts → 1 Life (❤️ 🖤 🖤) + Camera Shake
Miss 3 hearts → 0 Lives (🖤 🖤 🖤) + GAME OVER
```

### Spawn Rate
- Changed from 1000ms to 1200ms (slightly slower for better balance)
- Hearts fall at 180-280 pixels/second (adjusted range)

### Visual Layers (z-index)
- `0`: Background (sky, clouds, trees)
- `1`: Ground/grass
- `2`: Player basket
- `3`: Falling hearts
- `10`: UI elements (score, lives text)
- `11`: Game over text
- `20`: React game over overlay

## 🎯 Game Balance

- **Lives**: 3 (challenging but fair)
- **Spawn Rate**: 1.2 seconds (balanced)
- **Fall Speed**: 180-280 px/s (variable difficulty)
- **Player Speed**: 400 px/s (responsive controls)

## 📱 Mobile Optimizations

- Touch controls still work perfectly
- Responsive container (min 500px on mobile, 600px on desktop)
- Lives display scales appropriately
- All UI elements adapt to screen size

## 🚀 How to Play

1. **Navigate** to `/play/catch-hearts`
2. **Catch falling hearts** with your basket
3. **Don't miss!** You only have 3 lives
4. **Score points** for each heart caught
5. **Game Over** when you lose all 3 lives
6. **Restart** by clicking the "Play Again" button

## 🎨 Color Scheme

- **Sky**: #87CEEB (Sky Blue)
- **Grass**: #7cb342 (Green)
- **Basket**: #cd853f → #8b4513 (Brown Gradient)
- **Trees**: #4a7c59 → #2d5a3d (Green Gradient)
- **Hearts**: #ff6b9d → #ff1744 (Pink/Red Gradient)
- **UI Background**: white/90 (Semi-transparent white)

## 🔄 Restart Functionality

Two ways to restart:
1. **In-Game**: Click anywhere when game over screen appears
2. **React Overlay**: Click "Play Again" button for full page reload

## ✅ All Improvements Complete

- ✅ 3-lives system implemented
- ✅ Forest background with clouds and trees
- ✅ Better basket design
- ✅ Width constraint on PC (max-w-4xl)
- ✅ Beautiful visual effects
- ✅ Game over screen
- ✅ Mobile responsive
- ✅ Touch controls working

**Status: Ready to play!** 🎉
