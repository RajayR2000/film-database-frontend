import React, { useState, useEffect } from 'react';
import {
  Formik,
  Form,
  Field,
  FieldArray,
  FormikHelpers,
  useFormikContext,
  getIn,
} from 'formik';
import * as Yup from 'yup';
import '../styles/AdminDashboard.css';

// Interface for Screening objects.
export interface Screening {
  screening_date: string;
  location_id: string;
  organizers: string;
  format: string;
  audience: string;
  film_rights: string;
  comment: string;
  source: string;
}

// Interface for full film form data.
export interface FilmFormData {
  title: string;
  release_year: string;
  runtime: string;
  synopsis: string;
  productionDetails: {
    production_timeframe: string;
    shooting_location_id: string;
    post_production_studio: string;
    production_comments: string;
  };
  authors: {
    screenwriter: string;
    screenwriter_comment: string;
    filmmaker: string;
    filmmaker_comment: string;
    executive_producer: string;
    executive_producer_comment: string;
  };
  productionTeam: Array<{
    department: string;
    name: string;
    role: string;
    comment: string;
  }>;
  actors: string;
  equipment: {
    equipment_name: string;
    description: string;
    comment: string;
  };
  documents: {
    document_type: string;
    file_url: string;
    comment: string;
  };
  institutionalInfo: {
    production_company: string;
    funding_company: string;
    funding_comment: string;
    source: string;
    funding_location_id: string;
  };
  screenings: Screening[];
}

// Interface for film list items (for update mode)
interface FilmListItem {
  film_id: number;
  title: string;
}

// Initial values for adding a new film.
const initialValues: FilmFormData = {
  title: '',
  release_year: '',
  runtime: '',
  synopsis: '',
  productionDetails: {
    production_timeframe: '',
    shooting_location_id: '',
    post_production_studio: '',
    production_comments: '',
  },
  authors: {
    screenwriter: '',
    screenwriter_comment: '',
    filmmaker: '',
    filmmaker_comment: '',
    executive_producer: '',
    executive_producer_comment: '',
  },
  productionTeam: [{ department: '', name: '', role: '', comment: '' }],
  actors: '',
  equipment: { equipment_name: '', description: '', comment: '' },
  documents: { document_type: '', file_url: '', comment: '' },
  institutionalInfo: {
    production_company: '',
    funding_company: '',
    funding_comment: '',
    source: '',
    funding_location_id: '',
  },
  // Start with one empty screening object.
  screenings: [
    { screening_date: '', location_id: '', organizers: '', format: '', audience: '', film_rights: '', comment: '', source: '' }
  ],
};

// Yup validation schema.
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  release_year: Yup.number()
    .typeError('Release year must be a number')
    .required('Release year is required'),
  runtime: Yup.string().required('Runtime is required'),
  synopsis: Yup.string().required('Synopsis is required'),
  productionTeam: Yup.array().of(
    Yup.object().shape({
      department: Yup.string().required('Department is required'),
      name: Yup.string().required('Name is required'),
      role: Yup.string(),
      comment: Yup.string(),
    })
  ),
  screenings: Yup.array().of(
    Yup.object().shape({
      screening_date: Yup.string().required('Screening date is required'),
      location_id: Yup.string().required('Location ID is required'),
      organizers: Yup.string().required('Organizers are required'),
      format: Yup.string(),
      audience: Yup.string(),
      film_rights: Yup.string(),
      comment: Yup.string(),
      source: Yup.string(),
    })
  ),
  // You can add further validations for other sections as needed.
});

// Child component to render form content and track dirty state.
const FormContent: React.FC<{ setIsDirty: (dirty: boolean) => void }> = ({ setIsDirty }) => {
  const { dirty, errors, touched, isSubmitting } = useFormikContext<FilmFormData>();

  useEffect(() => {
    setIsDirty(dirty);
  }, [dirty, setIsDirty]);

  return (
    <Form className="admin-form">
      {/* Basic Film Info */}
      <div>
        <label htmlFor="title">Title:</label>
        <Field name="title" type="text" />
        {getIn(errors, 'title') && getIn(touched, 'title') && (
          <div className="error">{getIn(errors, 'title')}</div>
        )}
      </div>
      <div>
        <label htmlFor="release_year">Release Year:</label>
        <Field name="release_year" type="number" />
        {getIn(errors, 'release_year') && getIn(touched, 'release_year') && (
          <div className="error">{getIn(errors, 'release_year')}</div>
        )}
      </div>
      <div>
        <label htmlFor="runtime">Runtime:</label>
        <Field name="runtime" type="text" />
        {getIn(errors, 'runtime') && getIn(touched, 'runtime') && (
          <div className="error">{getIn(errors, 'runtime')}</div>
        )}
      </div>
      <div>
        <label htmlFor="synopsis">Synopsis:</label>
        <Field name="synopsis" as="textarea" />
        {getIn(errors, 'synopsis') && getIn(touched, 'synopsis') && (
          <div className="error">{getIn(errors, 'synopsis')}</div>
        )}
      </div>

      {/* Production Details */}
      <fieldset>
        <legend>Production Details</legend>
        <div>
          <label htmlFor="productionDetails.production_timeframe">Timeframe:</label>
          <Field name="productionDetails.production_timeframe" type="text" />
        </div>
        <div>
          <label htmlFor="productionDetails.shooting_location_id">
            Shooting Location ID:
          </label>
          <Field name="productionDetails.shooting_location_id" type="number" />
        </div>
        <div>
          <label htmlFor="productionDetails.post_production_studio">
            Post Production Studio:
          </label>
          <Field name="productionDetails.post_production_studio" type="text" />
        </div>
        <div>
          <label htmlFor="productionDetails.production_comments">Comments:</label>
          <Field name="productionDetails.production_comments" as="textarea" />
        </div>
      </fieldset>

      {/* Authors */}
      <fieldset>
        <legend>Film Authors</legend>
        <div>
          <label htmlFor="authors.screenwriter">Screenwriter:</label>
          <Field name="authors.screenwriter" type="text" />
        </div>
        <div>
          <label htmlFor="authors.screenwriter_comment">Screenwriter Comment:</label>
          <Field name="authors.screenwriter_comment" type="text" />
        </div>
        <div>
          <label htmlFor="authors.filmmaker">Filmmaker:</label>
          <Field name="authors.filmmaker" type="text" />
        </div>
        <div>
          <label htmlFor="authors.filmmaker_comment">Filmmaker Comment:</label>
          <Field name="authors.filmmaker_comment" type="text" />
        </div>
        <div>
          <label htmlFor="authors.executive_producer">Executive Producer:</label>
          <Field name="authors.executive_producer" type="text" />
        </div>
        <div>
          <label htmlFor="authors.executive_producer_comment">
            Executive Producer Comment:
          </label>
          <Field name="authors.executive_producer_comment" type="text" />
        </div>
      </fieldset>

      {/* Production Team */}
      <fieldset>
        <legend>Production Team</legend>
        <FieldArray name="productionTeam">
          {({ push, remove, form }) => (
            <div>
              {form.values.productionTeam.map((_: any, index: number) => {
                const deptError = getIn(form.errors, `productionTeam.${index}.department`);
                const deptTouched = getIn(form.touched, `productionTeam.${index}.department`);
                const nameError = getIn(form.errors, `productionTeam.${index}.name`);
                const nameTouched = getIn(form.touched, `productionTeam.${index}.name`);
                return (
                  <div key={index} className="production-team-member">
                    <div>
                      <label htmlFor={`productionTeam.${index}.department`}>
                        Department:
                      </label>
                      <Field name={`productionTeam.${index}.department`} type="text" />
                      {deptError && deptTouched && (
                        <div className="error">{deptError}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`productionTeam.${index}.name`}>Name:</label>
                      <Field name={`productionTeam.${index}.name`} type="text" />
                      {nameError && nameTouched && (
                        <div className="error">{nameError}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`productionTeam.${index}.role`}>Role:</label>
                      <Field name={`productionTeam.${index}.role`} type="text" />
                    </div>
                    <div>
                      <label htmlFor={`productionTeam.${index}.comment`}>Comment:</label>
                      <Field name={`productionTeam.${index}.comment`} as="textarea" />
                    </div>
                    <button type="button" className="btn-remove" onClick={() => remove(index)}>
                      Remove
                    </button>
                  </div>
                );
              })}
              <button type="button" className="btn-add" onClick={() => push({ department: '', name: '', role: '', comment: '' })}>
                Add Production Team Member
              </button>
            </div>
          )}
        </FieldArray>
      </fieldset>

      {/* Actors */}
      <fieldset>
        <legend>Actors (comma-separated):</legend>
        <div>
          <Field name="actors" type="text" />
        </div>
      </fieldset>

      {/* Equipment */}
      <fieldset>
        <legend>Film Equipment</legend>
        <div>
          <label htmlFor="equipment.equipment_name">Equipment Name:</label>
          <Field name="equipment.equipment_name" type="text" />
        </div>
        <div>
          <label htmlFor="equipment.description">Description:</label>
          <Field name="equipment.description" as="textarea" />
        </div>
        <div>
          <label htmlFor="equipment.comment">Comment:</label>
          <Field name="equipment.comment" as="textarea" />
        </div>
      </fieldset>

      {/* Documents */}
      <fieldset>
        <legend>Film Documents</legend>
        <div>
          <label htmlFor="documents.document_type">Document Type:</label>
          <Field name="documents.document_type" type="text" />
        </div>
        <div>
          <label htmlFor="documents.file_url">File URL:</label>
          <Field name="documents.file_url" type="text" />
        </div>
        <div>
          <label htmlFor="documents.comment">Comment:</label>
          <Field name="documents.comment" as="textarea" />
        </div>
      </fieldset>

      {/* Institutional & Financial Info */}
      <fieldset>
        <legend>Institutional & Financial Information</legend>
        <div>
          <label htmlFor="institutionalInfo.production_company">
            Production Company:
          </label>
          <Field name="institutionalInfo.production_company" type="text" />
        </div>
        <div>
          <label htmlFor="institutionalInfo.funding_company">Funding Company:</label>
          <Field name="institutionalInfo.funding_company" type="text" />
        </div>
        <div>
          <label htmlFor="institutionalInfo.funding_comment">Funding Comment:</label>
          <Field name="institutionalInfo.funding_comment" as="textarea" />
        </div>
        <div>
          <label htmlFor="institutionalInfo.source">Source:</label>
          <Field name="institutionalInfo.source" type="text" />
        </div>
        <div>
          <label htmlFor="institutionalInfo.funding_location_id">
            Funding Location ID:
          </label>
          <Field name="institutionalInfo.funding_location_id" type="number" />
        </div>
      </fieldset>

      {/* Screenings handled as an array */}
      <fieldset>
        <legend>Film Screenings</legend>
        <FieldArray name="screenings">
          {({ push, remove, form }) => (
            <div>
              {form.values.screenings.map((_: any, index: number) => {
                const screeningDateError = getIn(form.errors, `screenings.${index}.screening_date`);
                const screeningDateTouched = getIn(form.touched, `screenings.${index}.screening_date`);
                const locationIdError = getIn(form.errors, `screenings.${index}.location_id`);
                const locationIdTouched = getIn(form.touched, `screenings.${index}.location_id`);
                const organizersError = getIn(form.errors, `screenings.${index}.organizers`);
                const organizersTouched = getIn(form.touched, `screenings.${index}.organizers`);
                return (
                  <div key={index} className="screening-member">
                    <div>
                      <label htmlFor={`screenings.${index}.screening_date`}>Screening Date:</label>
                      <Field name={`screenings.${index}.screening_date`} type="date" />
                      {screeningDateError && screeningDateTouched && (
                        <div className="error">{screeningDateError}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`screenings.${index}.location_id`}>Location ID:</label>
                      <Field name={`screenings.${index}.location_id`} type="number" />
                      {locationIdError && locationIdTouched && (
                        <div className="error">{locationIdError}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`screenings.${index}.organizers`}>Organizers:</label>
                      <Field name={`screenings.${index}.organizers`} type="text" />
                      {organizersError && organizersTouched && (
                        <div className="error">{organizersError}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`screenings.${index}.format`}>Format:</label>
                      <Field name={`screenings.${index}.format`} type="text" />
                    </div>
                    <div>
                      <label htmlFor={`screenings.${index}.audience`}>Audience:</label>
                      <Field name={`screenings.${index}.audience`} type="text" />
                    </div>
                    <div>
                      <label htmlFor={`screenings.${index}.film_rights`}>Film Rights:</label>
                      <Field name={`screenings.${index}.film_rights`} type="text" />
                    </div>
                    <div>
                      <label htmlFor={`screenings.${index}.comment`}>Comment:</label>
                      <Field name={`screenings.${index}.comment`} as="textarea" />
                    </div>
                    <div>
                      <label htmlFor={`screenings.${index}.source`}>Source:</label>
                      <Field name={`screenings.${index}.source`} type="text" />
                    </div>
                    <button type="button" className="btn-remove" onClick={() => remove(index)}>
                      Remove
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                className="btn-add"
                onClick={() =>
                  push({
                    screening_date: '',
                    location_id: '',
                    organizers: '',
                    format: '',
                    audience: '',
                    film_rights: '',
                    comment: '',
                    source: '',
                  })
                }
              >
                Add Screening
              </button>
            </div>
          )}
        </FieldArray>
      </fieldset>

      <button type="submit" className="btn-submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </Form>
  );
};

// Helper to wrap FormContent in Formik.
const renderForm = (
  initialVals: FilmFormData,
  onSubmit: (values: FilmFormData, actions: FormikHelpers<FilmFormData>) => Promise<void>,
  setIsDirty: (dirty: boolean) => void
) => (
  <Formik
    initialValues={initialVals}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
    enableReinitialize={true}
  >
    {() => <FormContent setIsDirty={setIsDirty} />}
  </Formik>
);

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'update' | 'delete'>('add');
  const [message, setMessage] = useState<string>('');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteSearchTerm, setDeleteSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [filmIdToDelete, setFilmIdToDelete] = useState<number | null>(null);
  
  // For update mode.
  const [films, setFilms] = useState<FilmListItem[]>([]);
  const [selectedFilmId, setSelectedFilmId] = useState<string>(''); // Now defined.
  const [updateInitialValues, setUpdateInitialValues] = useState<FilmFormData | null>(null);

  // Load films list for update mode.
  const loadFilmsList = async () => {
    try {
      const res = await fetch('http://localhost:3001/films', {
        headers: {
          Authorization: localStorage.getItem('accessToken')
            ? `Bearer ${localStorage.getItem('accessToken')}`
            : '',
        },
      });
      if (!res.ok) {
        setMessage('Failed to load films list');
        return;
      }
      const data = await res.json();
      setFilms(data.films);
    } catch (error: any) {
      setMessage('Error loading films: ' + error.message);
    }
  };

  // Load film data for update.
  const loadFilmData = async (filmId: number) => {
    try {
      const res = await fetch(`http://localhost:3001/films/${filmId}`, {
        headers: {
          Authorization: localStorage.getItem('accessToken')
            ? `Bearer ${localStorage.getItem('accessToken')}`
            : '',
        },
      });
      if (!res.ok) {
        setMessage('Failed to load film data');
        return;
      }
      const data = await res.json();
      const screenings = data.screenings && data.screenings.length > 0
      ? data.screenings.map((s: any) => ({
          ...s,
          screening_date: new Date(s.screening_date).toISOString().substring(0, 10)
        }))
      : [];
      const film: FilmFormData = {
        title: data.film.title,
        release_year: data.film.release_year.toString(),
        runtime: data.film.runtime,
        synopsis: data.film.synopsis,
        productionDetails: {
          production_timeframe: data.productionDetails?.production_timeframe || '',
          shooting_location_id: data.productionDetails?.shooting_location_id?.toString() || '',
          post_production_studio: data.productionDetails?.post_production_studio || '',
          production_comments: data.productionDetails?.production_comments || '',
        },
        authors: {
          screenwriter: (data.authors.find((a: any) => a.role === 'Screenwriter') || {}).name || '',
          screenwriter_comment: (data.authors.find((a: any) => a.role === 'Screenwriter') || {}).comment || '',
          filmmaker: (data.authors.find((a: any) => a.role === 'Filmmaker') || {}).name || '',
          filmmaker_comment: (data.authors.find((a: any) => a.role === 'Filmmaker') || {}).comment || '',
          executive_producer: (data.authors.find((a: any) => a.role === 'Executive Producer') || {}).name || '',
          executive_producer_comment:
            (data.authors.find((a: any) => a.role === 'Executive Producer') || {}).comment || '',
        },
        productionTeam: data.productionTeam || [{ department: '', name: '', role: '', comment: '' }],
        actors: data.actors ? data.actors.map((a: any) => a.actor_name).join(', ') : '',
        equipment:
          data.equipment && data.equipment.length > 0
            ? data.equipment[0]
            : { equipment_name: '', description: '', comment: '' },
        documents:
          data.documents && data.documents.length > 0
            ? data.documents[0]
            : { document_type: '', file_url: '', comment: '' },
        institutionalInfo: {
          production_company: data.institutionalInfo?.production_company || '',
          funding_company: data.institutionalInfo?.funding_company || '',
          funding_comment: data.institutionalInfo?.funding_comment || '',
          source: data.institutionalInfo?.source || '',
          funding_location_id: data.institutionalInfo?.funding_location_id?.toString() || '',
        },
        // Now screenings is handled as an array.
        screenings      };
      setUpdateInitialValues(film);
      setMessage('');
    } catch (error: any) {
      setMessage('Error loading film data: ' + error.message);
    }
  };

  // Warn user about unsaved changes.
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // When switching to update mode, load films list.
  useEffect(() => {
    if (activeTab === 'update') {
      loadFilmsList();
    }
  }, [activeTab]);

  // Submit handler for adding a film.
  const onAddSubmit = async (
    values: FilmFormData,
    actions: FormikHelpers<FilmFormData>
  ) => {
    try {
      const res = await fetch('http://localhost:3001/films', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const errorData = await res.json();
        actions.setErrors({ title: errorData.error || 'Submission error' });
        setMessage(errorData.error || 'Submission error');
        throw new Error(errorData.error);
      }
      setMessage('Film added successfully!');
      actions.resetForm();
      setIsDirty(false);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Submit handler for updating a film.
  const onUpdateSubmit = async (
    values: FilmFormData,
    actions: FormikHelpers<FilmFormData>
  ) => {
    try {
      const res = await fetch(`http://localhost:3001/films/${selectedFilmId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const errorData = await res.json();
        actions.setErrors({ title: errorData.error || 'Submission error' });
        setMessage(errorData.error || 'Submission error');
        throw new Error(errorData.error);
      }
      setMessage('Film updated successfully!');
      actions.resetForm();
      setIsDirty(false);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };
  const handleDelete = async (filmId: number) => {
    if (window.confirm("Are you sure you want to delete this film?")) {
      try {
        const res = await fetch(`http://localhost:3001/films/${filmId}`, {
          method: 'DELETE',
          headers: {
            Authorization: localStorage.getItem('accessToken')
              ? `Bearer ${localStorage.getItem('accessToken')}`
              : '',
          },
        });
        if (!res.ok) {
          setMessage('Failed to delete film');
          return;
        }
        setMessage('Film deleted successfully!');
        // Reload the films list after deletion.
        loadFilmsList();
      } catch (error: any) {
        setMessage('Error deleting film: ' + error.message);
      }
    }
  };
  
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => {
            setActiveTab('add');
            setMessage('');
            setUpdateInitialValues(null);
          }}
        >
          Add Film
        </button>
        <button
          className={activeTab === 'update' ? 'active' : ''}
          onClick={() => {
            setActiveTab('update');
            setMessage('');
            setUpdateInitialValues(null);
          }}
        >
          Update Film
        </button>
        <button
          className={activeTab === 'delete' ? 'active' : ''}
          onClick={() => {
            setActiveTab('delete');
            setMessage('');
            setUpdateInitialValues(null);
          }}
        >
          Delete Film
        </button>
      </div>
      <div className="admin-content">
        {message && <p className="message">{message}</p>}
        {activeTab === 'add' &&
          renderForm(initialValues, onAddSubmit, setIsDirty)}
        {activeTab === 'update' && (
          <div className="update-section">
            {!updateInitialValues ? (
              <div>
                <h2>Select a Film to Update</h2>
                <input
                  type="text"
                  placeholder="Search by movie title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-bar"
                />
                <ul className="films-list">
                  {films
                    .filter((film) =>
                      film.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((film) => (
                      <li key={film.film_id}>
                        <span>{film.title}</span>
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setSelectedFilmId(film.film_id.toString());
                            loadFilmData(film.film_id);
                          }}
                        >
                          Edit
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              renderForm(updateInitialValues, onUpdateSubmit, setIsDirty)
            )}
          </div>
        )}
        {activeTab === 'delete' && (
  <div className="delete-section">
    <h2>Select a Film to Delete</h2>
    <input
      type="text"
      placeholder="Search by movie title..."
      value={deleteSearchTerm}
      onChange={(e) => setDeleteSearchTerm(e.target.value)}
      className="search-bar"
    />
    <ul className="films-list">
      {films
        .filter((film) =>
          film.title.toLowerCase().includes(deleteSearchTerm.toLowerCase())
        )
        .map((film) => (
          <li key={film.film_id}>
            <span>{film.title}</span>
            <button
              className="btn-delete"
              onClick={() => {
                setFilmIdToDelete(film.film_id);
                setShowConfirmDialog(true);
              }}
            >
              Delete
            </button>
          </li>
        ))}
    </ul>
    {showConfirmDialog && (
      <div className="confirm-overlay">
        <div className="confirm-dialog">
          <p>Are you sure you want to delete this film?</p>
          <div className="confirm-buttons">
            <button
              className="btn-confirm"
              onClick={async () => {
                if (filmIdToDelete !== null) {
                  try {
                    const res = await fetch(`http://localhost:3001/films/${filmIdToDelete}`, {
                      method: 'DELETE',
                      headers: {
                        Authorization: localStorage.getItem('accessToken')
                          ? `Bearer ${localStorage.getItem('accessToken')}`
                          : '',
                      },
                    });
                    if (!res.ok) {
                      setMessage('Failed to delete film');
                    } else {
                      setMessage('Film deleted successfully!');
                      loadFilmsList(); // Reload the films list after deletion.
                    }
                  } catch (error: any) {
                    setMessage('Error deleting film: ' + error.message);
                  } finally {
                    setShowConfirmDialog(false);
                    setFilmIdToDelete(null);
                  }
                }
              }}
            >
              Confirm
            </button>
            <button
              className="btn-cancel"
              onClick={() => {
                setShowConfirmDialog(false);
                setFilmIdToDelete(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}


       

      </div>
    </div>
  );
};

export default AdminDashboard;
