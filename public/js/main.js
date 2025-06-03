// AJAX for comments
document.getElementById('comment-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const postId = form.dataset.postId;
  const content = form.content.value;

  try {
    const { data } = await axios.post(`/api/posts/${postId}/comments`, {
      content
    });
    const commentsList = document.getElementById('comments-list');
    commentsList.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="card mb-3 animate__animated animate__fadeIn">
        <div class="card-body">
          <div class="d-flex">
            <img src="${data.comment.author.avatar ||
              '/images/default-avatar.png'}" 
                 class="rounded-circle me-3" width="40">
            <div>
              <h6 class="mb-1">${data.comment.author.name}</h6>
              <p class="mb-0">${data.comment.content}</p>
            </div>
          </div>
        </div>
      </div>
    `
    );
    form.reset();
  } catch (err) {
    alert('Failed to post comment');
  }
});
