import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const AccountPage = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [message, setMessage] = useState("");

    // États pour le formulaire
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        acceptNotifications: true,
    });

    // États pour les chiens
    const [dogs, setDogs] = useState([
        { id: 1, name: "Rex", breed: "Berger Allemand", age: 3 },
    ]);

    const [showAddDog, setShowAddDog] = useState(false);
    const [newDog, setNewDog] = useState({
        name: "",
        breed: "",
        age: "",
    });

    // Sauvegarde du profil
    const handleSave = (e) => {
        e.preventDefault();
        setMessage("Profil sauvegardé avec succès !");
        setTimeout(() => setMessage(""), 3000);
    };

    // Ajout d'un chien
    const handleAddDog = (e) => {
        e.preventDefault();
        if (newDog.name && newDog.breed && newDog.age) {
            const dog = {
                id: Date.now(),
                name: newDog.name,
                breed: newDog.breed,
                age: parseInt(newDog.age),
            };
            setDogs([...dogs, dog]);
            setNewDog({ name: "", breed: "", age: "" });
            setShowAddDog(false);
            setMessage("Chien ajouté avec succès !");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    // Suppression d'un chien
    const handleRemoveDog = (dogId) => {
        setDogs(dogs.filter((dog) => dog.id !== dogId));
        setMessage("Chien supprimé !");
        setTimeout(() => setMessage(""), 3000);
    };

    if (authLoading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    Vous devez être connecté pour accéder à cette page.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Mon Compte</h2>

                    {message && (
                        <div className="alert alert-success alert-dismissible fade show">
                            {message}
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setMessage("")}
                            ></button>
                        </div>
                    )}

                    <form onSubmit={handleSave}>
                        {/* Informations personnelles */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="mb-0">Informations personnelles</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="name" className="form-label">
                                            Nom complet
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            placeholder="Votre nom complet"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="acceptNotifications"
                                        checked={formData.acceptNotifications}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                acceptNotifications: e.target.checked,
                                            })
                                        }
                                    />
                                    <label className="form-check-label" htmlFor="acceptNotifications">
                                        Accepter les notifications
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Mes chiens */}
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Mes chiens</h5>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setShowAddDog(!showAddDog)}
                                >
                                    + Ajouter un chien
                                </button>
                            </div>
                            <div className="card-body">
                                {/* Formulaire d'ajout de chien */}
                                {showAddDog && (
                                    <div className="mb-3 p-3 bg-light rounded">
                                        <h6>Nouveau chien</h6>
                                        <form onSubmit={handleAddDog}>
                                            <div className="row">
                                                <div className="col-md-4 mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Nom"
                                                        value={newDog.name}
                                                        onChange={(e) =>
                                                            setNewDog({ ...newDog, name: e.target.value })
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4 mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Race"
                                                        value={newDog.breed}
                                                        onChange={(e) =>
                                                            setNewDog({ ...newDog, breed: e.target.value })
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4 mb-2">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Âge"
                                                        value={newDog.age}
                                                        onChange={(e) =>
                                                            setNewDog({ ...newDog, age: e.target.value })
                                                        }
                                                        min="0"
                                                        max="20"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <button type="submit" className="btn btn-success btn-sm me-2">
                                                    Ajouter
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => {
                                                        setShowAddDog(false);
                                                        setNewDog({ name: "", breed: "", age: "" });
                                                    }}
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Liste des chiens */}
                                <div className="row">
                                    {dogs.map((dog) => (
                                        <div key={dog.id} className="col-md-6 mb-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h6 className="card-title">🐕 {dog.name}</h6>
                                                            <p className="card-text mb-0">
                                                                <strong>Race:</strong> {dog.breed}
                                                                <br />
                                                                <strong>Âge:</strong> {dog.age} ans
                                                            </p>
                                                        </div>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleRemoveDog(dog.id)}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {dogs.length === 0 && (
                                    <div className="text-center text-muted py-3">
                                        <p>Aucun chien ajouté pour le moment.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bouton de sauvegarde */}
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">
                                Sauvegarder
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;