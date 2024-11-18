document.getElementById('imageUrlInput').addEventListener('input', function () {
  const imageUrl = this.value;
  const previewImage = document.getElementById('previewImage');
  const notFoundMessage = document.getElementById('notFoundMessage');

  if (imageUrl) {
    previewImage.src = imageUrl;
    previewImage.style.display = 'block';
    notFoundMessage.style.display = 'none';

    previewImage.onload = function () {
      previewImage.style.display = 'block';
      notFoundMessage.style.display = 'none';
    };

    previewImage.onerror = function () {
      previewImage.style.display = 'none';
      notFoundMessage.style.display = 'block';
    };
  } else {
    previewImage.src = '';
    previewImage.style.display = 'none';
    notFoundMessage.style.display = 'none';
  }
});
