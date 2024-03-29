import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faStar } from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@material-tailwind/react";
import './note.css';
import Swal from 'sweetalert2'

const ViewNote = () => {
  const [notes, setNotes] = useState([]);
  const [noteId, setNoteId] = useState([]);
  const [filterNotes, setFilterNotes] = useState([]);
  const [favoriteNotes, setFavoriteNotes] = useState([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filterTerm]);

  const fetchData = () => {
    const apiUrl = filterTerm
      ? `http://localhost:5000/api/getSearchNote?title=${filterTerm}`
      : "http://localhost:5000/api/getAllNote";

    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (filterTerm) {
          setFilterNotes(response.data.data);
        } else {
          setFavoriteNotes(response.data.favoriteNote);
          setNotes(response.data.allNote);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteNote = (noteId) => {
    axios
      .delete(`http://localhost:5000/api/deleteNote/${noteId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        fetchData();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Title deleted successfully!",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  const handleFavorite = (noteId, isFavorite) => {
    axios
      .put(`http://localhost:5000/api/handleFavorite/${noteId}`,
        { isFavorite: isFavorite },
        {
          headers: {
            "Content-Type": "application/json",
          },
        })
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Add note
  const handleAddClick = () => {
    formData.title = '';
    formData.content = '';
    setIsAddVisible(true);
  };
  const handleCloseAddDialog = () => {
    setIsAddVisible(false);
  };
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/createNote",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Successfully stored on the backend
        fetchData();
        handleCloseAddDialog();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Note added successfully!",
          showConfirmButton: false,
          timer: 1500
        });

      } else {
        console.error("Failed to add note");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //update
  const handleUpdateClick = (noteId, title, content) => {
    setNoteId(noteId);
    setFormData({
      title: title,
      content: content,
    });
    setIsUpdateVisible(true);
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateVisible(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/updateNote/${noteId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        fetchData();
        handleCloseUpdateDialog();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Note updated successfully!",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        console.error("Failed to update note");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (mongoDate) => {
    if (!mongoDate) return null;
    const jsDate = new Date(mongoDate);
    return jsDate.toLocaleDateString();
  };


  return (
    <div className="container mx-auto mt-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center mb-5">MY NOTES</h1>
      <button
        type="button"
        onClick={handleAddClick}
        style={{
          zIndex: 9999,
          position: "fixed",
          right: "30px",
          buttom: "20px",
        }}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-3 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
      >
        <FontAwesomeIcon icon={faPlus} className="me-2" /> ADD
      </button>
      <div
        className="flex mb-2 bg-white p-5"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <label htmlFor="filterTerm" className="text-sm font-bold">
          Serach :
        </label>
        <input
          style={{ width: "300px" }}
          type="text"
          id="filterTerm"
          name="filterTerm"
          className="border border-black p-2 ml-5 rounded-lg"
          value={filterTerm}
          placeholder="Enter here"
          onChange={(e) => setFilterTerm(e.target.value)}
        />
      </div>
      {/* Add Modal start */}
      {isAddVisible && (
        <div id="id01" className="w3-modal" style={{ display: 'block' }}>
          <div className="w3-modal-content w3-card-4 w3-animate-zoom" style={{ maxWidth: '600px' }}>

            <div className="w3-center"><br />
              <span onClick={handleCloseAddDialog} className="w3-button w3-xlarge w3-hover-red w3-display-topright" title="Close Modal">&times;</span>
            </div>


            <form className="w3-container" onSubmit={handleSubmit}>
              <Typography variant="h4" color="blue-gray">
                Add New Note
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you! Enter Note details.
              </Typography>
              <div className="w3-section">
                <label><b>Title</b></label>
                <input className="w3-input w3-border w3-margin-bottom"
                  type="text"
                  placeholder="Enter title"
                  id="title"
                  name="title"
                  maxLength={100}
                  onChange={handleChange}
                  value={formData.title}
                  required
                />
                <label><b>Content</b></label>
                <textarea
                  id="content"
                  name="content"
                  maxLength={1000}
                  placeholder="More details"
                  className="w3-input w3-border"
                  onChange={handleChange}
                  value={formData.content}
                  required
                ></textarea>
                <button className="w3-button w3-block w3-blue w3-section w3-padding" type="submit">Add Note</button>
              </div>
            </form>

            <div className="w3-container w3-border-top w3-padding-16 w3-light-grey">
              <button onClick={handleCloseAddDialog} type="button" className="w3-button w3-red">Cancel</button>
            </div>

          </div>
        </div>
      )}
      {/* Add modal end */}
      {/* Edit Modal start */}
      {isUpdateVisible && (
        <div id="id01" className="w3-modal" style={{ display: 'block' }}>
          <div className="w3-modal-content w3-card-4 w3-animate-zoom" style={{ maxWidth: '600px' }}>

            <div className="w3-center"><br />
              <span onClick={handleCloseUpdateDialog} className="w3-button w3-xlarge w3-hover-red w3-display-topright" title="Close Modal">&times;</span>
            </div>


            <form className="w3-container" onSubmit={handleUpdate}>
              <Typography variant="h4" color="blue-gray">
                Edit Note
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you! Enter Note details.
              </Typography>
              <div className="w3-section">
                <label><b>Title</b></label>
                <input className="w3-input w3-border w3-margin-bottom"
                  type="text"
                  placeholder="Enter title"
                  id="title"
                  name="title"
                  maxLength={100}
                  onChange={handleChange}
                  value={formData.title}
                  required
                />
                <label><b>Content</b></label>
                <textarea
                  id="content"
                  name="content"
                  maxLength={1000}
                  placeholder="More details"
                  className="w3-input w3-border"
                  onChange={handleChange}
                  value={formData.content}
                  required
                ></textarea>
                <button className="w3-button w3-block w3-blue w3-section w3-padding" type="submit">Update Note</button>
              </div>
            </form>

            <div className="w3-container w3-border-top w3-padding-16 w3-light-grey">
              <button onClick={handleCloseUpdateDialog} type="button" className="w3-button w3-red">Cancel</button>
            </div>

          </div>
        </div>
      )}
      {/* Edit modal end */}
      {filterTerm ? (
        (filterNotes.length === 0) ? (
          <div className="my-5" style={{ width: "750px" }}>
            <center><h1 className="text-white">No notes found.</h1></center>
          </div>
        ) : (
          filterNotes.map((note) => (
            <div className=" my-5" style={{ width: "750px" }} key={note._id}>
              {/* <div style={{ width: '200px' }}></div> */}
              <div className=" p-8 bg-white items-right rounded-lg shadow-sm">
                <h1 className="text-xl font-bold">Title: {note.title}</h1>
                <p>Content: {note.content}</p>
                <div>
                  <div
                    className="mt-2"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#333333' }}>
                      Created on: {formatDate(note.updated_at)}
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}>
                      <button
                        type="button"
                        onClick={() => {
                          handleFavorite(note._id, note.isFavorite);
                        }}
                        style={{
                          color: note.isFavorite ? "orange" : "white"
                        }}
                        className="btn-rounded bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                      >
                        <FontAwesomeIcon icon={faStar} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateClick(note._id, note.title, note.content);
                        }}
                        className="btn-rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteNote(note._id);
                        }}
                        className="btn-rounded focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )

      ) : (
        <div style={{ width: '100%' }}>
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Favourites</h2>
          <div className="container mx-auto mt-8 grid grid-cols-3 gap-8">
            {favoriteNotes.map((note) => (
              <div key={note._id} className="mb-4">
                <div className=" p-8 bg-white items-right rounded-lg shadow-sm">
                  <h1 className="text-xl font-bold">Title: {note.title}</h1>
                  <p>Content: {note.content}</p>
                  <div>
                    <div
                      className="mt-2"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: '11px', color: '#333333' }}>
                        Created on: {formatDate(note.updated_at)}
                      </div>
                      <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}>
                        <button
                          type="button"
                          onClick={() => {
                            handleFavorite(note._id, note.isFavorite);
                          }}
                          style={{
                            color: note.isFavorite ? "orange" : "white"
                          }}
                          className="btn-rounded bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                        >
                          <FontAwesomeIcon icon={faStar} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateClick(note._id, note.title, note.content);
                          }}
                          className="btn-rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteNote(note._id);
                          }}
                          className="btn-rounded focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4 text-blue-800">All</h2>
          <div className="container mx-auto mt-8 grid grid-cols-3 gap-8">
            {notes.map((note) => (
              <div key={note._id} className="mb-4">
                <div className=" p-8 bg-white items-right rounded-lg shadow-sm">
                  <h1 className="text-xl font-bold">Title: {note.title}</h1>
                  <p>Content: {note.content}</p>
                  <div>
                    <div
                      className="mt-2"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: '11px', color: '#333333' }}>
                        Created on: {formatDate(note.updated_at)}
                      </div>
                      <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}>
                        <button
                          type="button"
                          onClick={() => {
                            handleFavorite(note._id, note.isFavorite);
                          }}
                          style={{
                            color: note.isFavorite ? "orange" : "white"
                          }}
                          className="btn-rounded bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                        >
                          <FontAwesomeIcon icon={faStar} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateClick(note._id, note.title, note.content);
                          }}
                          className="btn-rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteNote(note._id);
                          }}
                          className="btn-rounded focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      )}
    </div>
  );
};

export default ViewNote;
