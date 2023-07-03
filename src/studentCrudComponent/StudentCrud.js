import axios from "axios";
import { useEffect, useState } from "react";
import Modal from 'react-modal';
Modal.setAppElement('#root');

function StudentCrud() {
const [showPictureModal, setShowPictureModal] = useState(false);
const [selectedPicture, setSelectedPicture] = useState(null);
const [previewUrl, setPreviewUrl] = useState(null);

const [id, setId] = useState("");
const [stname, setName] = useState("");
const [course, setCourse] = useState("");
const [students, setUsers] = useState([]);
const [picture, setPicture] = useState(null);
const handlePictureChange = (event) => {
    const file = event.target.files[0];
    setPicture(file);

//     const pictureUrl = URL.createObjectURL(file);
//   event.target.previousElementSibling.value = file.name;
//   event.target.nextElementSibling.src = pictureUrl;
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const pictureUrl = reader.result;
//       event.target.nextElementSibling.src = pictureUrl;
//     };
//     reader.readAsDataURL(file);
//   } else {
//     // const pictureUrl = URL.createObjectURL(file);
//     //   event.target.previousElementSibling.value = file.name;
//     //   event.target.nextElementSibling.src = pictureUrl;
//     // event.target.nextElementSibling.src = '';
//     previewPicture(file);
//   }
  if (file) {
    previewPicture(file);
  } else {
    // Check if the input value is a local file path
    const localFilePath = event.target.value;
    if (localFilePath) {
      setPreviewUrl(localFilePath);
    }
  }
  };
  const previewPicture = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const pictureUrl = event.target.result;
      setPreviewUrl(pictureUrl);
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    (async () => await Load())();
  }, []);
 
  async function Load() {
    
    const result = await axios.get("https://localhost:7129/api/Student/GetStudent");
    setUsers(result.data);
    console.log(result.data);
  }
 
  async function save(event) {
   
    event.preventDefault();
    try {
        const formData = new FormData();
        formData.append('id', 0);
        formData.append('stname', stname);
        formData.append('course', course);
        formData.append('picture', picture);
        await axios.post("https://localhost:7129/api/Student/AddStudent", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      alert("Student Registation Successfully");
    //   alert(picture);
          setId("");
          setName("");
          setCourse("");
          setPicture(null);
      setPreviewUrl('');
        // Reset the file input field
    document.getElementById("picture").value = '';
     
      Load();
    } catch (err) {
      alert(err);
    }
  }

//   async function editStudent(students) {
//     setName(students.stname);
//     setCourse(students.course);
   
//  setPicture(students.studentPictureUrl);
//     setId(students.id);
//   }
// async function setStudent(students) {
//     setName(students.stname);
//     setCourse(students.course);
  
//     try {
//       const url = `https://localhost:7129/Uploads/${students.studentPictureUrl}`;
//       const response = await axios.get(url, { responseType: 'blob' });
//       const pictureBlob = response.data;
//       const fileExtension = students.studentPictureUrl.split('.').pop();
//       const fileType = `image/${fileExtension}`;
//       const pictureFile = new File([pictureBlob], students.studentPictureUrl, { type: fileType });
//       setPicture(pictureFile);
//     } catch (error) {
//       console.error('Error fetching picture:', error);
//     }
  
//     setId(students.id);
//   }
  
  const setStudent = async (students) => {
    setName(students.stname);
    setCourse(students.course);
  
    try {
      const url = `https://localhost:7129/Uploads/${students.studentPictureUrl}`;
      const response = await axios.get(url, { responseType: 'blob' });
      const pictureBlob = response.data;
      const fileExtension = students.studentPictureUrl.split('.').pop();
      const fileType = `image/${fileExtension}`;
  
      // Check if the picture is from a URL or local file upload
      if (students.studentPictureUrl.startsWith('http')) {
        const pictureFile = new File([pictureBlob], students.studentPictureUrl, { type: fileType });
        setPicture(pictureFile);
        previewPicture(pictureFile);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const pictureUrl = event.target.result;
          setPreviewUrl(pictureUrl);
        };
        reader.readAsDataURL(pictureBlob);
      }
    } catch (error) {
      console.error('Error fetching picture:', error);
    }
  
    setId(students.id);
  };
  
 

  async function DeleteStudent(id) {
  await axios.delete("https://localhost:7129/api/Student/DeleteStudent/" + id);
   alert("Employee deleted Successfully");
   setId("");
   setName("");
   setCourse("");
   setPicture(null);
   setPreviewUrl('');
// Reset the file input field
document.getElementById("picture").value = '';
   Load();
  }
 

//   async function update(event) {
//     event.preventDefault();
//     try {

//   await axios.patch("https://localhost:7129/api/Student/UpdateStudent/"+ students.find((u) => u.id === id).id || id,
//         {
//         id: id,
//         stname: stname,
//         course: course,

//         }
//       );
//       alert("Registation Updateddddd");
//       setId("");
//       setName("");
//       setCourse("");
     
//       Load();
//     } catch (err) {
//       alert(err);
//     }
//   }
async function update(event) {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('stname', stname);
      formData.append('course', course);
    //   formData.append('picture', picture);
        // Check if the picture is selected from local or fetched from URL
    // Check if the picture is selected from local or fetched from URL
    if (previewUrl) {
        const response = await axios.get(previewUrl, { responseType: 'blob' });
        const pictureBlob = response.data;
        const fileType = pictureBlob.type || response.headers['content-type'];
        formData.append('picture', pictureBlob, `picture.${fileType.split('/')[1]}`);
      } else {
        formData.append('picture', picture);
      }
//   alert(formData.pictureBlob);
//   alert(formData.picture);
      await axios.patch(`https://localhost:7129/api/Student/UpdateStudent/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      alert('Registration Updated');
      setId('');
      setName('');
      setCourse('');
      setPicture(null);
      setPreviewUrl('');
   // Reset the file input field
   document.getElementById("picture").value = '';
      Load();
    } catch (err) {
      alert(err);
    }
  }
  

  return (
    <div>
      <h1>Student Details</h1>
      <div className="container mt-4">
        <form>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="id"
              hidden
              value={id}
              onChange={(event) => setId(event.target.value)}
            />
            <label>Student Name</label>
            <input
              type="text"
              className="form-control"
              id="stname"
              value={stname}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Course</label>
            <input
              type="text"
              className="form-control"
              id="course"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Student Picture</label>
            <input
              type="file" // Use "file" type for uploading an image file
              className="form-control"
              id="picture"
              onChange={handlePictureChange}
            />
            {previewUrl && (
  <div>
    <h3>Preview:</h3>
    <img src={previewUrl} alt="Preview" style={{ width: '200px' ,height: '100px'}} />
  </div>
)}
          </div>
          <div>
            <button className="btn btn-primary mt-4" onClick={save}>
              Register
            </button>
            <button className="btn btn-warning mt-4" onClick={update}>
              Update
            </button>
          </div>
        </form>
      </div>
      <br />
      <table className="table table-dark" align="center">
        <thead>
          <tr>
            <th scope="col">Student Id</th>
            <th scope="col">Student Name</th>
            <th scope="col">Course</th>
            <th scope="col">Picture</th>
            <th scope="col">Option</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <th scope="row">{student.id}</th>
              <td>{student.stname}</td>
              <td>{student.course}</td>
              <td> {student.studentPictureUrl && (
          <img
            // src={`https://localhost:7129/uploads/`+student.studentPictureUrl}
            src={`https://localhost:7129/Uploads/` + student.studentPictureUrl}
            alt={student.stname}
            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
      onClick={() => {
        setSelectedPicture(student.studentPictureUrl);
        setShowPictureModal(true);
      }}
          />
        )}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => setStudent(student)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => DeleteStudent(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
  isOpen={showPictureModal}
  onRequestClose={() => setShowPictureModal(false)}
  contentLabel="Student Picture"
>
  {selectedPicture && (
    <img
    // eslint-disable-next-line
      src={`https://localhost:7129/Uploads/` + selectedPicture}
      
      alt="Student"
      style={{ width: '100%', maxHeight: '80vh' }}
    />
  )}
</Modal>

    </div>
  );
  }
  
  export default StudentCrud;