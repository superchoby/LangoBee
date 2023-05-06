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
        body: JSON.stringify({ ...formData, isFromACurrentUser: false }),
      });

      if (!response.ok) {
        changeEmailSendState('error');
        throw new Error('Failed to send message');
      }

      changeEmailSendState('success');
      setFormData({ email: '', subject: '', message: '' });
    } catch (error) {
      changeEmailSendState('error');
    }
  };

  return (
    <div className="py-12 w-11/12 md:w-full max-w-md mx-auto" id="contact">
      <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-primary`">
        Contact Us
      </h1>
      <p className="mt-4 mb-8 max-w-2xl text-xl text-gray-500 lg:mx-auto">
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
          <label
            htmlFor="email"
            className="text-lg leading-6 font-medium text-gray-900"
          >
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
          <label
            htmlFor="subject"
            className="text-lg leading-6 font-medium text-gray-900"
          >
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
          <label
            htmlFor="message"
            className="text-lg leading-6 font-medium text-gray-900"
          >
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
