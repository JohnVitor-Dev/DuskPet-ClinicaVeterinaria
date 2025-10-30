# DuskPet - Clínica Veterinária

A **DuskPet** é uma clínica veterinária dedicada ao atendimento de animais de estimação, focando em oferecer serviços de qualidade. O projeto visa resolver problemas operacionais que dificultam o trabalho diário e geram insatisfação entre os clientes.

## Problemas Identificados

A clínica enfrenta diversos desafios, incluindo:

- Dificuldades para agendar consultas.
- Falta de um sistema centralizado para gerenciar os dados dos animais.
- Controle ineficaz sobre o estoque de medicamentos.

Atualmente, a clínica utiliza um sistema manual para agendamentos, resultando em erros e atrasos. Os registros dos animais são mantidos de forma dispersa, dificultando o acesso a informações importantes para os veterinários. Além disso, o controle do estoque de medicamentos é inadequado, levando à falta ou desperdício de produtos.

## Objetivo do Projeto

Para resolver esses problemas, o sistema deve:

- Facilitar o agendamento de consultas.
- Centralizar as informações dos animais.
- Gerenciar o estoque de medicamentos de forma eficaz.

Esse novo sistema irá otimizar o trabalho dos colaboradores e melhorar a experiência dos clientes, reduzindo o tempo de espera e evitando erros comuns.

## Usuários do Sistema

O aplicativo foi idealizado para atender a três tipos de usuários:

1. **Clientes**: Podem agendar consultas e acessar informações sobre seus animais.
2. **Veterinários**: Têm acesso a dados dos animais e ao sistema de estoque.
3. **Administradores**: Podem gerenciar o sistema, incluindo agendamentos e controle de estoque.

## Status do Desenvolvimento

Atualmente, apenas o módulo do Cliente foi finalizado e implementado. As funcionalidades relacionadas ao sistema de estoque, direcionadas aos Veterinários e Administradores, ainda estão em fase de desenvolvimento.

## Tecnologias Utilizadas

### Frontend
- **React** 19.1.0 - Biblioteca JavaScript para construção de interfaces
- **React Router DOM** 7.7.1 - Roteamento de páginas
- **Vite** 7.0.4 - Build tool e dev server
- **CSS3** - Estilização com variáveis CSS e animações

### Ferramentas de Desenvolvimento
- **ESLint** - Linting e padronização de código
- **Vercel** - Plataforma de deploy

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## Instalação e Execução Local

Para rodar o projeto localmente, siga estas instruções:

1. Clone o repositório:
```bash
git clone https://github.com/JohnVitor-Dev/DuskPet-ClinicaVeterinaria.git
cd DuskPet-ClinicaVeterinaria
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
copy .env.example .env

# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse no navegador: `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter para verificar o código

## Deploy na Vercel

Este projeto está configurado para deploy na Vercel. Para fazer o deploy:

1. Crie uma conta na [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure a variável de ambiente:
   - `VITE_API_URL` - URL da sua API backend
4. A Vercel detectará automaticamente as configurações do Vite
5. Clique em "Deploy"

## Estrutura do Projeto

```
src/
├── api/          # Cliente API e configurações
├── assets/       # Imagens e recursos estáticos
├── components/   # Componentes React reutilizáveis
├── config/       # Configurações da aplicação
├── context/      # Context API (gerenciamento de estado)
├── hooks/        # Custom React Hooks
├── pages/        # Páginas da aplicação
├── services/     # Serviços e lógica de negócio
├── styles/       # Arquivos CSS
└── utils/        # Utilitários e helpers

```

## Funcionalidades Implementadas

### Módulo Cliente
- ✅ Autenticação (Login/Registro)
- ✅ Gerenciamento de perfil
- ✅ Cadastro e visualização de pets
- ✅ Agendamento de consultas
- ✅ Visualização de veterinários
- ✅ Sistema de cache local para melhor performance
- ✅ Tema claro/escuro

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para enviar pull requests ou abrir issues.

## Contato

Para mais informações, entre em contato pelo e-mail: [primaryjotavee@gmail.com](mailto:primaryjotavee@gmail.com)
