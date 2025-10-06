export type Language = 'pt' | 'en' | 'es';

export type TemplateCategory = 'sales' | 'support' | 'collections' | 'followup';

export interface TemplateDefinition {
  id: string;
  category: TemplateCategory | 'custom';
  title: string;
  message: string;
}

interface Translation {
  languageName: string;
  appTitle: string;
  heroTagline: string;
  heroSubtitle: string;
  developerCredit: string;
  numberLabel: string;
  numberPlaceholder: string;
  numberHelper: string;
  messageLabel: string;
  messagePlaceholder: string;
  messageHelper: string;
  formatLabel: string;
  formatDescription: string;
  generateButton: string;
  copyButton: string;
  openButton: string;
  qrButton: string;
  qrTitle: string;
  qrHelper: string;
  qrDownload: string;
  qrShare: string;
  qrShareText: string;
  qrShareTitle: string;
  statusIdle: string;
  statusRestored: string;
  statusSuccess: string;
  statusCopied: string;
  statusOpen: string;
  statusQr: string;
  statusQrError: string;
  statusCopyError: string;
  statusInvalidNumber: string;
  statusMissingNumber: string;
  toastLinkReady: string;
  toastLinkCopied: string;
  toastQrReady: string;
  toastShareUnsupported: string;
  toastShareSuccess: string;
  toastShareError: string;
  toastTemplateAdded: string;
  toastTemplateRemoved: string;
  toastTemplateApplied: string;
  toastHistoryRestored: string;
  toastShortSuccess: string;
  toastShortError: string;
  toastHistoryCleared: string;
  linkSectionLabel: string;
  statusLiveLabel: string;
  instagramToast: string;
  instagramCta: string;
  footerCredit: string;
  templateLibrary: {
    title: string;
    description: string;
    apply: string;
    categories: Record<TemplateCategory | 'all' | 'custom', string>;
    addCustomTitle: string;
    addCustomDescription: string;
    customNamePlaceholder: string;
    customMessagePlaceholder: string;
    addButton: string;
    emptyCustom: string;
    removeButton: string;
    defaultTemplates: TemplateDefinition[];
  };
  history: {
    title: string;
    subtitle: string;
    empty: string;
    searchPlaceholder: string;
    favoritesOnly: string;
    clearAll: string;
    actionsLabel: string;
    favoriteLabel: string;
    unfavoriteLabel: string;
    reuse: string;
    copy: string;
    open: string;
    remove: string;
    savedAt: string;
    favoriteTag: string;
    shortLabel: string;
    longLabel: string;
  };
  advanced: {
    title: string;
    toggleShow: string;
    toggleHide: string;
    description: string;
    contactNameLabel: string;
    contactNameHelper: string;
    utmTitle: string;
    utmHelper: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
  };
  shortener: {
    shorten: string;
    shortening: string;
    label: string;
  };
  languageSwitcher: {
    label: string;
  };
  common: {
    close: string;
  };
  help: {
    nameInfoButton: string;
    nameInfoAria: string;
    nameInfoTitle: string;
    nameInfoDescription: string;
    nameInfoAction: string;
  };
  tutorial: {
    title: string;
    description: string;
    steps: Array<{ title: string; description: string }>;
    progressLabel: string;
    skip: string;
    next: string;
    previous: string;
    finish: string;
  };
}

export const translations: Record<Language, Translation> = {
  pt: {
    languageName: 'Português',
    appTitle: 'MeuWa.me',
    heroTagline: 'Crie seu link do WhatsApp em segundos.',
    heroSubtitle: 'Automatize o contato com seus clientes e personalize cada detalhe.',
    developerCredit: 'Desenvolvido por Arabella.dev 💜',
    numberLabel: 'Número de WhatsApp',
    numberPlaceholder: 'Ex.: 84 991926432',
    numberHelper: 'Digite DDD + número (somente números). Nós adicionamos o +55 automaticamente.',
    messageLabel: 'Mensagem (opcional)',
    messagePlaceholder: 'Oi! Criei esse link do WhatsApp para facilitar nosso contato.',
    messageHelper: 'Use {{name}} para personalizar com o nome do contato automaticamente.',
    formatLabel: 'Usar formato amigável',
    formatDescription: 'Substitui espaços por %20 e mantém os caracteres seguros na URL.',
    generateButton: 'Gerar link',
    copyButton: 'Copiar link',
    openButton: 'Abrir no WhatsApp',
    qrButton: 'Gerar QR Code',
    qrTitle: 'QR Code pronto',
    qrHelper: 'Escaneie para abrir no WhatsApp.',
    qrDownload: 'Baixar QR Code',
    qrShare: 'Compartilhar',
    qrShareText: 'Use esse QR Code para iniciar nossa conversa no WhatsApp!',
    qrShareTitle: 'Link do WhatsApp',
    statusIdle: 'Pronto para gerar o seu link personalizado.',
    statusRestored: 'Seu último link foi restaurado.',
    statusSuccess: 'Link gerado com sucesso! ✨',
    statusCopied: 'Link copiado para a área de transferência! ✅',
    statusOpen: 'Abrindo o WhatsApp…',
    statusQr: 'QR Code pronto para escanear!',
    statusQrError: 'Gere um link primeiro para criar o QR Code.',
    statusCopyError: 'Não foi possível copiar o link. Tente novamente.',
    statusInvalidNumber: 'Digite um número de celular brasileiro válido (DDD + 9 dígitos).',
    statusMissingNumber: 'Informe um número com DDD para gerar o link.',
    toastLinkReady: 'Link prontinho para compartilhar!',
    toastLinkCopied: 'Link copiado!',
    toastQrReady: 'QR Code gerado!',
    toastShareUnsupported: 'Compartilhamento não disponível neste dispositivo.',
    toastShareSuccess: 'QR Code compartilhado! 📲',
    toastShareError: 'Não foi possível compartilhar agora.',
    toastTemplateAdded: 'Template salvo na sua biblioteca.',
    toastTemplateRemoved: 'Template removido.',
    toastTemplateApplied: 'Mensagem carregada a partir do template.',
    toastHistoryRestored: 'Histórico carregado com sucesso.',
    toastShortSuccess: 'Link encurtado com sucesso!',
    toastShortError: 'Não foi possível encurtar o link agora.',
    toastHistoryCleared: 'Histórico apagado.',
    linkSectionLabel: 'Seu link',
    statusLiveLabel: 'Status atual:',
    instagramToast: 'Abrimos o Instagram da Arabella.dev em outra aba! ✨',
    instagramCta: 'Fale com a Arabella.dev',
    footerCredit: '© 2025 MeuWa.me — por Arabella.dev',
    templateLibrary: {
      title: 'Biblioteca de mensagens',
      description: 'Escolha uma mensagem pronta para começar ou salve as suas favoritas.',
      apply: 'Usar mensagem',
      categories: {
        all: 'Todas',
        sales: 'Vendas',
        support: 'Atendimento',
        collections: 'Cobrança',
        followup: 'Follow-up',
        custom: 'Personalizadas',
      },
      addCustomTitle: 'Adicionar mensagem personalizada',
      addCustomDescription: 'Salve mensagens recorrentes para usar sempre que quiser.',
      customNamePlaceholder: 'Título da mensagem',
      customMessagePlaceholder: 'Digite sua mensagem usando {{name}} para o nome do contato.',
      addButton: 'Salvar mensagem',
      emptyCustom: 'Você ainda não salvou mensagens personalizadas.',
      removeButton: 'Remover',
      defaultTemplates: [
        {
          id: 'pt-sales-1',
          category: 'sales',
          title: 'Apresentação rápida',
          message:
            'Olá {{name}}, tudo bem? Aqui é da nossa equipe e vi que você demonstrou interesse no nosso produto. Posso te ajudar a dar o próximo passo? 😊',
        },
        {
          id: 'pt-support-1',
          category: 'support',
          title: 'Atendimento inicial',
          message:
            'Oi {{name}}, obrigado por nos chamar! Para agilizar o atendimento, poderia me confirmar o número do pedido e o serviço desejado?',
        },
        {
          id: 'pt-collections-1',
          category: 'collections',
          title: 'Lembrete de pagamento',
          message:
            'Olá {{name}}, tudo bem? Notamos que o pagamento referente ao seu pedido está em aberto. Posso te ajudar a finalizar agora mesmo?',
        },
        {
          id: 'pt-follow-1',
          category: 'followup',
          title: 'Acompanhamento pós-venda',
          message:
            'Oi {{name}}! Passando para saber como está a experiência com o que você adquiriu conosco. Posso ajudar com algo a mais?',
        },
      ],
    },
    history: {
      title: 'Histórico de links',
      subtitle: 'Gerencie, reutilize e favorite os links que você já gerou.',
      empty: 'Nenhum link gerado ainda. Crie um link para começar!',
      searchPlaceholder: 'Buscar por nome, número ou mensagem…',
      favoritesOnly: 'Mostrar apenas favoritos',
      clearAll: 'Limpar histórico',
      actionsLabel: 'Ações',
      favoriteLabel: 'Favoritar',
      unfavoriteLabel: 'Remover dos favoritos',
      reuse: 'Reutilizar',
      copy: 'Copiar',
      open: 'Abrir',
      remove: 'Excluir',
      savedAt: 'Salvo em',
      favoriteTag: 'Favorito',
      shortLabel: 'Link curto',
      longLabel: 'Link completo',
    },
    advanced: {
      title: 'Personalização avançada',
      toggleShow: 'Mostrar opções avançadas',
      toggleHide: 'Ocultar opções avançadas',
      description: 'Adicione nome automático, parâmetros UTM e outros ajustes para campanhas.',
      contactNameLabel: 'Nome do contato (opcional)',
      contactNameHelper: 'Se informado, substitui {{name}} na mensagem final.',
      utmTitle: 'Parâmetros UTM',
      utmHelper: 'Ajuda a rastrear campanhas de marketing. Todos os campos são opcionais.',
      utmSource: 'utm_source',
      utmMedium: 'utm_medium',
      utmCampaign: 'utm_campaign',
    },
    shortener: {
      shorten: 'Encurtar link',
      shortening: 'Encurtando…',
      label: 'Link encurtado',
    },
    languageSwitcher: {
      label: 'Idioma',
    },
    common: {
      close: 'Fechar',
    },
    help: {
      nameInfoButton: 'Como personalizar o nome?',
      nameInfoAria: 'Saiba como personalizar o nome automaticamente',
      nameInfoTitle: 'Personalize o nome automaticamente',
      nameInfoDescription:
        "Para que {{name}} funcione na mensagem, abra a personalização avançada e preencha o campo 'Nome do contato'. Assim o link já chega com o nome certo para cada pessoa.",
      nameInfoAction: 'Abrir personalização avançada',
    },
    tutorial: {
      title: 'Bem-vindo ao MeuWa.me',
      description: 'Veja como gerar seus links do WhatsApp em poucos passos.',
      steps: [
        {
          title: '1. Informe o número',
          description:
            'Digite o DDD + número (somente números). O +55 é adicionado automaticamente e você pode validar o contato antes de gerar.',
        },
        {
          title: '2. Crie a mensagem',
          description:
            'Escreva uma mensagem opcional usando {{name}} para personalizar o nome. Você também pode aplicar templates prontos ou salvar os seus.',
        },
        {
          title: '3. Personalize e compartilhe',
          description:
            'Use a personalização avançada para preencher nome, UTMs e encurtar o link. Depois copie, abra no WhatsApp ou gere um QR Code.',
        },
      ],
      progressLabel: 'Passo {{current}} de {{total}}',
      skip: 'Pular tutorial',
      next: 'Próximo',
      previous: 'Voltar',
      finish: 'Começar a usar',
    },
  },
  en: {
    languageName: 'English',
    appTitle: 'MeuWa.me',
    heroTagline: 'Create your WhatsApp link in seconds.',
    heroSubtitle: 'Automate your contact flow and personalize every detail.',
    developerCredit: 'Crafted by Arabella.dev 💜',
    numberLabel: 'WhatsApp number',
    numberPlaceholder: 'Eg.: 84 991926432',
    numberHelper: 'Type area code + number (digits only). We automatically add +55.',
    messageLabel: 'Message (optional)',
    messagePlaceholder: 'Hi! I created this WhatsApp link so we can talk easily.',
    messageHelper: 'Use {{name}} to automatically personalize the contact name.',
    formatLabel: 'Use friendly format',
    formatDescription: 'Keeps the URL safe while replacing spaces with %20.',
    generateButton: 'Generate link',
    copyButton: 'Copy link',
    openButton: 'Open in WhatsApp',
    qrButton: 'Create QR Code',
    qrTitle: 'QR Code ready',
    qrHelper: 'Scan to open in WhatsApp.',
    qrDownload: 'Download QR Code',
    qrShare: 'Share',
    qrShareText: 'Use this QR Code to start our WhatsApp conversation!',
    qrShareTitle: 'WhatsApp link',
    statusIdle: 'Ready to build your personalized link.',
    statusRestored: 'Your last link has been restored.',
    statusSuccess: 'Link generated successfully! ✨',
    statusCopied: 'Link copied to clipboard! ✅',
    statusOpen: 'Opening WhatsApp…',
    statusQr: 'QR Code ready to scan!',
    statusQrError: 'Generate a link first to create the QR Code.',
    statusCopyError: 'We could not copy the link. Try again.',
    statusInvalidNumber: 'Enter a valid Brazilian mobile number (area code + 9 digits).',
    statusMissingNumber: 'Provide a number with area code to generate the link.',
    toastLinkReady: 'Link ready to share!',
    toastLinkCopied: 'Link copied!',
    toastQrReady: 'QR Code created!',
    toastShareUnsupported: 'Sharing is not available on this device.',
    toastShareSuccess: 'QR Code shared! 📲',
    toastShareError: 'We could not share right now.',
    toastTemplateAdded: 'Template saved to your library.',
    toastTemplateRemoved: 'Template removed.',
    toastTemplateApplied: 'Message loaded from template.',
    toastHistoryRestored: 'History restored successfully.',
    toastShortSuccess: 'Link shortened successfully!',
    toastShortError: 'We could not shorten the link right now.',
    toastHistoryCleared: 'History cleared.',
    linkSectionLabel: 'Your link',
    statusLiveLabel: 'Current status:',
    instagramToast: 'We opened Arabella.dev on Instagram in a new tab! ✨',
    instagramCta: 'Talk to Arabella.dev',
    footerCredit: '© 2025 MeuWa.me — by Arabella.dev',
    templateLibrary: {
      title: 'Message library',
      description: 'Pick a ready-to-use message or save your own favorites.',
      apply: 'Use message',
      categories: {
        all: 'All',
        sales: 'Sales',
        support: 'Support',
        collections: 'Billing',
        followup: 'Follow-up',
        custom: 'Custom',
      },
      addCustomTitle: 'Add custom message',
      addCustomDescription: 'Store recurring messages to reuse whenever you need.',
      customNamePlaceholder: 'Message title',
      customMessagePlaceholder: 'Write your message using {{name}} for the contact name.',
      addButton: 'Save message',
      emptyCustom: 'You have not saved custom messages yet.',
      removeButton: 'Remove',
      defaultTemplates: [
        {
          id: 'en-sales-1',
          category: 'sales',
          title: 'Quick intro',
          message:
            'Hello {{name}}, how are you? This is our team following up on your interest in our product. Can I help you take the next step? 😊',
        },
        {
          id: 'en-support-1',
          category: 'support',
          title: 'Support greeting',
          message:
            'Hi {{name}}, thanks for reaching out! To speed things up, could you confirm your order number and how we can help?',
        },
        {
          id: 'en-collections-1',
          category: 'collections',
          title: 'Payment reminder',
          message:
            'Hello {{name}}, hope you are doing well! We noticed your payment is still pending. Can I help you finish it right now?',
        },
        {
          id: 'en-follow-1',
          category: 'followup',
          title: 'After-sales follow-up',
          message:
            'Hi {{name}}! Just checking how things are going with what you purchased from us. Is there anything else we can do?',
        },
      ],
    },
    history: {
      title: 'Link history',
      subtitle: 'Manage, reuse and favorite the links you already generated.',
      empty: 'No links generated yet. Create one to get started!',
      searchPlaceholder: 'Search by name, number or message…',
      favoritesOnly: 'Show favorites only',
      clearAll: 'Clear history',
      actionsLabel: 'Actions',
      favoriteLabel: 'Add to favorites',
      unfavoriteLabel: 'Remove from favorites',
      reuse: 'Reuse',
      copy: 'Copy',
      open: 'Open',
      remove: 'Delete',
      savedAt: 'Saved on',
      favoriteTag: 'Favorite',
      shortLabel: 'Short link',
      longLabel: 'Full link',
    },
    advanced: {
      title: 'Advanced customization',
      toggleShow: 'Show advanced options',
      toggleHide: 'Hide advanced options',
      description: 'Add automatic name, UTM parameters and campaign tweaks.',
      contactNameLabel: 'Contact name (optional)',
      contactNameHelper: 'If provided, replaces {{name}} in the final message.',
      utmTitle: 'UTM parameters',
      utmHelper: 'Useful to track marketing campaigns. All fields are optional.',
      utmSource: 'utm_source',
      utmMedium: 'utm_medium',
      utmCampaign: 'utm_campaign',
    },
    shortener: {
      shorten: 'Shorten link',
      shortening: 'Shortening…',
      label: 'Short link',
    },
    languageSwitcher: {
      label: 'Language',
    },
    common: {
      close: 'Close',
    },
    help: {
      nameInfoButton: 'How does name personalization work?',
      nameInfoAria: 'Learn how to personalize the contact name automatically',
      nameInfoTitle: 'Personalize the contact name automatically',
      nameInfoDescription:
        "To replace {{name}} in the message, open Advanced customization and fill in the 'Contact name' field. Each link can carry the correct name for the person you will contact.",
      nameInfoAction: 'Open advanced customization',
    },
    tutorial: {
      title: 'Welcome to MeuWa.me',
      description: 'Follow these quick steps to create your WhatsApp links.',
      steps: [
        {
          title: '1. Enter the number',
          description:
            'Type the area code + number (digits only). We add +55 automatically and help you validate the contact before generating.',
        },
        {
          title: '2. Craft the message',
          description:
            'Write an optional message using {{name}} to personalize the contact. You can also apply ready-made templates or save your own.',
        },
        {
          title: '3. Customize and share',
          description:
            'Use Advanced customization to fill in the name, UTMs and shorten the link. Then copy, open on WhatsApp or create a QR Code.',
        },
      ],
      progressLabel: 'Step {{current}} of {{total}}',
      skip: 'Skip tutorial',
      next: 'Next',
      previous: 'Back',
      finish: 'Start using',
    },
  },
  es: {
    languageName: 'Español',
    appTitle: 'MeuWa.me',
    heroTagline: 'Crea tu enlace de WhatsApp en segundos.',
    heroSubtitle: 'Automatiza el contacto con tus clientes y personaliza cada detalle.',
    developerCredit: 'Desarrollado por Arabella.dev 💜',
    numberLabel: 'Número de WhatsApp',
    numberPlaceholder: 'Ej.: 84 991926432',
    numberHelper: 'Escribe código de área + número (solo dígitos). Agregamos +55 automáticamente.',
    messageLabel: 'Mensaje (opcional)',
    messagePlaceholder: '¡Hola! Creé este enlace de WhatsApp para facilitar nuestro contacto.',
    messageHelper: 'Usa {{name}} para personalizar automáticamente con el nombre del contacto.',
    formatLabel: 'Usar formato amigable',
    formatDescription: 'Mantiene la URL segura reemplazando espacios por %20.',
    generateButton: 'Generar enlace',
    copyButton: 'Copiar enlace',
    openButton: 'Abrir en WhatsApp',
    qrButton: 'Generar QR Code',
    qrTitle: 'QR Code listo',
    qrHelper: 'Escanea para abrir en WhatsApp.',
    qrDownload: 'Descargar QR Code',
    qrShare: 'Compartir',
    qrShareText: '¡Usa este código QR para comenzar nuestra conversación en WhatsApp!',
    qrShareTitle: 'Enlace de WhatsApp',
    statusIdle: 'Listo para generar tu enlace personalizado.',
    statusRestored: 'Se restauró tu último enlace.',
    statusSuccess: '¡Enlace generado con éxito! ✨',
    statusCopied: '¡Enlace copiado al portapapeles! ✅',
    statusOpen: 'Abriendo WhatsApp…',
    statusQr: '¡QR Code listo para escanear!',
    statusQrError: 'Genera un enlace primero para crear el QR Code.',
    statusCopyError: 'No pudimos copiar el enlace. Intenta nuevamente.',
    statusInvalidNumber: 'Ingresa un número de celular brasileño válido (código de área + 9 dígitos).',
    statusMissingNumber: 'Informa un número con código de área para generar el enlace.',
    toastLinkReady: '¡Enlace listo para compartir!',
    toastLinkCopied: '¡Enlace copiado!',
    toastQrReady: '¡QR Code generado!',
    toastShareUnsupported: 'El dispositivo no admite compartir.',
    toastShareSuccess: '¡QR Code compartido! 📲',
    toastShareError: 'No pudimos compartir en este momento.',
    toastTemplateAdded: 'Plantilla guardada en tu biblioteca.',
    toastTemplateRemoved: 'Plantilla eliminada.',
    toastTemplateApplied: 'Mensaje cargado desde la plantilla.',
    toastHistoryRestored: 'Historial cargado correctamente.',
    toastShortSuccess: '¡Enlace acortado con éxito!',
    toastShortError: 'No pudimos acortar el enlace ahora.',
    toastHistoryCleared: 'Historial borrado.',
    linkSectionLabel: 'Tu enlace',
    statusLiveLabel: 'Estado actual:',
    instagramToast: '¡Abrimos Instagram de Arabella.dev en otra pestaña! ✨',
    instagramCta: 'Habla con Arabella.dev',
    footerCredit: '© 2025 MeuWa.me — por Arabella.dev',
    templateLibrary: {
      title: 'Biblioteca de mensajes',
      description: 'Elige un mensaje listo o guarda tus favoritos.',
      apply: 'Usar mensaje',
      categories: {
        all: 'Todos',
        sales: 'Ventas',
        support: 'Atención',
        collections: 'Cobranza',
        followup: 'Seguimiento',
        custom: 'Personalizados',
      },
      addCustomTitle: 'Agregar mensaje personalizado',
      addCustomDescription: 'Guarda mensajes recurrentes para reutilizarlos cuando quieras.',
      customNamePlaceholder: 'Título del mensaje',
      customMessagePlaceholder: 'Escribe tu mensaje usando {{name}} para el nombre del contacto.',
      addButton: 'Guardar mensaje',
      emptyCustom: 'Aún no guardaste mensajes personalizados.',
      removeButton: 'Eliminar',
      defaultTemplates: [
        {
          id: 'es-sales-1',
          category: 'sales',
          title: 'Presentación rápida',
          message:
            'Hola {{name}}, ¿todo bien? Somos del equipo y vimos tu interés en nuestro producto. ¿Te ayudo con el próximo paso? 😊',
        },
        {
          id: 'es-support-1',
          category: 'support',
          title: 'Bienvenida de soporte',
          message:
            'Hola {{name}}, ¡gracias por escribirnos! Para agilizar, ¿podés confirmar el número del pedido y cómo podemos ayudarte?',
        },
        {
          id: 'es-collections-1',
          category: 'collections',
          title: 'Recordatorio de pago',
          message:
            'Hola {{name}}, esperamos que estés bien. Notamos que tu pago sigue pendiente. ¿Te ayudo a finalizarlo ahora mismo?',
        },
        {
          id: 'es-follow-1',
          category: 'followup',
          title: 'Seguimiento postventa',
          message:
            '¡Hola {{name}}! Solo paso para saber cómo va tu experiencia con lo que adquiriste. ¿Necesitas algo más?',
        },
      ],
    },
    history: {
      title: 'Historial de enlaces',
      subtitle: 'Gestiona, reutiliza y marca tus enlaces favoritos.',
      empty: 'Todavía no generaste enlaces. ¡Crea uno para comenzar!',
      searchPlaceholder: 'Buscar por nombre, número o mensaje…',
      favoritesOnly: 'Mostrar solo favoritos',
      clearAll: 'Borrar historial',
      actionsLabel: 'Acciones',
      favoriteLabel: 'Favorito',
      unfavoriteLabel: 'Quitar de favoritos',
      reuse: 'Reutilizar',
      copy: 'Copiar',
      open: 'Abrir',
      remove: 'Eliminar',
      savedAt: 'Guardado el',
      favoriteTag: 'Favorito',
      shortLabel: 'Enlace corto',
      longLabel: 'Enlace completo',
    },
    advanced: {
      title: 'Personalización avanzada',
      toggleShow: 'Mostrar opciones avanzadas',
      toggleHide: 'Ocultar opciones avanzadas',
      description: 'Agrega nombre automático, parámetros UTM y ajustes de campaña.',
      contactNameLabel: 'Nombre del contacto (opcional)',
      contactNameHelper: 'Si lo completas, reemplaza {{name}} en el mensaje final.',
      utmTitle: 'Parámetros UTM',
      utmHelper: 'Ayudan a rastrear campañas de marketing. Todos los campos son opcionales.',
      utmSource: 'utm_source',
      utmMedium: 'utm_medium',
      utmCampaign: 'utm_campaign',
    },
    shortener: {
      shorten: 'Acortar enlace',
      shortening: 'Acortando…',
      label: 'Enlace corto',
    },
    languageSwitcher: {
      label: 'Idioma',
    },
    common: {
      close: 'Cerrar',
    },
    help: {
      nameInfoButton: '¿Cómo personalizar el nombre?',
      nameInfoAria: 'Aprende a personalizar el nombre automáticamente',
      nameInfoTitle: 'Personaliza el nombre automáticamente',
      nameInfoDescription:
        "Para que {{name}} se reemplace en el mensaje, abre la personalización avanzada y completa el campo 'Nombre del contacto'. Así cada enlace ya incluye el nombre correcto.",
      nameInfoAction: 'Abrir personalización avanzada',
    },
    tutorial: {
      title: 'Bienvenido a MeuWa.me',
      description: 'Conoce los pasos principales para crear tus enlaces de WhatsApp.',
      steps: [
        {
          title: '1. Ingresa el número',
          description:
            'Escribe el código de área + número (solo dígitos). Agregamos +55 automáticamente y te ayudamos a validar el contacto antes de generar.',
        },
        {
          title: '2. Prepara el mensaje',
          description:
            'Redacta un mensaje opcional usando {{name}} para personalizar el nombre. También puedes aplicar plantillas listas o guardar las tuyas.',
        },
        {
          title: '3. Personaliza y comparte',
          description:
            'Usa la personalización avanzada para completar el nombre, UTMs y acortar el enlace. Después copia, abre en WhatsApp o crea un código QR.',
        },
      ],
      progressLabel: 'Paso {{current}} de {{total}}',
      skip: 'Omitir tutorial',
      next: 'Siguiente',
      previous: 'Atrás',
      finish: 'Comenzar a usar',
    },
  },
};

export const supportedLanguages: Array<{ value: Language; label: string }> = (
  Object.entries(translations) as Array<[Language, Translation]>
).map(([value, translation]) => ({ value, label: translation.languageName }));
