### 1 Como Rodar a Aplicação

A aplicação foi projetada para ser executada ao abrir o index.html no navegador. Para garantir o funcionamento do backend, é necessário rodar o JSON Server, que atua como um servidor de armazenamento de dados para registrar automaticamente as alterações feitas pelo usuário.

Para iniciar o servidor, abra o terminal no Visual Studio Code e digite o seguinte comando:

json-server --watch server/db.json --port 3000

Esse comando inicia o JSON Server e permite que a aplicação interaja com o banco de dados JSON.



### 2 Estrutura do Projeto

O projeto está organizado em cinco pastas e cinco arquivos externos. Dois desses arquivos foram gerados automaticamente pelo comando:

npm init -y

As outras três pastas foram criadas manualmente pelo desenvolvedor.

📁 .vscode/

A pasta .vscode/ contém configurações específicas para o Visual Studio Code. Seus arquivos principais incluem:

settings.json – Configurações personalizadas do editor.

launch.json – Configuração para depuração (debug) do código.

tasks.json – Definição de tarefas automatizadas, como builds e scripts.

extensions.json – Sugestões de extensões recomendadas para o projeto.

Essa pasta é útil para personalizar o ambiente de desenvolvimento de forma otimizada.

📁 config/

Esta pasta contém o arquivo .hintrc, que configura a ferramenta WebHint. O WebHint analisa o código do projeto para garantir boas práticas, acessibilidade e otimizações.

Explicação das Configurações:

{
  "extends": ["development"],
  "hints": {
    "axe/forms": [
      "default",
      {
        "label": "off"
      }
    ]
  }
}

extends: ["development"] → Usa as regras padrão para ambiente de desenvolvimento.

hints → Define regras específicas de análise.

axe/forms → Desativa a verificação de rótulos (label) em formulários dentro das regras de acessibilidade do Axe.

📁 node_modules/

Criada automaticamente ao executar npm install, essa pasta contém todas as dependências do projeto.

📁 public/

Contém os arquivos responsáveis pela exibição da aplicação no navegador:

index.html → Estrutura visual da aplicação.

script.js → Lógica e interatividade da aplicação.

style.css → Estilização da interface gráfica.

📁 server/

Responsável pelo backend da aplicação, contém:

cors.js → Configuração de permissões CORS.

db.json → Banco de dados JSON para armazenar as configurações do usuário.

server.js → Configuração do JSON Server para manipulação de dados via API RESTful.

📂 Pasta Externa

Além das pastas mencionadas, a estrutura do projeto também inclui:

atividade.txt → Instruções ou requisitos do projeto.

image.png → Imagem ilustrativa do funcionamento da aplicação.

README.md → Arquivo de documentação (este documento).

3) o Explicação sobre a comunicação frontend-backend.

### 3 Explicação sobre a comunicação frontend-backend

A comunicação entre o frontend e o backend no projeto ocorre por meio de requisições HTTP utilizando o JSON Server, que simula um backend RESTful para armazenar e recuperar as configurações do objeto 3D.

 Backend (JSON Server)
 
O backend é baseado no JSON Server, um servidor leve que permite manipulação de dados via API REST. O arquivo `server.js` inicia o servidor e define rotas personalizadas para salvar e recuperar as configurações:

- `GET /configuracoes` - Retorna as configurações salvas.
- `PUT /config` - Atualiza e persiste as configurações no arquivo `db.json`.

A rota `PUT /config` recebe os dados enviados pelo frontend e os armazena no JSON Server para que possam ser recuperados posteriormente.

 Frontend (Requisições HTTP)
O frontend utiliza a API Fetch para enviar e recuperar as configurações:

1. **Salvar as configurações automaticamente:** Sempre que o usuário altera um parâmetro, como cor do cubo ou intensidade da luz, uma requisição `PUT` é feita para persistir os dados no JSON Server:
   
   ```javascript
   fetch("http://localhost:3000/config", {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(config)
   });
   ```

2. **Recuperar as configurações salvas ao iniciar a aplicação:** Quando a página é carregada, uma requisição `GET` é feita para obter os valores armazenados e aplicá-los no objeto 3D:
   
   ```javascript
   fetch("http://localhost:3000/configuracoes")
       .then(res => res.json())
       .then(data => {
           config = data;
           cube.material.color.set(config.color);
           directionalLight.intensity = config.lightIntensity;
           scene.background = new THREE.Color(config.backgroundColor);
           cube.position.set(config.position.x, config.position.y, config.position.z);
       });
   ```

Essa comunicação entre frontend e backend garante que todas as alterações feitas pelo usuário sejam persistidas e aplicadas automaticamente, mantendo a experiência consistente a cada recarregamento da página.


### COMANDOS ESPECIAIS
Adaptações dos Controles de Movimentação e Rotação
A interação com o cubo e a câmera foi aprimorada para permitir diferentes formas de controle, tornando a navegação mais intuitiva e acessível ao usuário.

Movimentação do Cubo (Setas do Teclado - Direcionais)

⬆️ (Seta para cima): Move o cubo para frente (reduzindo o valor do eixo Z).

⬇️ (Seta para baixo): Move o cubo para trás (aumentando o valor do eixo Z).

⬅️ (Seta para esquerda): Move o cubo para a esquerda (reduzindo o valor do eixo X).

➡️ (Seta para direita): Move o cubo para a direita (aumentando o valor do eixo X).
Zoom da Câmera (+ e -)

➕ (Tecla "+"): Aproxima a câmera, simulando um zoom-in.

➖ (Tecla "-"): Afasta a câmera, simulando um zoom-out.

Rotação do Cubo (Teclas Numéricas 8, 4, 5, 6)

8 (Numpad): Rotaciona o cubo para frente (eixo X negativo).

5 (Numpad): Rotaciona o cubo para trás (eixo X positivo).

4 (Numpad): Rotaciona o cubo para a esquerda (eixo Y negativo).

6 (Numpad): Rotaciona o cubo para a direita (eixo Y positivo).

Rotação da Câmera (Teclas WASD)

A: Rotaciona a câmera para a esquerda.

D: Rotaciona a câmera para a direita.

W: Eleva a câmera, permitindo visualizar o cubo de cima.

S: Abaixa a câmera, permitindo visualizar o cubo de baixo.

Opções do Menu:

✅ Cor do Cubo – Permite alterar a cor do cubo dinamicamente.

✅ Intensidade da Luz – Ajusta a iluminação direcional da cena.

✅ Cor do Fundo – Modifica a cor de fundo da cena para maior personalização.

✅ Posição do Cubo (X, Y, Z) – Permite modificar a posição do cubo diretamente via input numérico.

✅ Rotação do Cubo (X, Y) – Ajusta a rotação do cubo nos eixos X e Y.

✅ Rotação da Câmera (Theta e Phi) – Controla o ângulo da câmera em torno do cubo.

### 4. Possíveis Melhorias Futuras

Apesar do projeto atender aos requisitos estabelecidos, existem algumas melhorias que podem ser implementadas para aprimorar a funcionalidade, performance e usabilidade da aplicação:

4.1. Persistência de Configurações no Servidor com Atualização em Tempo Real
Atualmente, as configurações são salvas no **JSON Server** via requisições HTTP, mas a atualização ocorre apenas quando a página é carregada novamente. 
- **Solução**: Implementar WebSockets ou Server-Sent Events (SSE) para permitir que as configurações sejam atualizadas em tempo real no frontend sempre que houver uma alteração no servidor.

4.2. Interface Gráfica Mais Intuitiva
O menu de configuração pode ser aprimorado para tornar a interação mais intuitiva e eficiente.
- **Solução**: Utilizar frameworks de UI como **React** ou **Vue.js**, permitindo uma renderização mais dinâmica dos elementos e melhor organização do código.

 4.3. Melhorias no Controle da Câmera e Interação com o Cubo
Os controles atuais da câmera e do cubo funcionam bem, mas poderiam ser mais fluidos e intuitivos.
- **Solução**: Implementar animações suaves para as transições de movimento e rotação, além de permitir o uso de **touchscreen** para dispositivos móveis.

4.4. Autenticação e Controle de Usuários
Atualmente, qualquer usuário pode modificar as configurações do cubo sem restrições.
- **Solução**: Implementar um sistema de autenticação com **JWT** ou **OAuth** para garantir que apenas usuários autenticados possam modificar as configurações.

4.5. Implementação de Banco de Dados Relacional
O **JSON Server** é úteis para testes e desenvolvimento, mas não é adequado para produção.
- **Solução**: Migrar os dados para um banco de dados real, como **MongoDB**, **PostgreSQL** ou **Firebase**, garantindo maior segurança e escalabilidade.

