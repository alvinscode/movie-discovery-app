import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Register() {
  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (values, formik) => {
    console.log('Submitting form with values:', values);
  
    try {
      const emailResponse = await fetch('/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });
  
      const usernameResponse = await fetch('/api/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: values.username }),
      });
  
      if (emailResponse.ok && usernameResponse.ok) {
        const registrationResponse = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        if (registrationResponse.ok) {
          console.log('Registration successful');
          formik.resetForm();
        } else {
          const data = await registrationResponse.json();
          console.error('Registration failed:', data.message);
        }
      } else {
        const emailData = await emailResponse.json();
        const usernameData = await usernameResponse.json();
  
        if (!emailResponse.ok) {
          formik.setFieldError('email', emailData.message);
        }
  
        if (!usernameResponse.ok) {
          formik.setFieldError('username', usernameData.message);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      formik.setSubmitting(false);
    }
  };
  
  
  return (
    <div>
      <h2>Register</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, formik) => handleSubmit(values, formik)}
      >
        {(formik) => (
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field type="text" id="username" name="username" className="form-control" />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;
