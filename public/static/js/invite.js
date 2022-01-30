const found = document.querySelector('.found');
const notFound = document.querySelector('.not_found');
const title = document.querySelector('.title');
const icon = document.querySelector('.icon');
const members = document.querySelector('.members');
const join = document.querySelector('.join');
const alreadyJoin = document.querySelector('.already_join');
const error = document.querySelector('.error');

window.onload = () => {
  fetch(`http://localhost:3001/invites/get/${window.location.href.match(/([^\/]+$)/)[0]}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}` || '',
    },
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error('No invite found');
    })
    .then((json) => {
      if (!json.title) throw new Error('No invite found');
      document.title = `Veloorum | Приглашение в ${json.title}`;
      title.textContent = json.title;
      members.textContent =
        `${json.membersCount}`.slice(-1) == 1
          ? `${json.membersCount} участник`
          : `${json.membersCount}`.slice(-1) > 0 && `${json.membersCount}`.slice(-1) < 5
          ? `${json.membersCount} участника`
          : `${json.membersCount} участников`;
      icon.style.background = `url('${json.iconUrl}') no-repeat center / cover`;

      if (json.alreadyJoin) {
        alreadyJoin.style.display = 'block';
      } else {
        join.style.display = 'block';

        join.addEventListener('click', (e) => {
          if (error.style.display === 'block') error.style.display = 'none';
          if (localStorage.getItem('access_token')) {
            fetch('http://localhost:3001/users/join_channel', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ cid: json.uuid }),
            })
              .then((res) => {
                if (res.ok) return res.json();
                throw new Error('Something broke');
              })
              .then((json) => (location.pathname = '/'))
              .catch((err) => {
                console.log(err);
                error.style.display = 'block';
              });
          } else {
            location.pathname = '/login.html';
          }
        });
      }

      found.style.display = 'block';
    })
    .catch((err) => {
      console.log(err);
      notFound.style.display = 'block';
    });
};
