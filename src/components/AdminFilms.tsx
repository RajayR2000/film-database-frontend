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
import '../styles/AdminFilms.css';
import NotificationPopup from './NotificationPopup';
import { apiFetch } from '../apifetch';
import ConfirmationDialog from './ConfirmationDialog';

// Interface for Screening objects.
export interface Screening {
  screening_date: string;
  screening_city: string;
  screening_country: string;
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
  release_year: null;
  runtime: string;
  synopsis: string;
  av_annotate_link: string;
  posterFile?: File | null;
  imageFiles?: File[];
  wantsMoreImages?: boolean;
  wantsPoster?: boolean;

  productionDetails: {
    production_timeframe: string;
    shooting_city: string;
    shooting_country: string;
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
    institutional_city: string;
    institutional_country: string;
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
  release_year: null,
  runtime: '',
  synopsis: '',
  av_annotate_link: '',
  productionDetails: {
    production_timeframe: '',
    shooting_city: '',
    shooting_country: '',
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
    institutional_city: '',
    institutional_country: '',
  },
  screenings: [
    {
      screening_date: '',
      screening_city: '',
      screening_country: '',
      organizers: '',
      format: '',
      audience: '',
      film_rights: '',
      comment: '',
      source: '',
    },
  ],
  posterFile: null,
  imageFiles: [],
  wantsMoreImages: false,
  wantsPoster: false,
};

// Yup validation schema.
const validationSchema = Yup.object().shape({
    release_year: Yup.number()
    .nullable()
    //   productionDetails: Yup.object().shape({
//     shooting_city: Yup.string().required('City is required'),
//     shooting_country: Yup.string().required('Country is required'),
//   }),
//   institutionalInfo: Yup.object().shape({
//     institutional_city: Yup.string().required('City is required'),
//     institutional_country: Yup.string().required('Country is required'),
//   }),
//   screenings: Yup.array().of(
//     Yup.object().shape({
//       screening_city: Yup.string().required('City is required'),
//       screening_country: Yup.string().required('Country is required'),
//     })
//   ),
  // Additional validations can be added here...
});

// Child component to render form content and track dirty state.
const FormContent: React.FC<{ setIsDirty: (dirty: boolean) => void }> = ({
  setIsDirty,
}) => {
  const {  dirty,
    errors,
    touched,
    isSubmitting,
    values,
    setFieldValue,} =
    useFormikContext<FilmFormData>();

  useEffect(() => {
    setIsDirty(dirty);
  }, [dirty, setIsDirty]);

  return (
    <Form className="admin-form">
      {/* Basic Film Info */}
      <div>
        <label htmlFor="title">Title:</label>
        <Field name="title" type="text" />
      </div>
      <div>
        <label htmlFor="release_year">Release Year:</label>
        <Field name="release_year" type="number" />
      </div>
      <div>
        <label htmlFor="runtime">Runtime:</label>
        <Field name="runtime" type="text" />
      </div>
      <div>
        <label htmlFor="synopsis">Synopsis:</label>
        <Field name="synopsis" as="textarea" />
      </div>
      <div>
        <label htmlFor="av_annotate_link">AV Annotate Link:</label>
        <Field name="av_annotate_link" type="text" />
      </div>

      {/* Production Details */}
      <fieldset>
        <legend>Production Details</legend>
        <div>
          <label htmlFor="productionDetails.production_timeframe">
            Timeframe:
          </label>
          <Field
            name="productionDetails.production_timeframe"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="productionDetails.shooting_city">City:</label>
          <Field name="productionDetails.shooting_city" type="text" />
          {getIn(errors, 'productionDetails.shooting_city') &&
            getIn(touched, 'productionDetails.shooting_city') && (
              <div className="error">
                {getIn(errors, 'productionDetails.shooting_city')}
              </div>
            )}
        </div>
        <div>
          <label htmlFor="productionDetails.shooting_country">
            Country:
          </label>
          <Field name="productionDetails.shooting_country" type="text" />
          {getIn(errors, 'productionDetails.shooting_country') &&
            getIn(touched, 'productionDetails.shooting_country') && (
              <div className="error">
                {getIn(errors, 'productionDetails.shooting_country')}
              </div>
            )}
        </div>
        <div>
          <label htmlFor="productionDetails.post_production_studio">
            Post Production Studio:
          </label>
          <Field
            name="productionDetails.post_production_studio"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="productionDetails.production_comments">
            Comments:
          </label>
          <Field
            name="productionDetails.production_comments"
            as="textarea"
          />
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
          <label htmlFor="authors.screenwriter_comment">
            Screenwriter Comment:
          </label>
          <Field name="authors.screenwriter_comment" type="text" />
        </div>
        <div>
          <label htmlFor="authors.filmmaker">Filmmaker:</label>
          <Field name="authors.filmmaker" type="text" />
        </div>
        <div>
          <label htmlFor="authors.filmmaker_comment">
            Filmmaker Comment:
          </label>
          <Field name="authors.filmmaker_comment" type="text" />
        </div>
        <div>
          <label htmlFor="authors.executive_producer">
            Executive Producer:
          </label>
          <Field name="authors.executive_producer" type="text" />
        </div>
        <div>
          <label htmlFor="authors.executive_producer_comment">
            Executive Producer Comment:
          </label>
          <Field
            name="authors.executive_producer_comment"
            type="text"
          />
        </div>
      </fieldset>

      {/* Production Team */}
      <fieldset>
        <legend>Production Team</legend>
        <FieldArray name="productionTeam">
          {({ push, remove, form }) => (
            <div>
              {form.values.productionTeam.map((_: any, index:any) => (
                <div
                  key={index}
                  className="production-team-member"
                >
                  <div>
                    <label
                      htmlFor={`productionTeam.${index}.department`}
                    >
                      Department:
                    </label>
                    <Field
                      name={`productionTeam.${index}.department`}
                      type="text"
                    />
                  </div>
                  <div>
                    <label htmlFor={`productionTeam.${index}.name`}>
                      Name:
                    </label>
                    <Field
                      name={`productionTeam.${index}.name`}
                      type="text"
                    />
                  </div>
                  <div>
                    <label htmlFor={`productionTeam.${index}.role`}>
                      Role:
                    </label>
                    <Field
                      name={`productionTeam.${index}.role`}
                      type="text"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`productionTeam.${index}.comment`}
                    >
                      Comment:
                    </label>
                    <Field
                      name={`productionTeam.${index}.comment`}
                      as="textarea"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-add"
                onClick={() =>
                  push({
                    department: '',
                    name: '',
                    role: '',
                    comment: '',
                  })
                }
              >
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
          <label htmlFor="equipment.equipment_name">
            Equipment Name:
          </label>
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
          <label htmlFor="documents.document_type">
            Document Type:
          </label>
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
          <Field
            name="institutionalInfo.production_company"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="institutionalInfo.funding_company">
            Funding Company:
          </label>
          <Field
            name="institutionalInfo.funding_company"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="institutionalInfo.funding_comment">
            Funding Comment:
          </label>
          <Field
            name="institutionalInfo.funding_comment"
            as="textarea"
          />
        </div>
        <div>
          <label htmlFor="institutionalInfo.source">Source:</label>
          <Field name="institutionalInfo.source" type="text" />
        </div>
        <div>
          <label htmlFor="institutionalInfo.institutional_city">
            City:
          </label>
          <Field
            name="institutionalInfo.institutional_city"
            type="text"
          />
          {getIn(errors, 'institutionalInfo.institutional_city') &&
            getIn(touched, 'institutionalInfo.institutional_city') && (
              <div className="error">
                {getIn(errors, 'institutionalInfo.institutional_city')}
              </div>
            )}
        </div>
        <div>
          <label htmlFor="institutionalInfo.institutional_country">
            Country:
          </label>
          <Field
            name="institutionalInfo.institutional_country"
            type="text"
          />
          {getIn(errors, 'institutionalInfo.institutional_country') &&
            getIn(
              touched,
              'institutionalInfo.institutional_country'
            ) && (
              <div className="error">
                {getIn(
                  errors,
                  'institutionalInfo.institutional_country'
                )}
              </div>
            )}
        </div>
      </fieldset>

      {/* Screenings */}
      <fieldset>
        <legend>Film Screenings</legend>
        <FieldArray name="screenings">
          {({ push, remove, form }) => (
            <>
              {form.values.screenings.map((_:any, index: any) => (
                <div
                  key={index}
                  className="screening-member"
                >
                  <div>
                    <label
                      htmlFor={`screenings.${index}.screening_date`}
                    >
                      Screening Date:
                    </label>
                    <Field
                      name={`screenings.${index}.screening_date`}
                      type="date"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`screenings.${index}.screening_city`}
                    >
                      City:
                    </label>
                    <Field
                      name={`screenings.${index}.screening_city`}
                      type="text"
                    />
                    {getIn(
                      errors,
                      `screenings.${index}.screening_city`
                    ) &&
                      getIn(
                        touched,
                        `screenings.${index}.screening_city`
                      ) && (
                        <div className="error">
                          {
                            getIn(
                              errors,
                              `screenings.${index}.screening_city`
                            ) as string
                          }
                        </div>
                      )}
                  </div>
                  <div>
                    <label
                      htmlFor={`screenings.${index}.screening_country`}
                    >
                      Country:
                    </label>
                    <Field
                      name={`screenings.${index}.screening_country`}
                      type="text"
                    />
                    {getIn(
                      errors,
                      `screenings.${index}.screening_country`
                    ) &&
                      getIn(
                        touched,
                        `screenings.${index}.screening_country`
                      ) && (
                        <div className="error">
                          {
                            getIn(
                              errors,
                              `screenings.${index}.screening_country`
                            ) as string
                          }
                        </div>
                      )}
                  </div>
                  <div>
                    <label
                      htmlFor={`screenings.${index}.organizers`}
                    >
                      Organizers:
                    </label>
                    <Field
                      name={`screenings.${index}.organizers`}
                      type="text"
                    />
                  </div>
                  {/* ... other screening fields ... */}
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-add"
                onClick={() =>
                  push({
                    screening_date: '',
                    screening_city: '',
                    screening_country: '',
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
            </>
          )}
        </FieldArray>
        </fieldset>
      
        <fieldset>
  <legend>Upload Media</legend>

  {/* Gallery Row */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    width: '100%',
  }}>
    <span style={{ flex: 1, whiteSpace: 'nowrap' }}>
      Do you want to add more images to the gallery?
    </span>
    <Field type="checkbox" name="wantsMoreImages" id="wantsMoreImages" />
  </div>

  {values.wantsMoreImages && (
    <div style={{ marginBottom: '15px' }}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 10) {
            alert("You can only upload up to 10 images.");
            return;
          }
          setFieldValue("imageFiles", files);
        }}
      />
      <p>{values.imageFiles?.length || 0}/10 images selected</p>
    </div>
  )}

  {/* Poster Row */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    width: '100%',
  }}>
    <span style={{ flex: 1, whiteSpace: 'nowrap' }}>
      Do you want to upload a movie poster?
    </span>
    <Field type="checkbox" name="wantsPoster" id="wantsPoster" />
  </div>

  {values.wantsPoster && (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFieldValue("posterFile", e.currentTarget.files?.[0] || null)
        }
      />
    </div>
  )}
</fieldset>


      <button type="submit" className="btn-submit">
        Submit
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
    enableReinitialize
  >
    <FormContent setIsDirty={setIsDirty} />
  </Formik>
);

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'update' | 'delete'>('add');
  const [message, setMessage] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteSearchTerm, setDeleteSearchTerm] = useState('');
  const [filmIdToDelete, setFilmIdToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [films, setFilms] = useState<FilmListItem[]>([]);
  const [selectedFilmId, setSelectedFilmId] = useState<string>('');
  const [updateInitialValues, setUpdateInitialValues] =
    useState<FilmFormData | null>(null);

  // Load films list for update/delete
  const loadFilmsList = async () => {
    try {
      const res = await apiFetch('http://localhost:3001/films', {
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
    } catch (err: any) {
      setMessage('Error loading films: ' + err.message);
    }
  };

  // Load single film data for update
  const loadFilmData = async (filmId: number) => {
    try {
      const res = await apiFetch(`http://localhost:3001/films/${filmId}`, {
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
      // Map into FilmFormData shape, including city/country fields...
      const formData: FilmFormData = {
        title: data.film.title,
        release_year: data.film.release_year?.toString(),
        runtime: data.film.runtime,
        synopsis: data.film.synopsis,
        av_annotate_link: data.film.av_annotate_link,
        productionDetails: {
          production_timeframe: data.productionDetails.production_timeframe,
          shooting_city: data.productionDetails.shooting_city,
          shooting_country: data.productionDetails.shooting_country,
          post_production_studio: data.productionDetails.post_production_studio,
          production_comments: data.productionDetails.production_comments,
        },
        authors: {
          screenwriter: data.authors.find((a: any) => a.role==='Screenwriter')?.name || '',
          screenwriter_comment: data.authors.find((a: any)=>a.role==='Screenwriter')?.comment || '',
          filmmaker: data.authors.find((a: any)=>a.role==='Filmmaker')?.name || '',
          filmmaker_comment: data.authors.find((a: any)=>a.role==='Filmmaker')?.comment || '',
          executive_producer: data.authors.find((a: any)=>a.role==='Executive Producer')?.name || '',
          executive_producer_comment: data.authors.find((a: any)=>a.role==='Executive Producer')?.comment || '',
        },
        productionTeam: data.productionTeam.length ? data.productionTeam : [{ department:'',name:'',role:'',comment:'' }],
        actors: data.actors.map((a: any)=>a.actor_name).join(', '),
        equipment: data.equipment[0] || { equipment_name:'',description:'',comment:'' },
        documents: data.documents[0] || { document_type:'',file_url:'',comment:'' },
        institutionalInfo: {
          production_company: data.institutionalInfo.production_company,
          funding_company: data.institutionalInfo.funding_company,
          funding_comment: data.institutionalInfo.funding_comment,
          source: data.institutionalInfo.source,
          institutional_city: data.institutionalInfo.institutional_city,
          institutional_country: data.institutionalInfo.institutional_country,
        },
        screenings: data.screenings.map((s: any) => ({
          screening_date: new Date(s.screening_date).toISOString().substr(0,10),
          screening_city: s.screening_city,
          screening_country: s.screening_country,
          organizers: s.organizers,
          format: s.format,
          audience: s.audience,
          film_rights: s.film_rights,
          comment: s.comment,
          source: s.source,
          posterFile: null,
      imageFiles: [],
      wantsMoreImages: false,
      wantsPoster: false,
        })),
      };
      setUpdateInitialValues(formData);
    } catch (err: any) {
      setMessage('Error loading film data: '+err.message);
    }
  };

  // Delete handler
  const doDelete = async () => {
    if (!filmIdToDelete) return;
    try {
      const res = await apiFetch(`http://localhost:3001/films/${filmIdToDelete}`, {
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
        loadFilmsList();
      }
    } catch (err: any) {
      setMessage('Error deleting film: '+err.message);
    } finally {
      setShowConfirm(false);
      setFilmIdToDelete(null);
    }
  };

  // Unsaved changes warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Load list on tab change
  useEffect(() => {
    if (activeTab==='update' || activeTab==='delete') {
      loadFilmsList();
      setUpdateInitialValues(null);
    }
    setMessage('');
    setIsDirty(false);
    setSearchTerm('');
    setDeleteSearchTerm('');
    setShowConfirm(false);
    setFilmIdToDelete(null);
  }, [activeTab]);

  // Add submit
  const onAddSubmit = async (
    values: FilmFormData,
    actions: FormikHelpers<FilmFormData>
  ) => {
    try {
      const res = await apiFetch('http://localhost:3001/films', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          Authorization:`Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage(err.error||'Submission error');
      } else {
        setMessage('Film added successfully!');
        actions.resetForm();
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Update submit
  const onUpdateSubmit = async (
    values: FilmFormData,
    actions: FormikHelpers<FilmFormData>
  ) => {
    try {
      const res = await apiFetch(`http://localhost:3001/films/${selectedFilmId}`, {
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
          Authorization:`Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(values),
      });
      const filmData = await res.json(); // Ensure response returns { film_id }
const filmId = filmData.film_id;

// Upload Poster
if (values.wantsPoster && values.posterFile) {
  const formData = new FormData();
  formData.append('file', values.posterFile);
  formData.append('type', 'image');
  formData.append('is_poster','true');
  await fetch(`http://localhost:3001/upload-assets/${selectedFilmId}`, {
    method: 'POST',
    body: formData,
  });
}

// Upload Gallery Images
if (values.wantsMoreImages && Array.isArray(values.imageFiles) && values.imageFiles.length > 0) {
  console.log("Uploading gallery images...", values.imageFiles);
  console.log("Printing film-id passed",filmId)
  for (const image of values.imageFiles) {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('type', 'image');
    formData.append('is_poster', 'false');
    await fetch(`http://localhost:3001/upload-assets/${selectedFilmId}`, {
      method: 'POST',
      body: formData,
    });
  }
}



      if (!res.ok) {
        const err = await res.json();
        setMessage(err.error||'Submission error');
      } else {
        setMessage('Film updated successfully!');
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button
          className={activeTab==='add'?'active':''}
          onClick={()=>setActiveTab('add')}
        >
          Add Film
        </button>
        <button
          className={activeTab==='update'?'active':''}
          onClick={()=>setActiveTab('update')}
        >
          Update Film
        </button>
        <button
          className={activeTab==='delete'?'active':''}
          onClick={()=>setActiveTab('delete')}
        >
          Delete Film
        </button>
      </div>

      {message && (
        <NotificationPopup
          message={message}
          onClose={()=>setMessage('')}
        />
      )}

      <div className="admin-content">
        {activeTab==='add' && renderForm(initialValues, onAddSubmit, setIsDirty)}

        {activeTab==='update' && (
          <div className="update-section">
            {!updateInitialValues ? (
              <>
                <input
                  type="text"
                  placeholder="Search by movie title..."
                  value={searchTerm}
                  onChange={e=>setSearchTerm(e.target.value)}
                  className="search-bar"
                />
                {/*<ul className="films-list">
                  {films
                    .filter(f=>f.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(f=>(
                      <li key={f.film_id}>
                        <span>{f.title}</span>
                        <button
                          className="btn-edit"
                          onClick={()=>{
                            setSelectedFilmId(f.film_id.toString());
                            loadFilmData(f.film_id);
                          }}
                        >
                          Edit
                        </button>
                      </li>
                    ))}
                </ul>*/}
                <ul className="films-list">
                {films
                  .filter(f => f.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(f => (
                    <li key={f.film_id}>
                      {/* Poster image */}
                      <img
                        src={`http://localhost:3001/poster/${f.film_id}`}
                        alt="Poster"
                        onError={(e) => {
                          e.currentTarget.src = '../assets/movie-poster.png';
                        }}
                        style={{
                          width: '180px',
                          height: 'auto',
                          borderRadius: '6px',
                          marginBottom: '10px',
                          objectFit: 'cover'
                        }}
                      />
                      <span>{f.title}</span>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setSelectedFilmId(f.film_id.toString());
                          loadFilmData(f.film_id);
                        }}
                      >
                        Edit
                      </button>
                    </li>
                  ))}
              </ul>

              </>
            ) : (
              renderForm(updateInitialValues, onUpdateSubmit, setIsDirty)
            )}
          </div>
        )}

        {activeTab==='delete' && (
          <div className="delete-section">
            <input
              type="text"
              placeholder="Search by movie title..."
              value={deleteSearchTerm}
              onChange={e=>setDeleteSearchTerm(e.target.value)}
              className="search-bar"
            />
            <ul className="films-list">
              {films
                .filter(f=>f.title.toLowerCase().includes(deleteSearchTerm.toLowerCase()))
                .map(f=>(
                  <li key={f.film_id}>
                    <span>{f.title}</span>
                    <button
                      className="btn-delete"
                      onClick={()=>{
                        setFilmIdToDelete(f.film_id);
                        setShowConfirm(true);
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>

            <ConfirmationDialog
              isOpen={showConfirm}
              message="Are you sure you want to delete this film?"
              confirmText="Yes, delete"
              cancelText="No, keep it"
              onConfirm={doDelete}
              onCancel={()=>{
                setShowConfirm(false);
                setFilmIdToDelete(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
