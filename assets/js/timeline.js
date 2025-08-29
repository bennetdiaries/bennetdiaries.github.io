document.addEventListener('DOMContentLoaded', function() {
    // Získání dat z _config.yml (Jekyll je převede na JSON)
    // Pozor: Toto je speciální Jekyll syntaxe, která funguje jen v souborech .js, které mají na začátku ---
    const timelineData = JSON.parse('{{ site.timeline | jsonify }}');
    const siteBaseUrl = '{{ site.baseurl }}';

    const container = document.getElementById('timeline-container');
    if (!container || !timelineData) return;

    const startYear = timelineData.start_year;
    const endYear = timelineData.end_year;
    const totalDuration = endYear - startYear;

    // 1. Vykreslení fází
    timelineData.phases.forEach(phase => {
        const phaseEl = document.createElement('div');
        phaseEl.className = 'timeline-phase';
        const [phaseStart, phaseEnd] = phase.period.split('-').map(Number);
        const left = ((phaseStart - startYear) / totalDuration) * 100;
        const width = ((phaseEnd - phaseStart) / totalDuration) * 100;
        
        phaseEl.style.left = `${left}%`;
        phaseEl.style.width = `${width}%`;
        phaseEl.style.backgroundColor = phase.color;

        const phaseLabel = document.createElement('div');
        phaseLabel.className = 'phase-label';
        phaseLabel.textContent = phase.name;
        phaseEl.appendChild(phaseLabel);
        
        container.appendChild(phaseEl);
    });

    // 2. Vykreslení událostí
    timelineData.events.forEach((event, index) => {
        const eventEl = document.createElement('div');
        eventEl.className = `timeline-event event-${index % 2 === 0 ? 'up' : 'down'}`;
        eventEl.dataset.type = event.type;

        const position = ((event.year - startYear) / totalDuration) * 100;
        eventEl.style.left = `${position}%`;

        const marker = document.createElement('div');
        marker.className = 'marker';
        
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

        marker.addEventListener('click', () => showModal(event));
    });

    // 3. Ovládání modálního okna
    const modal = document.getElementById('event-modal');
    const closeBtn = modal.querySelector('.close-button');
    
    function showModal(event) {
        modal.querySelector('#modal-title').textContent = event.title;
        modal.querySelector('#modal-date').textContent = event.year;
        modal.querySelector('#modal-description').textContent = event.description;
        modal.querySelector('#modal-significance').textContent = event.significance;
        
        const link = modal.querySelector('#modal-link');
        if (event.entry_link) {
            let url = event.entry_link.includes('/') ? `${siteBaseUrl}/${event.entry_link}.html` : `${siteBaseUrl}/entries/${event.entry_link}.html`;
            if (event.entry_link === 'about') url = `${siteBaseUrl}/about.html`;
            
            link.href = url;
            link.style.display = 'block';
        } else {
            link.style.display = 'none';
        }
        modal.style.display = 'flex';
    }
    
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

    // 4. Ovládání filtrů
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            document.querySelector('.filter-btn.active').classList.remove('active');
            button.classList.add('active');

            document.querySelectorAll('.timeline-event').forEach(eventEl => {
                eventEl.style.display = (filter === 'all' || eventEl.dataset.type === filter) ? 'block' : 'none';
            });
        });
    });
}); 
