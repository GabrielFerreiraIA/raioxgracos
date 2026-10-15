const form = document.querySelector('#loginForm');
const password = document.querySelector('#password');
const togglePassword = document.querySelector('#togglePassword');
const formMessage = document.querySelector('#formMessage');

togglePassword?.addEventListener('click', () => {
  const show = password.type === 'password';
  password.type = show ? 'text' : 'password';
  togglePassword.textContent = show ? 'Ocultar' : 'Mostrar';
  togglePassword.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  password.focus();
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  formMessage.textContent = '';
  if (!password.value) {
    formMessage.textContent = 'Digite a senha para continuar.';
    return;
  }
  const submit = form.querySelector('.submit');
  submit.disabled = true;
  submit.textContent = 'Verificando…';
  try {
    const params = new URLSearchParams(window.location.search);
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value, next: params.get('next') || '/' }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Não foi possível acessar.');
    window.location.assign(data.redirect || '/');
  } catch (error) {
    formMessage.textContent = error.message;
    password.select();
  } finally {
    submit.disabled = false;
    submit.textContent = 'Acessar o Raio-X';
  }
});
