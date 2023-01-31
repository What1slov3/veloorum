const BASE_URL = 'http://localhost:3001'

window.onload = () => {
  if (localStorage.getItem('access_token')) {
    window.location.pathname = '/';
  }
};

// Parallax

const stars = document.querySelectorAll('.star');
const clouds = document.querySelectorAll('.cloud');
const mountain = document.querySelectorAll('.mountain');

document.addEventListener('mousemove', (e) => {
  stars.forEach((star, index) => {
    index += 1;
    star.style.top = (e.clientY * (index / 100)) / 2 + 'px';
    star.style.left = -((e.clientX * (index / 100)) / 2) + 'px';
  });

  clouds.forEach((cloud, index) => {
    index += 1;
    cloud.style.top = -(0 - 40 * (e.clientY / document.documentElement.clientHeight)) * (index / 10) + 'px';
    cloud.style.left = (0 - 40 * (e.clientX / document.documentElement.clientWidth)) * (index / 10) + 'px';
  });

  mountain.forEach((mountain, index) => {
    index += 1;
    mountain.style.left =
      (0 - document.documentElement.clientWidth * 0.05 * (e.clientX / document.documentElement.clientWidth)) *
        (index / 6) +
      'px';
  });
});

// Password hide

const passwordFields = document.querySelectorAll('.password_wrapper');

passwordFields.forEach((elem) => {
  elem.children[2].addEventListener('click', (e) => {
    elem.children[1].classList.toggle('invisible');
    elem.children[2].classList.toggle('invisible');
    elem.children[0].type = 'text';
  });
  elem.children[1].addEventListener('click', (e) => {
    elem.children[1].classList.toggle('invisible');
    elem.children[2].classList.toggle('invisible');
    elem.children[0].type = 'password';
  });
});

// Toggle window

const windows = document.querySelectorAll('.window');
const togglers = document.querySelectorAll('.toggle_window');
const loginWrapper = document.querySelector('.login__wrapper');
const signinWrapper = document.querySelector('.signin__wrapper');

togglers.forEach((toggler) => {
  toggler.addEventListener('click', (e) => {
    windows.forEach((window) => window.classList.toggle('invisible'));
  });
});

// Login

const loginEmail = document.querySelector('.login__wrapper .email_field');
const loginPassword = document.querySelector('.login__wrapper .password_field');
const loginBtn = document.querySelector('.login_btn');
const loginErrorWrapper = document.querySelector('.login_error__wrapper');
const loginError = document.querySelector('.login_error__wrapper .error');

const setLoginError = (message) => {
  loginErrorWrapper.classList.remove('invisible');
  loginError.textContent = message;
};

const handleLogIn = () => {
  if (!loginEmail.value || !loginPassword.value) {
    setLoginError('Все поля должны быть заполнены');
    return;
  }

  fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: loginEmail.value, password: loginPassword.value }),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.statusCode === 401 || json.statusCode === 400) {
        setLoginError('Неверные данные входа');
        return;
      }
      if (json.statusCode >= 300) {
        setLoginError('Что-то пошло не так, повторите попытку позднее');
        return;
      }
      localStorage.setItem('access_token', json.access_token);
      window.location.pathname = '/'; 
    })
    .catch((err) => setLoginError('Что-то пошло не так, повторите попытку позднее'));
};

loginBtn.addEventListener('click', handleLogIn);

// Signin

const signinUsername = document.querySelector('.signin__wrapper .nick_field');
const signinEmail = document.querySelector('.signin__wrapper .email_field');
const signinPassword = document.querySelector('.signin__wrapper .password_field');
const signinResetPassword = document.querySelector('.signin__wrapper .repeat_password_field');
const signinBtn = document.querySelector('.signin_btn');
const signinErrorWrapper = document.querySelector('.signin_error__wrapper');
const signinError = document.querySelector('.signin_error__wrapper .error');

const setSigninError = (message) => {
  signinErrorWrapper.classList.remove('invisible');
  signinError.textContent = message;
};

const handleSignIn = () => {
  if (!signinUsername.value || !signinEmail.value || !signinPassword.value || !signinResetPassword.value) {
    setSigninError('Все поля должны быть заполнены');
    return;
  }
  if (signinUsername.value.length < 3 || signinUsername.value.length > 32) {
    setSigninError('Длина никнейма не должна быть меньше 3 и больше 32 символов');
    return;
  }
  if (signinPassword.value.length < 3) {
    setSigninError('Длина пароля не должна быть меньше 3 символов');
    return;
  }
  if (signinPassword.value !== signinResetPassword.value) {
    setSigninError('Пароли не совпадают');
    return;
  }

  fetch(`${BASE_URL}/api/users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: signinUsername.value,
      email: signinEmail.value,
      password: signinPassword.value,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.statusCode === 400) {
        setSigninError('Проверьте введенные данные');
        return;
      }
      if (json.statusCode === 500) {
        setSigninError('Что-то пошло не так, проверьте данные пользователя или повторите попытку позднее');
        return;
      }
      windows.forEach((window) => window.classList.toggle('invisible'));
      signinUsername.value = '';
      signinEmail.value = '';
      signinPassword.value = '';
      signinResetPassword.value = '';
    })
    .catch((err) => {
      console.error(err);
      setSigninError('Что-то пошло не так');
    });
};

signinBtn.addEventListener('click', handleSignIn);

// Error reset

const inputFields = document.querySelectorAll('.input_field');

inputFields.forEach((elem) => {
  elem.addEventListener('focus', (e) => {
    if (loginError.textContent) loginError.textContent = '';
    if (signinError.textContent) signinError.textContent = '';
  });
});

// Enter press event

window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    if (!loginWrapper.classList.contains('invisible')) handleLogIn();
    if (!signinWrapper.classList.contains('invisible')) handleSignIn();
  }
});
