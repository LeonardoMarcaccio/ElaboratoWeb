const registrationElements = {
  form: document.getElementById("registration-form"),
  essentialDataField: {
    formDiv: document.getElementById("registration-essential"),
    elements: {
      username: document.getElementById("registration-username"),
      email: document.getElementById("registration-email"),
      password: document.getElementById("registration-password"),
    }
  },
  nonEssentialDataField: {
    formDiv: document.getElementById("registration-non-essential"),
    elements: {
      firstname: document.getElementById("registration-firstname"),
      lastname: document.getElementById("registration-lastname"),
      gender: document.getElementById("registration-gender"),
      biography: document.getElementById("registration-biography"),
      personalwebsite: document.getElementById("registration-personalwebsite"),
      profilepicture: document.getElementById("registration-profilepicture"),
      phonenumber: document.getElementById("registration-phonenumber"),
    }
  },
  submitButton: document.getElementById("registration-send-data"),
  addInfoButton: document.getElementById("registration-show-non-essential")
}

// Add more info button action
registrationElements.addInfoButton.onclick = () => {
  registrationElements.nonEssentialDataField.formDiv.style.display = 'flex';
  registrationElements.addInfoButton.style.display = 'none';
  registrationElements.submitButton.innerHTML = "Complete Registration"
}

// Resets data inside the page
function resetRegistrationPage() {
  registrationElements.essentialDataField.formDiv.reset();
  registrationElements.nonEssentialDataField.formDiv.reset();
}

// Checks for page ghange to clear sent/unused data
document.addEventListener(events.genericActions.MAINCONTENTPAGECHANGE,
  () => resetRegistrationPage());

// Submits data
registrationElements.submitButton.onclick = async () => {
  let formData = new FormData(registrationElements.form);
  let username = formData.get("registration-username");
  let email = formData.get("registration-email");
  let password = formData.get("registration-password");

  let firstname = formData.get("registration-firstname");
  let lastname = formData.get("registration-lastname");
  let gender = formData.get("registration-gender");
  let biography = formData.get("registration-biography");
  let personalwebsite = formData.get("registration-personalwebsite");
  let profilePicture = formData.get("registration-profilepicture");
  let phonenumber = formData.get("registration-phonenumber");
  
  let encodedProfilePicture;
  let profilePictureExtension;

  let reader = new FileReader(profilePicture);
  let rfile = new Promise((accepted, rejected) => {
    reader.onload = () => {
      accepted(reader.result);
    }
    reader.onerror = () => {
      rejected(new Error("Could not read file!"));
    }
  });

  await rfile;

  encodedProfilePicture = btoa(rfile);
  profilePictureExtension = profilePicture.name.split(".")[1];

  let registrationJson = {
    "username":username,
    "email":email,
    "password":password,
    "firstname":firstname,
    "lastname":lastname,
    "gender":gender,
    "biography":biography,
    "personalwebsite":personalwebsite,
    "pfp": {
      "image":encodedProfilePicture,
      "format":profilePictureExtension
    },
    "phonenumber":phonenumber
  };
  console.log(registrationJson);
}
