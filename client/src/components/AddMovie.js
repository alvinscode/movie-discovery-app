import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './AddMovie.css'

function AddMovie() {
  const [genres, setGenres] = useState([]);
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    fetch('/api/genres')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }
        return response.json();
      })
      .then((data) => setGenres(data.genres))
      .catch((error) => {
        console.error('Error fetching genres:', error);
        setGenres([]);
      });
  }, []);

  const initialValues = {
    title: '',
    genreId: '',
    description: '',
    releaseYear: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    genreId: Yup.string().required('Genre is required'),
    description: Yup.string(),
    releaseYear: Yup.number()
      .positive('Release year must be a positive number')
      .integer()
      .max(currentYear, `Release year must not be greater than ${currentYear}`),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const movie = {
      title: values.title,
      genreId: values.genreId,
      description: values.description,
      releaseYear: values.releaseYear,
    };

    try {
      const response = await fetch('/api/add-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
      });

      if (response.ok) {
        console.log('Movie added successfully');
        resetForm();
      } else {
        console.error('Failed to add movie');
      }
    } catch (error) {
      console.error('Add movie error:', error);
    }
  };

  return (
    <div className="add-movie-container">
      <h2>Add Movie</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, formik) => handleSubmit(values, formik)}
      >
        {(formik) => (
          <Form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field type="text" id="title" name="title" className="form-control" />
              <ErrorMessage name="title" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="genreId">Genre</label>
              <Field as="select" id="genreId" name="genreId" className="form-control">
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="genreId" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <Field as="textarea" id="description" name="description" className="form-control" />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="releaseYear">Release Year</label>
              <Field type="number" id="releaseYear" name="releaseYear" className="form-control" />
              <ErrorMessage name="releaseYear" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddMovie;
