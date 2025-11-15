# FPTP Challenge - Interactive Game

## Overview

The FPTP Challenge is an interactive educational game that demonstrates the problems with First Past The Post voting. Players test their intuition by guessing the popular vote share for UK general elections, revealing the disconnect between votes and seats won.

## How It Works

### Game Flow

1. **Selection Screen**: Players choose from 10 historical UK general elections (1983-2024)
2. **Guess Screen**: For each election, players see:
   - The election year and leader
   - The seat majority won
   - A slider to guess the vote share (30-60%)
3. **Feedback**: Immediate feedback on accuracy with comparison to actual results
4. **Results**: Final score and performance insights

### Scoring System

- **10 points**: Within 2 percentage points of actual vote share
- **5 points**: Within 2-5 percentage points
- **0 points**: Off by more than 5 percentage points

Maximum score: 100 points (10 elections × 10 points)

## Key Features

### 1. Fun CSS Animations
- Smooth slide-in animations when loading challenges
- Interactive slider with smooth transitions
- Feedback animations that draw attention to results
- Responsive design that works on mobile and desktop

### 2. Election Data
Covers 10 historically significant elections:
- **2024**: Starmer's record-low vote share win (33.7%)
- **2019**: Johnson's landslide (43.6%)
- **2017**: May's lost majority (-16 seats)
- **2015**: Cameron's coalition (36.8%)
- **2010**: Conservative-LibDem coalition (59.2% combined)
- **2005**: Blair's 35.2% win with 318 seats
- **2001**: Blair's second landslide (40.7%)
- **1997**: Blair's historic victory (43.2%)
- **1992**: Major's narrow majority (41.9%)
- **1983**: Thatcher's landslide (42.4%)

### 3. Educational Insights
After completing the challenge, players receive:
- Overall score and percentage
- Performance statistics
- Best and worst guesses
- Key insights about FPTP problems

## File Structure

```
proportional.uk/
├── fptp-challenge.html          # Main FPTP Challenge page
├── css/
│   └── fptp-challenge.css       # Challenge-specific styles and animations
├── js/
│   └── fptp-challenge.js        # Game logic and interactivity
└── index.html                   # Main page with link to challenge
```

## Technical Implementation

### HTML (`fptp-challenge.html`)
- GOV.UK design consistency
- Semantic structure for accessibility
- Two main stages: challenge and results

### CSS (`fptp-challenge.css`)
- Modern animations using keyframes
- CSS Grid and Flexbox for responsive layout
- Smooth transitions and hover effects
- Mobile-first responsive design
- Custom CSS variables for consistency

### JavaScript (`fptp-challenge.js`)
- Object-oriented game class
- State management for game progression
- Dynamic HTML rendering based on state
- Score calculation and feedback generation
- Performance analytics and insights

## Animations

The challenge uses several CSS animations:

- **slideInUp**: Cards fade in and move up when loading
- **slideInDown**: Feedback messages slide down
- **fadeIn**: Values update smoothly
- **spin**: Loading spinner (if needed)

All animations use cubic-bezier timing functions for smooth, natural motion.

## Responsive Design

- **Desktop**: Full slider, large text, grid layouts
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Single-column layout, optimized button sizes, touch-friendly slider

## Educational Value

This challenge teaches:

1. **FPTP Unpredictability**: Vote shares vary widely (33.7% to 59.2%) for winning results
2. **Vote-to-Seat Mismatch**: Same vote share can yield vastly different seat totals
3. **Coalition Anomalies**: 2010 showed how coalitions create 59% majorities
4. **Historical Context**: Players learn key election outcomes and implications

## Integration

The FPTP Challenge is linked from the main AMS+ page (`index.html`) with a prominent call-to-action box, encouraging users to experience the problems with FPTP before learning about AMS+ solutions.

## Future Enhancements

Possible additions:
- Difficulty levels (easy/hard vote share ranges)
- Multiplayer/competitive modes
- Additional elections from other countries
- Detailed historical context for each election
- Share results functionality

