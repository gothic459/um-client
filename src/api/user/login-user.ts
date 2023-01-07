export const loginUser = async (username: string, password: string) => {

  const url = `${process.env.REACT_APP_API_URL}/login`;
  const body = {
    username: username,
    password: password,
  };

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  })
    .then(
      (response) => {
        if (response.status === 200) {
          return response.json()
            .then((data) => {
              return Promise.resolve(data);
            });
        } else if (response.status === 401) {
          return Promise.reject('Invalid username or password');
        } else {
          return Promise.reject('Something went wrong');
        }
      },
    )

    .catch((error) => {
    });

};
