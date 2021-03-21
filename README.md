<h1 align="center">Navedex Api </h1>
<p align="center"> Sistema desenvolvido para o teste proposto pela empresa <a href="https://github.com/naveteam">Nave</a>.</p>


<h3>💻 Sobre o projeto</h3>

BANCO DE DADOS:
<li>MYSQL</li>

<br>
<p> O banco de dados possui 3 tabelas: usuarios, navers e projetos.</p>
USUARIOS:
<li> podem criar apenas um naver.</li>
<li> podem alterar ou deletar apenas o seu naver e os projetos que estão ligados a ele.</li>
<br>
NAVERS:
<li> id do usuario é usado para criação do naver.</li>
<li> está vinculado ao usuario pelo id.</li>
<li> podem participar de N projetos.</li>
<br>
PROJETOS:
<li> estão vinculados a um naver.</li>
<br>


<h3>🔨 Tecnologias</h3>  
<p>As seguintes ferramentas foram usadas na construção do projeto:</p>
<ul>
  <li><a href="">NodeJS</a></li>
  <li><a href="">mysql</a></li>
  <li><a href="">express</a></li>
  <li><a href="">jsonwebtoken</a></li>
  <li><a href="">dotenv</a></li>
  <li><a href="">bcryptjs</a></li>
  <li><a href="">hbs</a></li>
  <li><a href="">cookie-parser</a></li>

</ul>

#

<br>
<h2 align=center> Como configurar o banco de dados MySQL:</h2>
<br>


 ```bash
# Para instalar MySQL no Ubuntu
$ sudo apt install mysql-server
# Acessar terminal mysql
$ sudo mysql -u root
# Criar base de dados
mysql> CREATE DATABASE navedex_api;
# Criar usuario
mysql> CREATE USER 'navedex_mysql'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
# Garantir acesso ao usuario
mysql> GRANT ALL ON navedex_api.* TO 'navedex_mysql'@'%';
mysql> FLUSH PRIVILEGES;
# Ativar database
mysql> USE navedex_api;


# Criar tabelas do projeto:

# usuarios
mysql> CREATE TABLE users (
    -> id_user INT NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE,
    -> email VARCHAR(255) NOT NULL UNIQUE,
    -> password VARCHAR(255) NOT NULL
    -> );


# navers
mysql> CREATE TABLE navers (
    -> id_naver INT,
    -> firstName VARCHAR(255) DEFAULT NULL,
    -> lastName VARCHAR(255) DEFAULT NULL,
    -> birthDate DATE DEFAULT NULL,
    -> admissionDate DATE DEFAULT NULL,
    -> jobRole VARCHAR(255) DEFAULT NULL,
    -> id_user INT PRIMARY KEY,
    -> FOREIGN KEY (id_user) REFERENCES
    -> users(id_user) ON DELETE CASCADE ON UPDATE CASCADE
    -> );


# projetos
mysql> CREATE TABLE projects (
    -> id_project INT NOT NULL PRIMARY KEY 
    -> AUTO_INCREMENT, 
    -> name_project VARCHAR(255) DEFAULT NULL, 
    -> id_user INT, 
    -> FOREIGN KEY (id_user) REFERENCES navers
    -> (id_user) ON DELETE CASCADE ON UPDATE 
    -> CASCADE
    -> );
 ```
#

<br>
<h2 align=center> Criar arquivo no diretório base chamado .env , este arquivo irá conter as informações do banco de dados.</h2>
<br>


    $ nano ./.env

    DATABASE = navedex_api
    DATABASE_HOST = localhost
    DATABASE_USER = navedex_mysql
    DATABASE_PASSWORD = password
    JWT_SECRET = mysupersecretpassword
    JWT_EXPIRES_IN = 90d
    JWT_COOKIE_EXPIRES_IN = 90
#

 
<br>
<h2 align=center> Como rodar este projeto:</h2>
<br>



 ```bash
 # Clone o projeto para seu computador
 $ git clone git@github.com:lucasdmarten/desafioMySQL.git
 # Entre na pasta do projeto
 $ cd desafioMySQL
 # Instale todas as bibliotecas
 $ npm install --save-dev nodemon
 $ npm install express mysql dotenv bcryptjs cookie-parser jsonwebtoken hbs
 # Runserver...
 $ npm start
 ```
<br>
<br>
<br>


<h2 align=center> AUTENTICAÇÃO:</h2>

### Rota para cadastro:
<p>Registro de usuario:</p>

 ```bash
 # http://localhost:4000/auth/register/

$ curl --location --request POST 'http://localhost:4000/auth/register/' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "email":"testando@gmail.com",
            "password":"123",
            "passwordConfirm":"123"}'
 ```
<br>

### Rota para login:
<p>Aqui sera feito login com base no cadastro feito préviamente, e será liberado o token access.</p>

 ```bash
 #http://localhost:4000/auth/login/

$ curl --location --request POST 'http://localhost:4000/auth/login/' \
      --header 'Content-Type: application/json' \
      --data-raw '{
          "email":"testando@gmail.com",
          "password":"123"
      }'

$ {"message":"Usuario de id:3 está conectado!","id":3,"email":"testando@gmail.com","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjE2MDMxMDE4LCJleHAiOjE2MjM4MDcwMTh9.XBpvm5XjfVEnw9CTrKFj0gV09jCrOVfpeWkqbPJjUS8"}
 ```

 
<br>


### O registro e o login também podem ser feitos a partir de uma interface web:
 ```bash
 http://localhost:4000/register/
 http://localhost:4000/login/
 ```

# APÓS LOGIN CRIE UM NAVER E ALGUNS PROJETOS!


<br>
<br>
<br>


<br>
<h2 align=center> NAVERS:</h2>
<br>


### Comece criando seu naver!
### (STORE) - Rota para criar navers:
 ```bash
 http://localhost:4000/auth/add_naver/

$ curl --location --request POST 'http://localhost:4000/auth/add_naver/' \
        --header 'Content-Type: application/json' \
        --header 'Cookie: acess-token=  substituirTOKEN  ; acess-token-id= substituirID' \
        --data-raw '{
            "firstName":"teste",
            "lastName":"teste",
            "birthDate":"1994-10-27",
            "admissionDate":"2020-04-08",
            "jobRole":"developer"
        }'

 ```


 ### (INDEX) - Rota para mostrar o naver criado pelo usuario autenticado:
 ```bash
 # O usuario poderá criar apenas um naver, e um naver está relacionado a n projetos
 http://localhost:4000/auth/list_navers
 
$ curl --location --request GET 'http://localhost:4000/auth/list_navers' \
--header 'Cookie: acess-token=  substituirTOKEN  ; acess-token-id= substituirID' \
--data-raw ''
 ```

 
 ### (UPDATE) - Rota para alterar o naver do usuario autenticado:
 Requer o field id_projeto e id_naver na body
 ```bash
 # PUT - Alterar naver vinculado ao usuario autenticado
 http://localhost:4000/auth/update_naver

$ curl --location --request PUT 'localhost:4000/auth/update_naver' \
--header 'Content-Type: application/json' \
--header 'Cookie: acess-token=  substituirTOKEN  ; acess-token-id= substituirID' \
--data-raw '{
    "firstName":"TESTE",
    "lastName":"ALTERANDO",
    "birthDate":"1994-10-27",
    "admissionDate":"2020-04-08",
    "jobRole":"Developer PLENO"
}'
 ```


<br>
<h2 align=center>AO DELETAR SEU NAVER, TODOS OS PROJETOS DO TAMBÉM SERÃO EXCLUIDOS</h2> 
<br>

### (DELETE) - Rota para deletar o naver do usuario autenticado:
Requer id do naver a ser deletado

 ```bash
 # DELETE - Deletar seu próprio naver vinculado ao usuario autenticado
 http://localhost:4000/auth/delete_naver/
 ```


<br>
<br>
<br>


<br>
<h2 align=center> PROJETOS:</h2>
<br>

## Registre os projetos que o seu naver já participou
### (STORE) - Rota para criar projetos:
 ```bash
 http://localhost:4000/auth/add_projetos/

$ curl --location --request POST 'http://localhost:4000/auth/add_projeto/' \
        --header 'Content-Type: application/json' \
        --header 'Cookie: acess-token=   substituirTOKEN   ; acess-token-id= substituirID' \
        --data-raw '{
            "name_projeto": "projeto_teste"
        }'
 ```


<br>
<br>
<br>


 ### (INDEX) - Rota para listar todos os projetos:
 ```bash
 # GET - Listar projetos criados pelo usuario
 http://localhost:4000/auth/list_projetos

 $ curl --location --request GET 'http://localhost:4000/auth/list_projetos/' \
--header 'Cookie: acess-token=   substituirTOKEN   ; acess-token-id= substituirID' \
--data-raw ''


#   # PUT - Filtrar projeto por id do projeto, inclusive projetos criados por outros usuarios
#  http://localhost:4000/auth/list_projetos_by_id/<int>
#  # PUT - Filtrar projetos por id do naver,  inclusive projetos criados por outros usuarios
#  http://localhost:4000/auth/list_projetos_by_id_naver/<int>

 ```
 ### (UPDATE) - Rota para alterar apenas os projetos do usuario autenticado:
 ```bash
 # PUT - Alterar projeto vinculado ao usuario autenticado
 http://localhost:4000/auth/update_projeto/<id_projeto>

curl --location --request PUT 'localhost:4000/auth/update_projeto/<id_projeto>' \
--header 'Content-Type: application/json' \
--header 'Cookie: acess-token=   substituirTOKEN   ; acess-token-id= substituirID' \
--data-raw '{
    "name_projeto":"bar do zÉ"
}'
 ```

### (DELETE) - Rota para alterar o projetos do usuario autenticado:
 ```bash
 # PUT - Alterar naver vinculado ao usuario autenticado
 http://localhost:4000/auth/delete_projeto/<int_projeto>

$ curl --location --request DELETE 'http://localhost:4000/auth/delete_projeto/<id_projeto>' \
--header 'Cookie: acess-token=   substituirTOKEN   ; acess-token-id= substituirID'
 ```


 <br>
 <h2> Dificuldades:</h2>
 <li> Trabalhar com o mysql e as relações entre usuario, naver, e projeto. Por isso achei melhor fazer outra versão utilizando uma camada abstração de dados com o mongoose. </li>

 

 
 