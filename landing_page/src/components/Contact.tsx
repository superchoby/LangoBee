import React, { useState } from 'react';

import ClipLoader from 'react-spinners/ClipLoader';

interface ContactFormData {
  email: string;
  subject: string;
  message: string;
}

const baseUrl =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000/'
    : 'https://langobee-server.herokuapp.com/';
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    email: '',
    subject: '',
    message: '',
  });
  const [emailSendState, changeEmailSendState] = useState<
    'nothing' | 'success' | 'error' | 'processing'
  >('nothing');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace with your API endpoint
    const endpoint = `${baseUrl}emails/contact_us/`;
    changeEmailSendState('processing');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        changeEmailSendState('error');
        throw new Error('Failed to send message');
      }

      changeEmailSendState('success');
      setFormData({ email: '', subject: '', message: '' });
    } catch (error) {
      changeEmailSendState('error');
      console.error(error);
    }
  };

  return (
    <div className="w-11/12 md:w-full max-w-md mx-auto">
      <h2 className="text-3xl text-gray-800 font-bold leading-none mb-3`">
        Contact Us
      </h2>
      <p className="mb-4 mt-2 text-gray-600">
        Have any questions? Feel free to ask us anything and we will get back to
        you soon.
      </p>
      {(emailSendState === 'error' || emailSendState === 'success') && (
        <p className="text-gray-600">
          {emailSendState === 'error'
            ? 'Sorry, there were issues with sending your email at the moment, please try again later'
            : 'Your email has been sent and we will get back to you shorlty!'}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-600"
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="block mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-600 resize-none"
            rows={4}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-background bg-primary hover:bg-border hover:text-primary md:py-2 md:text-lg md:px-4"
        >
          {emailSendState === 'processing' ? (
            <ClipLoader color="white" />
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
