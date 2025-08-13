# DFS-Backend

## 1. Objetivo do Projeto

Este projeto é a aplicação backend desenvolvida para o desafio fullstack da Cubos.io. A API foi construída para fornecer toda a lógica de negócio, persistência de dados e autenticação para o frontend, seguindo as melhores práticas de maneiras simples e utilizando tecnologias modernas e eficientes.

## 2. Tecnologias Utilizadas

O backend foi desenvolvido com uma stack robusta e focada em performance e tipagem. As principais tecnologias incluem:

-   **Fastify**: Framework web de alta performance para a construção da API.
-   **Drizzle ORM**: ORM leve e performático, com tipagem forte para interagir com o banco de dados.
-   **PostgreSQL (pg)**: Banco de dados relacional que é executado em um container Docker.
-   **TypeScript**: Linguagem de programação com tipagem estática para maior segurança e escalabilidade.
-   **Zod**: Biblioteca de validação de schemas, integrada ao Fastify para garantir a consistência das requisições.
-   **JSON Web Tokens (JWT)**: Utilizado com `@fastify/jwt` para autenticação de usuários.
-   **Bcrypt**: Para o hash seguro de senhas.
-   **@aws-sdk/client-s3**: Para gerenciar o upload de imagens para um bucket S3 (compatível com Cloudflare R2).
-   **Nodemailer & node-cron**: Para agendamento de tarefas em segundo plano, como o envio de e-mails.

## 3. Instalação e Configuração

Siga os passos abaixo para configurar e rodar o projeto em sua máquina de forma simples.

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/en/) (versão LTS), o [Docker](https://www.docker.com/) e o [Docker Compose](https://docs.docker.com/compose/) instalados em sua máquina.

### Passo a passo

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/seu-usuario/dfs-backend.git](https://github.com/seu-usuario/dfs-backend.git)
    cd dfs-backend
    ```

2.  **Instale as dependências do projeto**
    ```bash
    npm install
    ```

3.  **Inicie o banco de dados com Docker Compose**
    O projeto inclui um arquivo `docker-compose.yml` para subir a instância do PostgreSQL. Execute o seguinte comando:

    ```bash
    docker-compose up -d
    ```
    Isso irá iniciar o container do banco de dados em segundo plano.

4.  **Execute as migrações do banco de dados**
    Com o banco de dados rodando, aplique o schema Drizzle:

    ```bash
    npm run db:migrate
    ```

5.  **Popule o banco de dados (opcional)**
    Se você quiser inserir dados iniciais de teste, execute o script de seed:

    ```bash
    npm run db:seed
    ```

6.  **Inicie o servidor em modo de desenvolvimento**
    Para rodar a aplicação, que já inclui o serviço de cronjob, use o seguinte comando:

    ```bash
    npm run dev
    ```

    O servidor estará disponível em `http://localhost:3333`.