const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const db = new sqlite3.Database(path.resolve(__dirname, 'users.db'));

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Cria tabela de usuários
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        address TEXT(20),
        email TEXT NOT NULL,
        phone_number TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Erro ao criar a tabela:', err.message);
      } else {
        console.log('Tabela criada com sucesso');
      }
    });
  });

// Rota de cadastro
app.post('/register', async (req, res) => {
  const { username, password, address, email, phone_number } = req.body;
  console.log('Enviando dados de registro', { username, password, address, email, phone_number });

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      return res.json({ message: 'Erro no banco de dados.' });
    }
    if (row) {
      console.log('Usuário já existe:', row);
      return res.json({ message: 'Usuário já existe!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password, address, email, phone_number) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, address, email, phone_number],
      function(err) {
        if (err) {
          return res.json({ message: 'Erro ao registrar. Tente novamente.' });
        }
        res.json({ message: 'Registro bem-sucedido!' });
      });
  });
});

// Rota de login
app.post('/index', (req, res) => {
  console.log('Tentativa de login:', req.body);
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.json({ message: 'Usuário ou senha inválidos!' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      res.json({ message: 'Login bem-sucedido!' });
    } else {
      res.json({ message: 'Usuário ou senha inválidos!' });
    }
  });
});

// Rota para user.html
app.get('/user.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'user.html'));
});

// Rota para index.html
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//imprimindo os usuarios
app.get('/users', (req, res) => {
  db.all('SELECT id, username, password, address, email, phone_number FROM users', [], (err, rows) => {
    if (err) {
      return res.json({ message: 'Erro ao buscar os usuários.' });
    }
    res.json(rows);
  });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
