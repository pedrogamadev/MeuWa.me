# MeuWa.me — WhatsApp Link Generator

MeuWa.me é uma aplicação web de página única criada com **Vite + React + TypeScript** e estilizada com **TailwindCSS**. Ela permite gerar links personalizados do WhatsApp (`https://wa.me/`) com número de telefone e mensagem pré-preenchida, além de oferecer cópia rápida, abertura no WhatsApp e geração de QR Code.

## 📦 Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior (inclui o npm)
- npm 9+ (instalado junto com o Node.js)

> Se você usa outra versão do gerenciador de pacotes (pnpm, yarn), adapte os comandos abaixo conforme necessário.

## 🚀 Como executar o projeto
1. Instale as dependências do projeto (incluindo `lucide-react`, `qrcode.react`, `tailwindcss` e demais bibliotecas declaradas no `package.json`):
   ```bash
   npm install
   ```
2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Abra o navegador em [http://localhost:5173](http://localhost:5173) para acessar a aplicação.

## 🛠 Scripts disponíveis
- `npm run dev`: inicia o servidor de desenvolvimento com Vite
- `npm run build`: gera a build de produção
- `npm run preview`: serve a build de produção localmente
- `npm run lint`: executa o ESLint
- `npm run test`: executa os testes unitários com Vitest

## 📁 Estrutura principal
```
meuwa-me/
├── public/
├── src/
│   ├── components/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── tailwind.config.js
```

## ✨ Principais dependências
- [`react`](https://react.dev/) e [`react-dom`](https://react.dev/learn/start-a-new-react-project) — base da interface
- [`lucide-react`](https://www.npmjs.com/package/lucide-react) — ícones
- [`qrcode.react`](https://www.npmjs.com/package/qrcode.react) — geração de QR Code
- [`tailwindcss`](https://tailwindcss.com/) — utilitários de estilo

Todas essas bibliotecas são instaladas automaticamente com `npm install`.

## 📝 Licença
Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](../LICENSE) para mais detalhes.
