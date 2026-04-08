# Productivity Dashboard

A modern, intelligent daily planner featuring glassmorphism design, smooth interactions, and powerful task management.

---

> UI inspiration taken from [tuf+](https://takeuforward.org/)

---

## Features

### Core Dashboard

- **Fluid Calendar Grid**  
  Fully dynamic calendar that adapts to each month without heavy third-party libraries.

- **Glassmorphism UI**  
  Translucent panels, backdrop blur, and smooth hover interactions.

- **Dynamic Seasonal Backgrounds**  
  Background changes automatically based on the current month.

---

### Task & Priority Management

- **Timed Tasks**  
  Schedule tasks with automatic chronological sorting and quick completion toggles.

- **Draggable Priority Notes**  
  Flexible notes with drag-and-drop reordering.

- **Multi-Day Bulk Sync**  
  Duplicate tasks or notes across multiple selected dates.

---

### Tracking & Portability

- **Streak Tracking**  
  Track consistency by completing all daily tasks.

- **Data Import/Export**  
  Export or import schedules using `.csv`.

---

## Tech Stack

| Technology | Purpose |
|-----------|--------|
| Next.js (App Router) | Modern frontend architecture |
| Tailwind CSS | Styling and layout |
| Framer Motion | Animations and drag interactions |
| Custom Hooks (`useCalendar.ts`) | State management with localStorage |
| Flexbox | Responsive layout system |

---

## Demo

Demo video: *(add your link here)*  
Live app: *(add Vercel link here)*

---

## Screenshots

![Dashboard Screenshot](./public/screenshot.png)

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)

---

### Installation

```bash
npm install
```

---

### Run the App

```bash
npm run dev
```

---

### Open in Browser

```
http://localhost:3000
```

---

## Project Structure

```bash
/app        # App router pages
/components # UI components
/hooks      # Custom hooks
/utils      # Helper functions
/public     # Static assets
```

---

## Future Improvements

- Cloud sync (Firebase / Supabase)
- Authentication
- Multi-device sync
- AI-based task suggestions
- Mobile optimization

---

## Contributing

Feel free to fork the repository and submit a pull request.

---

## License

MIT License