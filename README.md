# 📚 N2 — Quiz App em React Native
[![React Native](https://img.shields.io/badge/react--native-0.71.8-blue?logo=react)](https://reactnative.dev/)
[![SQLite](https://img.shields.io/badge/sqlite-local%20db-blueviolet?logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]()

Aplicativo de **quiz educacional** desenvolvido em **React Native**, com banco de dados local via **SQLite**, onde usuários podem **criar temas**, **cadastrar perguntas e alternativas** e **realizar quizzes** com pontuação ao final.

---

## 🧪 Tecnologias Utilizadas

| Tecnologia           | Função                             |
|----------------------|-------------------------------------|
| React Native         | Interface e lógica mobile           |
| Expo SQLite          | Banco de dados local                |
| React Navigation     | Navegação entre telas               |
| JavaScript (ES6)     | Lógica da aplicação                 |
| Async/Await          | Acesso assíncrono ao banco          |
| @react-native-picker/picker        | Seleção          |

---

## 🧩 Funcionalidades

✅ Cadastro de temas  
✅ Cadastro de perguntas com 4 alternativas e a resposta correta  
✅ Edição e exclusão de perguntas/temas  
✅ Seleção de tema para o quiz  
✅ Execução de quiz com perguntas aleatórias  
✅ Cálculo da pontuação e exibição do resultado  
✅ Interface amigável e responsiva

---

## 🧱 Estrutura do Projeto

N2/<br>
├── assets/ → Ícones (editar, deletar) <br>
├── componentes/— telas (screens) do aplicativo<br>
|    |— homeScreen.js → Tela inicial com navegação<br>
|    |— cadastrarTemaScreen.js → Cadastro/edição de temas<br>
|    |— cadastrarPeguntasScreen.js → Cadastro/edição de perguntas + alternativas<br>
|    |— iniciarQuizScreen.js → Escolha de tema e quantidade para iniciar quiz<br>
|    |— quizScreen.js → Tela do quiz em execução<br>
|    |— resultadoScreen.js → Exibição do resultado final<br>
├── services/ — lógica de acesso ao banco de dados (SQLite)<br>
|    |— database.js → Conexão com SQLite + criação das tabelas<br>
|    |— dbTemas.js → CRUD de temas <br>
|    |— dbPerguntas.js → CRUD de perguntas<br>
|    |— dbAlternativas.js → CRUD de alternativas<br>
├── App.js — ponto de entrada e configuração de navegação<br>
├── app.json # Configuração do app<br>
├── index.js # Ponto de entrada da aplicação<br>
├── package.json # Dependências e scripts do projeto<br>
└── .gitignore # Arquivos ignorados no controle de versão<br>

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório**

```bash
git clone https://github.com/AdrianaKaori/N2.git
cd N2
```
2. **Instale as dependências**
```bash
npm install
```
3. **Execute o projeto**
```bash
npx expo start
```

---

## 💾 Estrutura do Banco de Dados (SQLite)
Banco local `quiz.db` criado com 3 tabelas principais:

### 🔹 Tabela `temas`
| Campo | Tipo     | Descrição                |
|-------|----------|--------------------------|
| id    | INTEGER  | Chave primária (auto)    |
| nome  | TEXT     | Nome do tema             |

### 🔹 Tabela `perguntas`
| Campo           | Tipo     | Descrição                          |
|------------------|----------|-------------------------------------|
| id               | INTEGER  | Chave primária                     |
| pergunta         | TEXT     | Enunciado da pergunta              |
| tema_id          | INTEGER  | Chave estrangeira para `temas`     |
| resposta_correta | INTEGER  | Número da alternativa correta      |

### 🔹 Tabela `alternativas`
| Campo        | Tipo     | Descrição                          |
|--------------|----------|-------------------------------------|
| id           | INTEGER  | Chave primária                     |
| pergunta_id  | INTEGER  | Chave estrangeira para `perguntas` |
| alternativa  | TEXT     | Texto da alternativa               |
| numero       | INTEGER  | Número identificador (1 a N)       |

#### Relacionamentos:
* Um tema possui várias perguntas
* Uma pergunta possui várias alternativas
* Apenas uma alternativa por pergunta deve ser marcada como correta

### 🔄 CRUDs de cada entidade:
* get() — lista todos
* add(nome) — adiciona
* update(id, nome) — edita
* delete(id) — remove

---





