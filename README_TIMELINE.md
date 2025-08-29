# Timeline – Documentation

## Overview
The project timeline is rendered on the `/timeline.html` page.  
All timeline events are stored in a dedicated data file: `_data/timeline.yml`.  
Styles are located in `assets/css/timeline.css`.

This setup makes it easy to maintain and extend the timeline by editing only one YAML file.

---

## Adding a New Event
1. Open `_data/timeline.yml`.
2. Add a new entry following the same structure:

```yaml
- year: 1865
  type: "H"
  title: "Example Historical Event"
  description: "A short description of the event."
  characters: ["Character A", "Character B"]
