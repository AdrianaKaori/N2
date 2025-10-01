# 📚 N2 — Quiz App em React Native
[![React Native](https://img.shields.io/badge/react--native-0.71.8-blue?logo=react)](https://reactnative.dev/)
[![SQLite](https://img.shields.io/badge/sqlite-local%20db-blueviolet?logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]()

Aplicativo de **quiz educacional** desenvolvido em **React Native**, com banco de dados local via **SQLite**, onde usuários podem **criar temas**, **cadastrar perguntas e alternativas** e **realizar quizzes** com pontuação ao final.

---

## 🧩 Funcionalidades

✅ Cadastro de temas  
✅ Cadastro de perguntas e alternativas  
✅ Edição e exclusão de perguntas/temas  
✅ Seleção de tema para o quiz  
✅ Execução de quiz com perguntas aleatórias  
✅ Cálculo da pontuação e exibição do resultado  
🔜 Exportação de resultados

---

## 🧱 Estrutura do Projeto

N2/<br>
├── assets/ # Arquivos estáticos (imagens) <br>
├── componentes/— telas (screens) do aplicativo<br>
|    |— homeScreen.js<br>
|    |— cadastrarTemaScreen.js<br>
|    |— cadastrarPeguntasScreen.js<br>
|    |— iniciarQuizScreen.js<br>
|    |— quizScreen.js<br>
|    |— resultadoScreen.js<br>
├── services/ — lógica de acesso ao banco de dados (SQLite)<br>
|    |— database.js<br>
|    |— dbTemas.js<br>
|    |— dbPerguntas.js<br>
|    |— dbAlternativas.js<br>
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
Tabelas:

temas
* id (INTEGER, PK)
* nome (TEXT)

perguntas
* id (INTEGER, PK)
* pergunta (TEXT)
* id_tema (INTEGER, FK)

alternativas
* id (INTEGER, PK)
* id_pergunta (INTEGER, FK)
* alternativa (TEXT)
* correta (BOOLEAN)

Relacionamentos:
* Um tema possui várias perguntas
* Uma pergunta possui várias alternativas
* Apenas uma alternativa por pergunta deve ser marcada como correta

---





