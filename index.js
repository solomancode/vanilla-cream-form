const STR_CLASSES = ['', 'weak', 'good', 'perfect'];

function updatePasswordMeter(meter) {
  let isLong = this.value.length > 6 ? 0 : -this.value.length;
  let hasLowerCase = /[a-z]/.test(this.value);
  let hasUpperCase = /[A-Z]/.test(this.value);
  let hasSymbol = /[-!$#@%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(this.value);
  let strIndex = +isLong +hasLowerCase +hasUpperCase +hasSymbol;
  if (meter) {
    const activeClass = STR_CLASSES[strIndex];
    let strClasses = new RegExp(
      STR_CLASSES.slice(1).join('|'), 'g'
    );
    meter.className = meter.className.replace(strClasses, '');
    if (activeClass) {
      meter.classList.add(activeClass)
      meter.innerHTML = "<span class='str-tip'>"+activeClass+"</span>";
    };
  }
}

function initPasswordMeters(form) {
  let nodeList = form.querySelectorAll('[type=password]');;
  for (let i = 0; i < nodeList.length; i++) {
    let element = nodeList[i];
    let meter = element.nextElementSibling;
    element.oninput = updatePasswordMeter.bind(element, meter);
  }
}

function clearFormError(form) {
  form.querySelectorAll('.input-error').forEach(
    error => error.remove()
  )
  form.querySelectorAll('.invalid').forEach(
    element => element.classList.remove('invalid')
  )
}

function ariaSpeak(form) {
  let errorElements = form.querySelectorAll('.input-error');
  let ariaContent = `There are ${errorElements.length} errors\n`;
  for (let err = 0; err < errorElements.length; err++) {
    const element = errorElements[err];
    element.textContent += ' ';
    ariaContent += element.textContent;
  }
  let ariaStatus = document.querySelector('#signupAriaLive');
  ariaStatus.textContent = ariaContent;
}

function renderError(error) {
  let errorElement = error.element.parentNode.querySelector('.input-error');
  if (!errorElement) {
    errorElement = document.createElement('p');
    errorElement.className = 'input-error';
    errorElement.innerText = error.message;
    error.element.parentNode.appendChild(errorElement);
  }
  error.element.classList.add('invalid');
  error.element.setAttribute('aria-invalid', true);
  errorElement.innerText = error.message;
}

function toggleFormState(form, disabled) {
  const signupButton = form.elements.signupButton;
  if (disabled) {
    form.classList.add('submitted');
    signupButton.value = 'submitting';
  } else {
    form.classList.remove('submitted');
    signupButton.value = 'Create Account';
  }
  signupButton.disabled = disabled;
}

const SIGNUP_URL = 'https://private-47ed5-interviewapitest.apiary-mock.com/signup';

function sendRequest(form) {
  toggleFormState(form, true);
  const data = {
    email: form.email.value,
    username: form.username.value,
    password: form.password.value,
    fullName: form.fullName.value
  }
  var xhr = new XMLHttpRequest()
  xhr.open('POST', SIGNUP_URL)
  xhr.onload = function(response) {
    // TODO: login...
  }
  xhr.onreadystatechange = function () {
    // TODO: handle status codes...
    toggleFormState(form, false);
  }
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.send(JSON.stringify(data));
}

function onSignup (e, signupFormValidator) {
  e.preventDefault();
  const form = this;
  const isValidForm = signupFormValidator.validate();
  if (isValidForm) {
    clearFormError(form);
    sendRequest(form);
  } else {
    const errors = signupFormValidator.errors;
    errors.forEach(renderError);
    ariaSpeak(form);
  }
}

document.addEventListener("DOMContentLoaded", init);

function registerFormValidators(formValidator) {
  formValidator.registerValidator(
    "[required]",
    "valueMissing", 
    name => `required ${name} can't be blank`
  );
  formValidator.registerValidator(
    "[type=email]",
    "typeMismatch",
    name => `invalid ${name} format`
  );
  formValidator.registerValidator(
    "[type=password]",
    "tooShort",
    name => `${name} doesn't meet the minimum requirements`
  );
}

function init () {
  var signupForm = document.querySelector('#signupForm');
  var formValidator = new FormValidator(signupForm);
  registerFormValidators(formValidator);
  initPasswordMeters(signupForm);
  signupForm.onsubmit = e => onSignup.call(signupForm, e, formValidator);
}