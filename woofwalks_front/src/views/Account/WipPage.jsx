const WipPage = () => {
    return (
        <div className="container py-5">

            <div className="alert alert-secondary text-center mt-5" role="alert">

                <h1 className="display-4 mb-3">🛠️ Work In Progress</h1>

                <p className="lead text-muted">
                    Cette page est actuellement en cours de construction et sera bientôt disponible.
                </p>

                <div className="progress mt-4" style={{ height: '5px' }}>
                    <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-secondary"
                        role="progressbar"
                        style={{ width: '75%' }}
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default WipPage;