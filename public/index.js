const submitBtn = document.getElementById('submit-btn');
const input = document.getElementById('input');
submitBtn.addEventListener('click', handleSubmit);

function handleSubmit() {
  window.open(`/api/?handles=${input.value.split('\n').join(';')}`);
}
