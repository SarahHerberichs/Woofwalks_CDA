import { useState } from 'react';

import MyPastEvents from '../components/Lists/MyPassedEvents';
import MyPublications from '../components/Lists/MyPublications';
import UpcomingWalks from '../components/Lists/UpcomingWalks';

const MyActivity = () => {
    const [activeView, setActiveView] = useState(null);

    const handleLinkClick = (viewName) => (e) => {
        e.preventDefault();
        setActiveView(activeView === viewName ? null : viewName);
    };

    // Fonction pour déterminer le composant à afficher
    const renderActiveComponent = () => {
        switch (activeView) {
            case 'mypassedevents':
                return <MyPastEvents />;
            case 'publications':
                return <MyPublications />;
            case 'appointments':
                return <UpcomingWalks />;
            default:
                return null;
        }
    };

    const LinkItem = ({ viewName, children }) => {
        const isActive = activeView === viewName;

        let itemClasses = "list-group-item list-group-item-action py-3 d-flex justify-content-between align-items-center";

        if (isActive) {
            itemClasses += " active bg-light text-dark border-secondary";
        }

        return (
            <a
                href="#"
                onClick={handleLinkClick(viewName)}
                className={itemClasses}
                style={isActive ? { textDecoration: 'none' } : {}}
            >
                <h5 className="my-0 fs-5 fw-semibold">{children}</h5>

                <i className={`bi bi-${isActive ? 'chevron-down' : 'chevron-right'} text-${isActive ? 'dark' : 'secondary'}`}></i>
            </a>
        );
    };

    return (
        <div className="container py-5">
            <h1 className="display-5 border-bottom pb-3 mb-4">Mon Activité</h1>

            <div className="list-group list-group-flush">
                <LinkItem viewName="mypassedevents">J'y étais (Événements Passés)</LinkItem>
                <LinkItem viewName="publications">Mes Publications</LinkItem>
                <LinkItem viewName="appointments">Prochains RDV</LinkItem>

            </div>

            <div className="mt-4 pt-3 border-top">
                {renderActiveComponent()}
            </div>
        </div>
    );
};

export default MyActivity;