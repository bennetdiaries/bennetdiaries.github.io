document.addEventListener('DOMContentLoaded', function() {
    // Získání dat z _config.yml (Jekyll je převede na JSON)
    const timelineData = {{ site.timeline | jsonify }};
    const characters = {{ site.characters | jsonify }};

    const container = document.getElementById('timeline-container');
    if (!container || !timelineData) return;

    const startYear = timelineData.start_year;
    const endYear = timelineData.end_year;
    const totalDuration = endYear - startYear;

    // Vykreslení událostí
    timelineData.events.forEach((event, index) => {
        const eventEl = document.createElement('div');
        eventEl.className = `timeline-event event-${index % 2 === 0 ? 'up' : 'down'}`;
        eventEl.dataset.type = event.type;

        const position = ((event.year - startYear) / totalDuration) * 100;
        eventEl.style.left = `${position}%`;

        const marker = document.createElement('div');
        marker.className = 'marker';
        
        // Najdi postavu a barvu
        const characterInfo = timelineData.characters.find(c => c.id === event.type);
        if (characterInfo) {
            marker.style.backgroundColor = characterInfo.color;
        }

        const title = document.createElement('div');
        title.className = 'event-title';
        title.textContent = `${event.year}: ${event.title}`;

        eventEl.appendChild(marker);
        eventEl.appendChild(title);
        container.appendChild(eventEl);

        // Přidání interakce po kliknutí
        marker.addEventListener('click', () => showModal(event));
    });

    // Ovládání modálního okna
    const modal = document.getElementById('event-modal');
    const closeBtn = document.querySelector('.close-button');
    
    function showModal(event) {
        document.getElementById('modal-title').textContent = event.title;
        document.getElementById('modal-date').textContent = event.year;
        document.getElementById('modal-description').textContent = event.description;
        document.getElementById('modal-significance').textContent = event.significance;
        
        const link = document.getElementById('modal-link');
        if (event.entry_link) {
            // Jekyll vytvoří správné odkazy, ale zde musíme hádat
            const url = `{{ site.baseurl }}/entries/${event.entry_link.toLowerCase().replace(/ /g, '-')}.html`;
            link.href = url;
            link.style.display = 'block';
        } else {
            link.style.display = 'none';
        }
        modal.style.display = 'flex';
    }
    
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Ovládání filtrů
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Zvýraznění aktivního tlačítka
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filtrace událostí
            document.querySelectorAll('.timeline-event').forEach(eventEl => {
                if (filter === 'all' || eventEl.dataset.type === filter) {
                    eventEl.style.display = 'block';
                } else {
                    eventEl.style.display = 'none';
                }
            });
        });
    });
});
