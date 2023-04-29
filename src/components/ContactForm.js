import React from 'react';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { emailAtom } from '../atoms';
import * as Formspree from '@formspree/react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';


function ContactForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useAtom(emailAtom);
  const [state, handleSubmit] = useForm();
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState(null);

  const cardElement = elements.getElement(CardElement);

  const { submit } = Formspree.useForm('your-form-id');

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error);
      setSubmitting(false);
      return;
    }

     // Call Formspree API to submit form data
  const formData = {
    name: state.name,
    email: email,
    message: state.message,
  };
  const response = await submit(formData);

    if (response.success) {
      setSubmitted(true);
    } else {
      setError(response.errors);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(handleStripeSubmit)}>
      {/* form fields */}
      <CardElement />
    </form>
  );
}

export default ContactForm;
