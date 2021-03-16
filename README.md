<h1 align="center">Navedex Api</h1>
<p align="center"> Sistema desenvolvido para o teste proposto pela empresa <a href="https://github.com/naveteam">Nave</a>.</p>


<h3>💻 Sobre o projeto</h3>
<p>O sistema possui mecanismo de autenticação por email e senha que da acesso ao token individual de cada usuario cadastrado. Após o registro a api dará o acesso aos dados de Navers e Projetos onde é possível criar, listar, alterar e deletar cada objeto do banco de dados</p>

<h3>🔨 Tecnologias</h3>  
<p>As seguintes ferramentas foram usadas na construção do projeto:</p>
<ul>
  <li><a href="">NodeJS</a></li>
  <li><a href="">MySQL</a></li>
  <li><a href="">Express</a></li>
  <li><a href="">JWT</a></li>
</ul>

### Como configurar o banco de dados MySQL:
 ```bash
# Para instalar MySQL no Ubuntu
$ sudo apt install mysql-server
# Instalar MySQL Database Connector
$ sudo apt install python3-dev
$ sudo apt install python3-dev libmysqlclient-dev default-libmysqlclient-dev
# Acessar terminal mysql
$ sudo mysql -u root
# Criar base de dados
mysql> CREATE DATABASE navedexAPI;
# Criar usuario
mysql> CREATE USER 'nodejs_mysql'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
# Garantir acesso ao usuario
mysql> GRANT ALL ON navedexAPI.* TO 'nodejs_mysql'@'%';
mysql> FLUSH PRIVILEGES;
 ```



# Criar arquivo no diretório base chamado .env, este arquivo irá conter as informações do banco de dados.
    $ nano ./.env

    DATABASE = navedexAPI
    DATABASE_HOST = localhost
    DATABASE_USER = nodejs_mysql
    DATABASE_PASSWORD = f1f2f3f4
    JWT_SECRET = mysupersecretpassword
    JWT_EXPIRES_IN = 90d
    JWT_COOKIE_EXPIRES_IN = 90
   

 


### Como rodar este projeto:
 ```bash
 
 # Crie uma pasta
 $ mkdir navedexAPI_nodejs
 # Entre na pasta
 $ cd navedexAPI_nodejs
 # Crie um virtual environment
 $ python -m venv env
 # Para ativar
 $ source ./env/bin/activate
 # Clone o repositório 
 $ git clone git@github.com:lucasdmarten/navedexAPI_nodejs.git
 # Instale todas as bibliotecas

 # Entre na pasta do projeto
 $ cd navedexAPI_nodejs
 # Runserver...
 $ npm start
 ```
### Rota para cadastro:
<p>Registro de usuario:</p>

 ```bash
 http://localhost:4000/auth/register/
 ```
### Rota para login:
<p>Aqui sera feito login com base no cadastro feito préviamente, e será liberado o token access.</p>

 ```bash
 http://localhost:8000/auth/login/
 ```
### O registro e o login também podem ser feitos a partir de uma interface web:
 ```bash
 http://localhost:8000/register/
 http://localhost:8000/login/
 ```

### Rota para criar navers e projetos:
 ```bash
 # Navers
 http://localhost:8000/auth/add_naver/
 # Projetos
 http://localhost:8000/auth/add_projeto/
 ```

### Rota para listar todos os Navers e Projetos
 ```bash
 #Navers
 http://localhost:8000/auth/list_navers
 #Projetos
 http://localhost:8000/auth/list_projetos
 ```


<br>

 <h2> Dificuldades </h2>
 <h3>Relação entre Naver e Projeto:</h3>
 <p>Neste projeto fiquei com muita dificuldade em fazer a relação correta entre Naver e Projeto. Usei o model User do próprio Django mas customizado com email obrigatório. A partir deste model foi criado o objeto Projeto que possui relação ManyToMany com o MyUser, ou seja, um usuario pode participar de N projetos e cada projeto possui relação com N usuarios. Posteriormente foi criado o objeto Naver que está relacionado com usuario a partir do campo OneToOneField, e também projetos a partir do campo ManyToManyField, assim um naver está ligado a apenas UM usuario e o naver pode estar ligado com varios projetos.</p>
 <p>Problema: Não consigo relacionar um Naver a um Projeto e nem o Projeto ao Naver a partir do método POST, só na pagina de admin do Django. Acredito que seja problema na serialização dos models.</p>
 