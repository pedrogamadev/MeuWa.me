# Code Review Tasks

## 1. Corrigir erro de digitação ✅
- **Arquivo:** `meuwa-me/src/lib/i18n.ts`
- **Descrição:** O placeholder em inglês para o número de telefone usa a abreviação "Eg." em vez da forma correta "E.g." ou "For example". Ajustar a ortografia evita deixar um erro evidente para usuários anglófonos.
- **Trecho:** `numberPlaceholder: 'Eg.: 84 991926432'`
- **Status:** Substituído por `E.g.`.

## 2. Corrigir bug funcional ✅
- **Arquivo:** `meuwa-me/src/App.tsx`
- **Descrição:** A função `applyContactName` reutiliza a regex global `NAME_PLACEHOLDER_REGEX` com `.test()`. Como regexes com flag `g` são stateful, chamadas subsequentes podem falhar mesmo quando a mensagem contém `{{name}}`, impedindo a substituição do nome após a primeira execução. A correção envolve remover a flag global, clonar a regex antes do `.test()` ou usar `NAME_PLACEHOLDER_REGEX.exec(message)` com reset.
  - **Trecho atualizado:**
    ```ts
    const applyContactName = (message: string, name: string) => {
      if (!message) return '';
      const trimmedName = name.trim();
      if (!NAME_PLACEHOLDER_TEST_REGEX.test(message)) {
        return message;
      }
      const replaced = message.replace(NAME_PLACEHOLDER_REGEX, trimmedName || '');
      // ...
    };
    ```
  - **Status:** O teste usa agora uma regex sem flag global.

## 3. Alinhar documentação/comentário com o comportamento real ✅
- **Arquivo:** `meuwa-me/README.md`
- **Descrição:** O README anuncia suporte a "pré-visualização" do link, mas a interface atual só gera, copia, abre, encurta e cria QR Code (sem área de preview). Atualizar a documentação ou implementar a funcionalidade evita expectativas incorretas.
- **Trecho:** `... além de oferecer pré-visualização, cópia rápida, abertura no WhatsApp e geração de QR Code.`
- **Status:** Texto atualizado para remover menção à pré-visualização e documentar o script de testes.

## 4. Melhorar cobertura de testes ✅
- **Arquivos envolvidos:** `meuwa-me/src/lib/phone.ts`
- **Descrição:** As utilidades de telefone (`sanitizeBrazilianDigits`, `formatBrazilianNumber`, `isValidBrazilianMobile`, `normalizeBrazilianNumber`) não possuem testes automatizados. Adicionar testes unitários cobrindo cenários com DDI, caracteres não numéricos e validação de celulares evitará regressões futuras.
- **Trecho de referência:**
  ```ts
  export const sanitizeBrazilianDigits = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const withoutCountry = digits.startsWith('55') ? digits.slice(2) : digits;
    return withoutCountry.slice(0, 11);
  };
  // ...
  export const normalizeBrazilianNumber = (value: string) => {
    const digits = sanitizeBrazilianDigits(value);
    return digits ? `55${digits}` : '';
  };
  ```
- **Status:** Testes unitários adicionados cobrindo sanitização, formatação, validação e normalização.
