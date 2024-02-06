const registrationElements = {
  essentialDataField: {
    form: document.getElementById("registration-essential"),
    elements: {
      username: document.getElementById("registration-username"),
      email: document.getElementById("registration-email"),
      password: document.getElementById("registration-password"),
    }
  },
  nonEssentialDataField: {
    form: document.getElementById("registration-non-essential"),
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
  registrationElements.nonEssentialDataField.form.style.display = 'flex';
  registrationElements.addInfoButton.style.display = 'none';
  registrationElements.submitButton.innerHTML = "Complete Registration"
}

// Resets data inside the page
function resetRegistrationPage() {
  registrationElements.essentialDataField.form.reset();
  registrationElements.nonEssentialDataField.form.reset();
}

// Checks for page ghange to clear sent/unused data
document.addEventListener(events.genericActions.MAINCONTENTPAGECHANGE,
  () => resetRegistrationPage());

// Submits data
registrationElements.submitButton.onclick = () => {
  
}
