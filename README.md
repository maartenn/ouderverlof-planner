## Verlofplanner: Overzicht

Deze verlofplanner is een React-applicatie, ontwikkeld met TypeScript en Tailwind CSS, om gebruikers te helpen bij het plannen van verlof rondom gezinsuitbreiding. De applicatie is ontworpen om flexibel en gebruiksvriendelijk te zijn, en biedt een overzicht van beschikbare verlofuren en de mogelijkheid om verschillende verloffases te plannen.

### Functionele Samenvatting

*   **Verlofplanning:** Gebruikers kunnen verlofperiodes definiëren, inclusief start- en einddatums, en verschillende verloftypes (geboorteverlof, aanvullend geboorteverlof, ouderschapsverlof, vakantiedagen) combineren.
*   **Werkpatroon:** De planner stelt gebruikers in staat om hun reguliere werkpatroon in te voeren, inclusief flexibele uren en verschillende werkdagen per week.
*   **Verlofberekening:** De applicatie berekent automatisch het totale aantal verlofdagen en -uren op basis van de ingevoerde gegevens, en geeft een overzicht van het resterende verlof per type.
*   **URL-gebaseerde Status:** De applicatie slaat de huidige status op in de URL, waardoor het eenvoudig is om de planning te delen en later verder te werken.
*   **Export:** De planning kan worden geëxporteerd naar Excel of PDF voor administratieve doeleinden.
*   **Meertaligheid:** De applicatie is beschikbaar in het Nederlands en Engels.

### Technische Samenvatting

*   **React & TypeScript:** De applicatie is gebouwd met React voor de gebruikersinterface en TypeScript voor typeveiligheid en codeonderhoud.
*   **Tailwind CSS:** Tailwind CSS wordt gebruikt voor styling, wat zorgt voor een consistente en responsive lay-out.
*   **Date-fns:** Date-fns wordt gebruikt voor het bewerken en weergeven van datums.
*   **React Router:** React Router wordt gebruikt voor client-side routing, waardoor de applicatie navigeerbaar is.
*   **I18next:** I18next wordt gebruikt voor internationalisatie, waardoor de applicatie gemakkelijk in meerdere talen kan worden aangeboden.
*   **Lucide React:** Lucide React wordt gebruikt voor iconen.
*   **Vite:** Vite wordt gebruikt als build tool voor snelle laadtijden en een efficiënte ontwikkelomgeving.
*   **URL-gebaseerde Status:** De applicatie maakt gebruik van `base64` encoding om de status in de URL op te slaan, waardoor het eenvoudig is om de planning te delen en later verder te werken.
*   **Testen:** Vitest wordt gebruikt voor unit tests, met code coverage rapportage.
