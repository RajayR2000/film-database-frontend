import React, { useState } from 'react';
import '../styles/AddFilmForm.css';

const AddFilmForm: React.FC = () => {
  // Film Information
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [runtime, setRuntime] = useState('');
  const [synopsis, setSynopsis] = useState('');

  // Production Details
  const [productionTimeframe, setProductionTimeframe] = useState('');
  const [shootingLocation, setShootingLocation] = useState('');
  const [postProductionStudio, setPostProductionStudio] = useState('');
  const [productionComments, setProductionComments] = useState('');

  // Film Authors
  const [screenwriter, setScreenwriter] = useState('');
  const [filmmaker, setFilmmaker] = useState('');
  const [executiveProducer, setExecutiveProducer] = useState('');

  // Production Team
  const [imageTechnicians, setImageTechnicians] = useState('');
  const [soundTechnicians, setSoundTechnicians] = useState('');
  const [filmEditor, setFilmEditor] = useState('');
  const [musicSoundDesigners, setMusicSoundDesigners] = useState('');

  // Film Actors (comma-separated)
  const [actors, setActors] = useState('');

  // Film Equipment
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentDescription, setEquipmentDescription] = useState('');
  const [equipmentComment, setEquipmentComment] = useState('');

  // Film Documents
  const [documentType, setDocumentType] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [documentComment, setDocumentComment] = useState('');

  // Institutional & Financial Information
  const [productionCompany, setProductionCompany] = useState('');
  const [fundingCompany, setFundingCompany] = useState('');
  const [fundingComment, setFundingComment] = useState('');
  const [source, setSource] = useState('');
  const [fundingLocation, setFundingLocation] = useState('');

  // Film Screenings
  const [screeningDate, setScreeningDate] = useState('');
  const [screeningLocation, setScreeningLocation] = useState('');
  const [organizers, setOrganizers] = useState('');
  const [format, setFormat] = useState('');
  const [audience, setAudience] = useState('');
  const [filmRights, setFilmRights] = useState('');
  const [screeningComment, setScreeningComment] = useState('');
  const [screeningSource, setScreeningSource] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filmData = {
      title,
      release_year: parseInt(releaseYear, 10),
      runtime,
      synopsis,
      productionDetails: {
        production_timeframe: productionTimeframe,
        shooting_location: shootingLocation,
        post_production_studio: postProductionStudio,
        production_comments: productionComments,
      },
      authors: [
        { role: 'Screenwriter', name: screenwriter },
        { role: 'Filmmaker', name: filmmaker },
        { role: 'Executive Producer', name: executiveProducer },
      ],
      productionTeam: [
        { department: 'Image Technicians', name: imageTechnicians },
        { department: 'Sound Technicians', name: soundTechnicians },
        { department: 'Film Editor', name: filmEditor },
        { department: 'Music & Sound Designers', name: musicSoundDesigners },
      ],
      actors: actors.split(',').map(actor => actor.trim()),
      equipment: [
        {
          equipment_name: equipmentName,
          description: equipmentDescription,
          comment: equipmentComment,
        }
      ],
      documents: [
        {
          document_type: documentType,
          file_url: fileUrl,
          comment: documentComment,
        }
      ],
      institutionalInfo: {
        production_company: productionCompany,
        funding_company: fundingCompany,
        funding_comment: fundingComment,
        source,
        funding_location: fundingLocation,
      },
      screenings: [
        {
          screening_date: screeningDate,
          screening_location: screeningLocation,
          organizers,
          format,
          audience,
          film_rights: filmRights,
          comment: screeningComment,
          source: screeningSource,
        }
      ],
    };

    try {
      const res = await fetch('http://localhost:3000/films', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filmData),
      });
      if (!res.ok) {
        throw new Error('Failed to add film');
      }
      setSuccess('Film added successfully!');
      setError('');
      // Clear form fields after submission
      setTitle('');
      setReleaseYear('');
      setRuntime('');
      setSynopsis('');
      setProductionTimeframe('');
      setShootingLocation('');
      setPostProductionStudio('');
      setProductionComments('');
      setScreenwriter('');
      setFilmmaker('');
      setExecutiveProducer('');
      setImageTechnicians('');
      setSoundTechnicians('');
      setFilmEditor('');
      setMusicSoundDesigners('');
      setActors('');
      setEquipmentName('');
      setEquipmentDescription('');
      setEquipmentComment('');
      setDocumentType('');
      setFileUrl('');
      setDocumentComment('');
      setProductionCompany('');
      setFundingCompany('');
      setFundingComment('');
      setSource('');
      setFundingLocation('');
      setScreeningDate('');
      setScreeningLocation('');
      setOrganizers('');
      setFormat('');
      setAudience('');
      setFilmRights('');
      setScreeningComment('');
      setScreeningSource('');
    } catch (err: any) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="add-film-form-container">
      <h2>Add New Film</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Film Information */}
        <fieldset>
          <legend>Film Information</legend>
          <div className="form-group">
            <label>Title:</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Release Year:</label>
            <input type="number" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Runtime:</label>
            <input value={runtime} onChange={(e) => setRuntime(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Synopsis:</label>
            <textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} required />
          </div>
        </fieldset>

        {/* Production Details */}
        <fieldset>
          <legend>Production Details</legend>
          <div className="form-group">
            <label>Production Timeframe:</label>
            <input value={productionTimeframe} onChange={(e) => setProductionTimeframe(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Shooting Location:</label>
            <input value={shootingLocation} onChange={(e) => setShootingLocation(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Post-Production Studio:</label>
            <input value={postProductionStudio} onChange={(e) => setPostProductionStudio(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Production Comments:</label>
            <textarea value={productionComments} onChange={(e) => setProductionComments(e.target.value)} />
          </div>
        </fieldset>

        {/* Film Authors */}
        <fieldset>
          <legend>Film Authors</legend>
          <div className="form-group">
            <label>Screenwriter:</label>
            <input value={screenwriter} onChange={(e) => setScreenwriter(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Filmmaker:</label>
            <input value={filmmaker} onChange={(e) => setFilmmaker(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Executive Producer:</label>
            <input value={executiveProducer} onChange={(e) => setExecutiveProducer(e.target.value)} />
          </div>
        </fieldset>

        {/* Production Team */}
        <fieldset>
          <legend>Production Team</legend>
          <div className="form-group">
            <label>Image Technicians (comma-separated):</label>
            <input value={imageTechnicians} onChange={(e) => setImageTechnicians(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Sound Technicians (comma-separated):</label>
            <input value={soundTechnicians} onChange={(e) => setSoundTechnicians(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Film Editor:</label>
            <input value={filmEditor} onChange={(e) => setFilmEditor(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Music & Sound Designers (comma-separated):</label>
            <input value={musicSoundDesigners} onChange={(e) => setMusicSoundDesigners(e.target.value)} />
          </div>
        </fieldset>

        {/* Film Actors */}
        <fieldset>
          <legend>Film Actors</legend>
          <div className="form-group">
            <label>Actors (comma-separated):</label>
            <input value={actors} onChange={(e) => setActors(e.target.value)} />
          </div>
        </fieldset>

        {/* Film Equipment */}
        <fieldset>
          <legend>Film Equipment</legend>
          <div className="form-group">
            <label>Equipment Name:</label>
            <input value={equipmentName} onChange={(e) => setEquipmentName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Equipment Description:</label>
            <textarea value={equipmentDescription} onChange={(e) => setEquipmentDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Equipment Comment:</label>
            <textarea value={equipmentComment} onChange={(e) => setEquipmentComment(e.target.value)} />
          </div>
        </fieldset>

        {/* Film Documents */}
        <fieldset>
          <legend>Film Documents</legend>
          <div className="form-group">
            <label>Document Type:</label>
            <input value={documentType} onChange={(e) => setDocumentType(e.target.value)} />
          </div>
          <div className="form-group">
            <label>File URL:</label>
            <input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Document Comment:</label>
            <textarea value={documentComment} onChange={(e) => setDocumentComment(e.target.value)} />
          </div>
        </fieldset>

        {/* Institutional & Financial Information */}
        <fieldset>
          <legend>Institutional & Financial Information</legend>
          <div className="form-group">
            <label>Production Company:</label>
            <input value={productionCompany} onChange={(e) => setProductionCompany(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Funding Company:</label>
            <input value={fundingCompany} onChange={(e) => setFundingCompany(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Funding Comment:</label>
            <textarea value={fundingComment} onChange={(e) => setFundingComment(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Source:</label>
            <input value={source} onChange={(e) => setSource(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Funding Location:</label>
            <input value={fundingLocation} onChange={(e) => setFundingLocation(e.target.value)} />
          </div>
        </fieldset>

        {/* Film Screenings */}
        <fieldset>
          <legend>Film Screenings</legend>
          <div className="form-group">
            <label>Screening Date:</label>
            <input type="date" value={screeningDate} onChange={(e) => setScreeningDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Screening Location:</label>
            <input value={screeningLocation} onChange={(e) => setScreeningLocation(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Organizers:</label>
            <input value={organizers} onChange={(e) => setOrganizers(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Format:</label>
            <input value={format} onChange={(e) => setFormat(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Audience:</label>
            <input value={audience} onChange={(e) => setAudience(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Film Rights:</label>
            <input value={filmRights} onChange={(e) => setFilmRights(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Screening Comment:</label>
            <textarea value={screeningComment} onChange={(e) => setScreeningComment(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Screening Source:</label>
            <input value={screeningSource} onChange={(e) => setScreeningSource(e.target.value)} />
          </div>
        </fieldset>

        <button type="submit" className="submit-button">Add Film</button>
      </form>
    </div>
  );
};

export default AddFilmForm;
