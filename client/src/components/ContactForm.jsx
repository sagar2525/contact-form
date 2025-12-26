import React, { useState } from 'react';
import FormField from './FormField';
import SuccessMessage from './SuccessMessage';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case 'name':
                if (!value || value.trim().length < 2) error = "Name must be at least 2 characters.";
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) error = "Invalid email format.";
                break;
            case 'subject':
                if (!value) error = "Please select a subject.";
                break;
            case 'message':
                if (!value || value.trim().length < 10) error = "Message must be at least 10 characters.";
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types, or real-time validation?
        // Prompt says: "Real-time validation while typing" is a bonus.
        // Prompt says: "Validate on blur AND on submit".
        // Let's validate on change to be nice (bonus), but only if check fails previously?
        // To be safe and minimal: clear error on change.
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        // Validate all
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle server errors
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    throw new Error(data.message || 'Something went wrong');
                }
            } else {
                setIsSuccess(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
                setErrors({});
            }
        } catch (err) {
            setApiError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setApiError(null);
    };

    if (isSuccess) {
        return <SuccessMessage onReset={handleReset} />;
    }

    const subjectOptions = [
        "General Inquiry",
        "Technical Support",
        "Feedback",
        "Partnership",
        "Other"
    ];

    // Disable submit if any visible errors or empty required fields?
    // Prompt says: "Disable submit button if validation fails"
    // We can check if `errors` has keys.
    const hasErrors = Object.values(errors).some(err => err);
    // Also check if empty? Usually better to let them click and see errors, but "Disable submit button if validation fails" usually means strictly invalid state.
    // I will disable if `errors` has content OR if fields are empty (initial state).
    const isFormCallbackInvalid = Object.values(formData).some(val => !val) || hasErrors;

    return (
        <div className="contact-form-container">
            <h2>Contact Us</h2>
            {apiError && <div className="error-banner">{apiError}</div>}

            <form onSubmit={handleSubmit} noValidate>
                <FormField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    required
                    placeholder="Enter your name"
                />

                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    required
                    placeholder="Enter your email"
                />

                <FormField
                    label="Subject"
                    name="subject"
                    type="select"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.subject}
                    options={subjectOptions}
                    required
                />

                <FormField
                    label="Message"
                    name="message"
                    type="textarea"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.message}
                    required
                    placeholder="Enter your message"
                />

                <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting || hasErrors} // Only strict errors or submit state disable it. Let them click to see "Required" errors if they skipped fields.
                >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
