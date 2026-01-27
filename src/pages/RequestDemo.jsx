import { useState } from 'react';
import logoImage from '../assets/logo.png';

const RequestDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    workEmail: '',
    phoneNumber: '',
    jobTitle: '',
    companyName: '',
    country: '',
    hearAbout: '',
    anythingElse: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.workEmail.trim()) newErrors.workEmail = 'Work email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) newErrors.workEmail = 'Please enter a valid email address';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const emailBody = `Hello,

I would like to request a live demo of CDMO Finder Platform.

Contact Information:
- Name: ${formData.name}
- Work Email: ${formData.workEmail}
- Phone Number: ${formData.phoneNumber}
- Job Title: ${formData.jobTitle}
- Company Name: ${formData.companyName}
- Country: ${formData.country}
- How did you hear about us: ${formData.hearAbout || 'Not specified'}
${formData.anythingElse ? `- Additional Information: ${formData.anythingElse}` : ''}

I'm interested in learning more about your platform and how it can help transform our partner discovery workflows.

Best regards,
${formData.name}`;

    const encodedBody = encodeURIComponent(emailBody);
    const emailSubject = encodeURIComponent('Request for Live Demo - CDMO Finder Platform');

    window.location.href = `mailto:parthasarathi.j@ectdglobal.com?subject=${emailSubject}&body=${encodedBody}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        workEmail: '',
        phoneNumber: '',
        jobTitle: '',
        companyName: '',
        country: '',
        hearAbout: '',
        anythingElse: ''
      });
      setErrors({});
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="schedule-demo-page flex items-center justify-center">
        <div className="demo-form-container max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Demo Request Submitted!</h2>
          <p className="text-gray-600 text-sm mb-6">
            Thank you for your interest. Our team will contact you within 24 hours to schedule your personalized demo.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
            }}
            className="demo-submit-btn"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-demo-page">
      {/* Compact Navigation */}
      <nav className="demo-nav">
        <div className="demo-nav-container">
          <div className="demo-nav-brand">
            <img src={logoImage} alt="CompliSense Logo" className="demo-nav-logo" />
            <span className="demo-nav-title">CompliSense</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="demo-content-wrapper">
        <div className="demo-grid">
          {/* Left Side - Narrower */}
          <div className="demo-left">
            <div>
              <h1 className="demo-main-title">
                Book a Personalized Live Demo
              </h1>
              <p className="demo-main-description">
                Discover how our platform can transform your GMP compliance workflows.
                Save hours of manual work, eliminate errors, and boost efficiency.
              </p>

              <div className="demo-features">
                <div className="demo-feature-item">
                  <div className="demo-feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="demo-feature-title">Live Platform Walkthrough</h3>
                    <p className="demo-feature-description">See the dashboard in action with examples tailored to your needs.</p>
                  </div>
                </div>

                <div className="demo-feature-item">
                  <div className="demo-feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="demo-feature-title">Expert Guidance</h3>
                    <p className="demo-feature-description">Get your questions answered by our product specialists.</p>
                  </div>
                </div>

                <div className="demo-feature-item">
                  <div className="demo-feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="demo-feature-title">Flexible Scheduling</h3>
                    <p className="demo-feature-description">We&apos;ll contact you within 24 hours to schedule your demo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Wider form */}
          <div className="demo-form-container">
            <h2 className="demo-form-title">Schedule Your Demo</h2>
            <form onSubmit={handleSubmit} className="demo-form">
              {/* Row 1: Name + Work Email */}
              <div className="demo-form-row">
                <div className="demo-form-field">
                  <label htmlFor="name" className="demo-label">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`demo-input ${errors.name ? 'demo-input-error' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="demo-error">{errors.name}</p>}
                </div>

                <div className="demo-form-field">
                  <label htmlFor="workEmail" className="demo-label">Work Email *</label>
                  <input
                    type="email"
                    id="workEmail"
                    name="workEmail"
                    value={formData.workEmail}
                    onChange={handleChange}
                    className={`demo-input ${errors.workEmail ? 'demo-input-error' : ''}`}
                    placeholder="john@company.com"
                  />
                  {errors.workEmail && <p className="demo-error">{errors.workEmail}</p>}
                </div>
              </div>

              {/* Row 2: Phone Number + Job Title */}
              <div className="demo-form-row">
                <div className="demo-form-field">
                  <label htmlFor="phoneNumber" className="demo-label">Phone Number *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`demo-input ${errors.phoneNumber ? 'demo-input-error' : ''}`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phoneNumber && <p className="demo-error">{errors.phoneNumber}</p>}
                </div>
                <div className="demo-form-field">
                  <label htmlFor="jobTitle" className="demo-label">Job Title *</label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className={`demo-input ${errors.jobTitle ? 'demo-input-error' : ''}`}
                    placeholder="Regulatory Affairs Manager"
                  />
                  {errors.jobTitle && <p className="demo-error">{errors.jobTitle}</p>}
                </div>
              </div>

              {/* Row 3: Company Name + Country */}
              <div className="demo-form-row">
                <div className="demo-form-field">
                  <label htmlFor="companyName" className="demo-label">Company Name *</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`demo-input ${errors.companyName ? 'demo-input-error' : ''}`}
                    placeholder="Acme Pharmaceuticals"
                  />
                  {errors.companyName && <p className="demo-error">{errors.companyName}</p>}
                </div>

                <div className="demo-form-field">
                  <label htmlFor="country" className="demo-label">Country *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`demo-input ${errors.country ? 'demo-input-error' : ''}`}
                    placeholder="United States"
                  />
                  {errors.country && <p className="demo-error">{errors.country}</p>}
                </div>
              </div>

              {/* How did you hear */}
              <div className="demo-form-field">
                <label htmlFor="hearAbout" className="demo-label">
                  How did you hear about us?
                </label>
                <select
                  id="hearAbout"
                  name="hearAbout"
                  value={formData.hearAbout}
                  onChange={handleChange}
                  className="demo-input demo-select"
                >
                  <option value="">Please select</option>
                  <option value="google">Google Search</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="referral">Referral</option>
                  <option value="event">Industry Event</option>
                  <option value="social-media">Social Media</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Anything Else */}
              <div className="demo-form-field">
                <label htmlFor="anythingElse" className="demo-label">
                  Anything else you&apos;d like us to know?
                </label>
                <textarea
                  id="anythingElse"
                  name="anythingElse"
                  value={formData.anythingElse}
                  onChange={handleChange}
                  rows={2}
                  className="demo-input demo-textarea"
                  placeholder="Share specific challenges or use cases..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`demo-submit-btn ${isSubmitting ? 'demo-submit-btn-loading' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="demo-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="demo-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="demo-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="demo-rocket-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 16.5C4.5 13.4624 6.46243 11.5 9.5 11.5C12.5376 11.5 14.5 13.4624 14.5 16.5C14.5 19.5376 12.5376 21.5 9.5 21.5C6.46243 21.5 4.5 19.5376 4.5 16.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2C15 2 17 4 17 7C17 8 16.5 9.5 15.5 10.5L12 14L8.5 10.5C7.5 9.5 7 8 7 7C7 4 9 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Request Your Demo
                  </>
                )}
              </button>

              <p className="demo-submit-note">
                We typically respond within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDemo;


