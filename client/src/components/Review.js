import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Review({ onSubmit }) {
  const initialValues = {
    reviewText: '',
    rating: 0,
  };

  const validationSchema = Yup.object({
    reviewText: Yup.string().required('Review text is required'),
    rating: Yup.number()
      .min(0, 'Rating must be at least 0')
      .max(5, 'Rating must be at most 5')
      .required('Rating is required'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    onSubmit(values.reviewText, values.rating);
    resetForm();
    setSubmitting(false);
  };

  return (
    <div>
      <h2>Submit a Review</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form-group">
              <label htmlFor="reviewText">Review Text</label>
              <Field
                type="text"
                id="reviewText"
                name="reviewText"
                as="textarea"
                className="form-control"
              />
              <ErrorMessage name="reviewText" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <Field
                type="number"
                id="rating"
                name="rating"
                className="form-control"
                min="0"
                max="5"
                step="0.1"
              />
              <ErrorMessage name="rating" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              Submit Review
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Review;
