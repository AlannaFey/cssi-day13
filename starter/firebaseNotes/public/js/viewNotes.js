let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      const googleUserId = user.uid;
      googleUser = user;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};

const renderData = (data) => {
    const destination = document.querySelector('#app');
    destination.innerHTML = "";
    for (let key in data) {
        const note = data[key];
        destination.innerHTML += createCard(note, key + "");
    }
};

const createCard = (note, noteId) => {
    return `<div class="column is-one-quarter">
              <div class="card"> 
                <header class="card-header"> 
                  <p class="card-header-title"> 
                    ${note.title} 
                  </p> 
                </header> 
                <div class="card-content"> 
                  <div class="content">
                    ${note.text} 
                  </div>
                </div> 
                <footer class="card-footer-item">
                  <a href="#"
                  class = "card-footer-item"
                  onclick="editNote('${noteId}')">
                  Edit
                  </a>
                  <a href="#" 
                  class="card-footer-item" 
                  onclick="deleteNote('${noteId}')">
                  Delete
                  </a>
                </footer>
              </div>
            </div>`;
};

const deleteNote = (noteId) => {
    console.log(googleUser.uid);
    console.log(noteId);
    console.log("delete");
    const noteToDelete = firebase.database().ref("users/" + googleUser.uid + "/" + noteId);
    noteToDelete.remove();
}

const editNote = (noteId) => {
    console.log("Edit note" + noteId);
    const noteToEditRef = firebase.database().ref("users/" + googleUser.uid +"/" + noteId);
    noteToEditRef.on("value", (snapshot) => {
        const note = snapshot.val();
        const editNoteModal = document.querySelector("#editNoteModal");
        
        const editNoteTitleInput = document.querySelector("#editTitleInput");
        editNoteTitleInput.value = note.title;
        
        const editNoteTextInput = document.querySelector("#editTextInput");
        editNotetextInput.value = note.title;

        const editNoteIdInput = document.querySelector("#editNoteId");
        editNoteIdInput.value = "";

        editNoteModal.classList.add('is-active');
    });
}

const closeModal = () => {
    const editNoteModal = document.querySelector("#editNoteModal");
    editNoteModal.classList.remove('is-active');
}

const saveChanges =() => {
    console.log("save changes");
    const editNoteTitleInput = document.querySelector("#editTitleInput");
    const editNoteTextInput = document.querySelector("#editTextInput");
    const editNoteIdInput = document.querySelector("#editNoteId");

    const title = editNoteTitleInput.value;
    const text = editNoteTextInput.value;
    const noteId = editNoteIdInput.value;

    const noteToEditRef = firebase.database().ref("users/" + googleUser.uid + "/" + noteId);
    noteToEditRef.update({
        title: title,
        text: text
    });
    closeModal();
}