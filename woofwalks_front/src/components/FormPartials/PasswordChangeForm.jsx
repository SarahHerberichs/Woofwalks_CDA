import { useState } from 'react';
import { changePassword } from '../../services/changePassword';

const PasswordChangeForm = ({ onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Effacer les erreurs
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (serverError) {
            setServerError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Reset des erreurs
        setErrors({});
        setServerError('');

        const newErrors = {};

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            //Fonction passée en props pour envoi message confirmation
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);

            // Gère les erreurs de validation du serveur
            if (error.response?.data?.violations) {
                const serverErrors = {};
                error.response.data.violations.forEach(violation => {
                    // Mape les erreurs du serveur aux champs du formulaire
                    if (violation.includes('mot de passe') || violation.includes('password') || violation.includes('6 caractères')) {
                        serverErrors.newPassword = violation;
                    }
                });
                setErrors(serverErrors);
            } else if (error.response?.data?.details) {
                const serverErrors = {};
                error.response.data.details.forEach(detail => {
                    if (detail.includes('mot de passe') || detail.includes('password') || detail.includes('6 caractères')) {
                        serverErrors.newPassword = detail;
                    }
                });
                setErrors(serverErrors);
            } else {
                // Affiche l'erreur générale dans l'interface
                const errorMessage = error.response?.data?.error || 'Erreur lors du changement de mot de passe';
                setServerError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">Changer le mot de passe</h5>
            </div>
            <div className="card-body">
                {/* Affichage des erreurs générales */}
                {serverError && (
                    <div className="alert alert-danger mb-3">
                        <strong>Erreur :</strong> {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label htmlFor="currentPassword" className="form-label">
                                Mot de passe actuel
                            </label>
                            <input
                                type="password"
                                className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Mot de passe actuel"
                                required
                            />
                            {errors.currentPassword && (
                                <div className="invalid-feedback">
                                    {errors.currentPassword}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="newPassword" className="form-label">
                                Nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Nouveau mot de passe"
                                required
                            />
                            {errors.newPassword && (
                                <div className="invalid-feedback">
                                    {errors.newPassword}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirmer
                            </label>
                            <input
                                type="password"
                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirmer"
                                required
                            />
                            {errors.confirmPassword && (
                                <div className="invalid-feedback">
                                    {errors.confirmPassword}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn btn-warning"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Modification...' : 'Changer le mot de passe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordChangeForm;