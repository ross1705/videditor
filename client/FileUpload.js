import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient('https://tphgqpefnrtrubfrdvox.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaGdxcGVmbnJ0cnViZnJkdm94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODA4MTg4NiwiZXhwIjoyMDEzNjU3ODg2fQ.5z4UlmgHhFMiqo-lrWukvcBjOBnPe_JUErOLFnmv680');

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    // Log the file object for debugging
    console.log("Uploading file:", file);

    const { error } = await supabase.storage.from('videobuck').upload(file.name, file, {
      onUploadProgress: (event) => {
        let progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      },
    });

    if (error) {
      console.error('Error uploading file:', error);
    } else {
      console.log('File uploaded successfully.');
      setProgress(0); // Reset progress

      // Trigger Mock Heroku function
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: file.name }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Mock Heroku function triggered:', data);
      })
      .catch((error) => {
        console.error('Error triggering mock Heroku function:', error);
      });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {progress > 0 && <progress value={progress} max="100"></progress>}
    </div>
  );
};

export default FileUpload;






