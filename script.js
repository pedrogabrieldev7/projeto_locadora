
document.getElementById('login').addEventListener('submit', async function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  console.log('Enviando dados de login:', { username, password });

  try {
      const response = await fetch('http://localhost:3000/index', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
      });

      // Verifique se a resposta foi bem-sucedida
      if (response.ok) {
          const data = await response.json();
          document.getElementById('message').textContent = data.message;

          // Redireciona para a página desejada usando um caminho relativo
          window.location.href = 'user.html'; // Altere para o nome do arquivo correto
      } else {
          const data = await response.json();
          document.getElementById('message').textContent = data.message; // Exibir mensagem de erro
      }
  } catch (error) {
      console.error('Erro ao enviar dados de login:', error);
      document.getElementById('message').textContent = 'Erro ao enviar dados de login.';
  }
});

// Registro
// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  const username = document.getElementById('username_register').value;
  const password = document.getElementById('password_register').value;
  const address = document.getElementById('address_register').value;
  const email = document.getElementById('email_register').value;
  const phone_number = document.getElementById('phone_register').value;

  const data = {
    username: username,
    password: password,
    address: address,
    email: email,
    phone_number: phone_number
  };

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json(); // Aguarde a resposta JSON

    // Verifique o resultado retornado
    if (response.ok) {
      document.getElementById('message').textContent = result.message; // Mensagem de sucesso
    } else {
      document.getElementById('message').textContent = result.message; // Mensagem de erro
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('message').textContent = 'An error occurred. Please try again later.';
  }
}

//imprimindo as contas
async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    const userListDiv = document.getElementById('userList');
    userListDiv.innerHTML = ''; // Limpa a div antes de adicionar os usuários

    users.forEach(user => {
      const userDiv = document.createElement('div');
      userDiv.textContent = `ID: ${user.id}, Username: ${user.username}, Password: ${user.password},
      Address: ${user.address}, E-mail: ${user.email}, Number Phone: ${user.phone_number}`;
      userListDiv.appendChild(userDiv);
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
  }
}

fetchUsers();