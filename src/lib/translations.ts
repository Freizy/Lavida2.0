export type Locale = "en" | "es" | "fr";

export type TranslationKey = {
  nav: {
    history: string;
    tools: string;
    signIn: string;
    signOut: string;
  };
  home: {
    title: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    gender: string;
    male: string;
    female: string;
    age: string;
    agePlaceholder: string;
    symptoms: string;
    symptomsPlaceholder: string;
    analyze: string;
    profileRestored: string;
    privacy: string;
    privacyDesc: string;
    consulting: string;
    consultSubtext: string;
  };
  results: {
    title: string;
    subtitle: string;
    potentialCause: string;
    nextSteps: string;
    chatWithLaVida: string;
    startNewCheck: string;
  };
  history: {
    title: string;
    signInPrompt: string;
    signInDesc: string;
    empty: string;
  };
  tools: {
    title: string;
    assistant: string;
    assistantDesc: string;
  };
  chat: {
    title: string;
    subtitle: string;
    online: string;
    placeholder: string;
  };
  dashboard: {
    welcome: string;
    title: string;
    subtitle: string;
    quickCheck: string;
    profile: string;
    history: string;
    savedCheckups: string;
    lastCheck: string;
    tools: string;
    toolsDesc: string;
    profileSettings: string;
    saveProfile: string;
    saving: string;
    saved: string;
    saveError: string;
    healthSummary: string;
    conditions: string;
    noConditions: string;
  };
  healthScore: {
    title: string;
    noData: string;
    good: string;
    fair: string;
    needsAttention: string;
    excellent: string;
    basedOn: string;
    checkups: string;
  };
  emergency: {
    title: string;
    services: string;
    servicesDesc: string;
    poison: string;
    poisonDesc: string;
    crisis: string;
    crisisDesc: string;
    warning: string;
  };
  footer: {
    disclaimer: string;
  };
};

const translations: Record<Locale, TranslationKey> = {
  en: {
    nav: {
      history: "History",
      tools: "Wellness Tools",
      signIn: "Sign In",
      signOut: "Sign Out",
    },
    home: {
      title: "How are you",
      titleHighlight: "feeling",
      titleEnd: "today?",
      subtitle: "Describe your symptoms and get an AI-powered health analysis in seconds.",
      gender: "Gender",
      male: "Male",
      female: "Female",
      age: "Age",
      agePlaceholder: "e.g. 28",
      symptoms: "Symptoms",
      symptomsPlaceholder: "Describe your symptoms in detail (e.g., headache for 3 days, mild fever...)",
      analyze: "Analyze My Health",
      profileRestored: "Saved profile restored",
      privacy: "Privacy First",
      privacyDesc: "Your data is stored securely. Log in to access your history from any device.",
      consulting: "Consulting AI Buddy...",
      consultSubtext: "This usually takes about 5 seconds.",
    },
    results: {
      title: "AI Analysis",
      subtitle: "Urgency Assessment",
      potentialCause: "Potential Cause",
      nextSteps: "Recommended Next Steps",
      chatWithLaVida: "Chat with LaVida",
      startNewCheck: "Start New Check",
    },
    history: {
      title: "History",
      signInPrompt: "Sign in to view history",
      signInDesc: "Create an account or sign in to save and access your symptom checkup history.",
      empty: "Your check-up history will appear here after your first symptom analysis.",
    },
    tools: {
      title: "Wellness Tools",
      assistant: "Wellness Assistant",
      assistantDesc: "Chat with LaVida for personalized health guidance, symptom follow-ups, and wellness recommendations.",
    },
    chat: {
      title: "LaVida Buddy",
      subtitle: "Health Assistant",
      online: "Online",
      placeholder: "Ask a follow-up question...",
    },
    dashboard: {
      welcome: "Welcome back",
      title: "Your health dashboard",
      subtitle: "Track your saved profile, revisit your symptom history, and keep your health records organized in one place.",
      quickCheck: "Quick check again",
      profile: "Profile",
      history: "History",
      savedCheckups: "Saved symptom checkups",
      lastCheck: "Last check",
      tools: "Tools",
      toolsDesc: "Personalized recommendations, reminders, and follow-up support are ready for your next step.",
      profileSettings: "Profile settings",
      saveProfile: "Save profile",
      saving: "Saving...",
      saved: "Profile updated successfully.",
      saveError: "Unable to update profile right now.",
      healthSummary: "Latest health summary",
      conditions: "Detected conditions",
      noConditions: "No current conditions listed.",
    },
    healthScore: {
      title: "Health Score",
      noData: "No data yet",
      good: "Good",
      fair: "Fair",
      needsAttention: "Needs Attention",
      excellent: "Excellent",
      basedOn: "Based on your last",
      checkups: "checkup(s)",
    },
    emergency: {
      title: "Emergency Contacts",
      services: "Emergency Services",
      servicesDesc: "Police, Fire, Medical emergencies",
      poison: "Poison Control",
      poisonDesc: "24/7 poison help hotline",
      crisis: "Crisis Hotline",
      crisisDesc: "Mental health crisis support",
      warning: "If this is a medical emergency, call 911 immediately. Do not wait for an AI response.",
    },
    footer: {
      disclaimer: "Medical Disclaimer: This AI is for information only and not a substitute for professional medical advice. If you have an emergency, please call local emergency services immediately.",
    },
  },
  es: {
    nav: {
      history: "Historial",
      tools: "Herramientas",
      signIn: "Iniciar sesion",
      signOut: "Cerrar sesion",
    },
    home: {
      title: "Como te",
      titleHighlight: "sientes",
      titleEnd: "hoy?",
      subtitle: "Describe tus sintomas y obtiene un analisis de salud con IA en segundos.",
      gender: "Genero",
      male: "Masculino",
      female: "Femenino",
      age: "Edad",
      agePlaceholder: "ej. 28",
      symptoms: "Sintomas",
      symptomsPlaceholder: "Describe tus sintomas en detalle (ej., dolor de cabeza por 3 dias, fiebre leve...)",
      analyze: "Analizar mi salud",
      profileRestored: "Perfil guardado restaurado",
      privacy: "Privacidad primero",
      privacyDesc: "Tus datos se almacenan de forma segura. Inicia sesion para acceder a tu historial desde cualquier dispositivo.",
      consulting: "Consultando al companero de IA...",
      consultSubtext: "Esto usualmente toma about 5 segundos.",
    },
    results: {
      title: "Analisis IA",
      subtitle: "Evaluacion de urgencia",
      potentialCause: "Causa potencial",
      nextSteps: "Pasos recomendados",
      chatWithLaVida: "Chatear con LaVida",
      startNewCheck: "Iniciar nuevo analisis",
    },
    history: {
      title: "Historial",
      signInPrompt: "Inicia sesion para ver el historial",
      signInDesc: "Crea una cuenta o inicia sesion para guardar y acceder a tu historial de chequeos.",
      empty: "Tu historial de chequeos aparecera aqui despues de tu primer analisis de sintomas.",
    },
    tools: {
      title: "Herramientas de bienestar",
      assistant: "Asistente de bienestar",
      assistantDesc: "Chatea con LaVida para obtener orientacion personalizada sobre salud y recomendaciones de bienestar.",
    },
    chat: {
      title: "Companero LaVida",
      subtitle: "Asistente de salud",
      online: "En linea",
      placeholder: "Haz una pregunta de seguimiento...",
    },
    dashboard: {
      welcome: "Bienvenido de nuevo",
      title: "Tu panel de salud",
      subtitle: "Consulta tu perfil guardado, revisa tu historial de sintomas y mantene tus registros organizados.",
      quickCheck: "Analisis rapido",
      profile: "Perfil",
      history: "Historial",
      savedCheckups: "Chequeos guardados",
      lastCheck: "Ultimo chequeo",
      tools: "Herramientas",
      toolsDesc: "Recomendaciones personalizadas y seguimiento listos para tu proximo paso.",
      profileSettings: "Configuracion del perfil",
      saveProfile: "Guardar perfil",
      saving: "Guardando...",
      saved: "Perfil actualizado exitosamente.",
      saveError: "No se pudo actualizar el perfil.",
      healthSummary: "Resumen de salud reciente",
      conditions: "Condiciones detectadas",
      noConditions: "No hay condiciones actuales listadas.",
    },
    healthScore: {
      title: "Puntuacion de salud",
      noData: "Sin datos aun",
      good: "Bueno",
      fair: "Regular",
      needsAttention: "Necesita atencion",
      excellent: "Excelente",
      basedOn: "Basado en tus ultimos",
      checkups: "chequeos",
    },
    emergency: {
      title: "Contactos de emergencia",
      services: "Servicios de emergencia",
      servicesDesc: "Policia, Bomberos, Emergencias medicas",
      poison: "Control de envenenamiento",
      poisonDesc: "Linea de ayuda 24/7",
      crisis: "Linea de crisis",
      crisisDesc: "Apoyo en crisis de salud mental",
      warning: "Si esta es una emergencia medica, llame al 911 inmediatamente. No espere una respuesta de IA.",
    },
    footer: {
      disclaimer: "Aviso medico: Esta IA es solo informativa y no sustituye el consejo medico profesional. Si tiene una emergencia, llame a los servicios de emergencia inmediatamente.",
    },
  },
  fr: {
    nav: {
      history: "Historique",
      tools: "Outils",
      signIn: "Se connecter",
      signOut: "Deconnexion",
    },
    home: {
      title: "Comment",
      titleHighlight: "vous sentez",
      titleEnd: "vous aujourd'hui?",
      subtitle: "Decrivez vos symptomes et obtenez une analyse de sante par IA en quelques secondes.",
      gender: "Genre",
      male: "Homme",
      female: "Femme",
      age: "Age",
      agePlaceholder: "ex. 28",
      symptoms: "Symptomes",
      symptomsPlaceholder: "Decrivez vos symptomes en detail (ex., mal de tete depuis 3 jours, legere fievre...)",
      analyze: "Analyser ma sante",
      profileRestored: "Profil sauvegarde restaure",
      privacy: "Confidentialite d'abord",
      privacyDesc: "Vos donnees sont stockees en toute securite. Connectez-vous pour acceder a votre historique depuis n'importe quel appareil.",
      consulting: "Consultation de l'assistant IA...",
      consultSubtext: "Cela prend generalement environ 5 secondes.",
    },
    results: {
      title: "Analyse IA",
      subtitle: "Evaluation de l'urgence",
      potentialCause: "Cause potentielle",
      nextSteps: "Prochaines etapes recommandees",
      chatWithLaVida: "Discuter avec LaVida",
      startNewCheck: "Commencer un nouvel examen",
    },
    history: {
      title: "Historique",
      signInPrompt: "Connectez-vous pour voir l'historique",
      signInDesc: "Creez un compte ou connectez-vous pour sauvegarder et acceder a votre historique.",
      empty: "Votre historique d'examens apparaitra ici apres votre premiere analyse de symptomes.",
    },
    tools: {
      title: "Outils de bien-etre",
      assistant: "Assistant de bien-etre",
      assistantDesc: "Discutez avec LaVida pour des conseils de sante personnalises et des recommandations de bien-etre.",
    },
    chat: {
      title: "Assistant LaVida",
      subtitle: "Assistant de sante",
      online: "En ligne",
      placeholder: "Posez une question de suivi...",
    },
    dashboard: {
      welcome: "Bon retour",
      title: "Votre tableau de sante",
      subtitle: "Consultez votre profil, revisitez votre historique de symptomes et gardez vos dossiers organises.",
      quickCheck: "Analyse rapide",
      profile: "Profil",
      history: "Historique",
      savedCheckups: "Examens sauvegardes",
      lastCheck: "Dernier examen",
      tools: "Outils",
      toolsDesc: "Recommandations personnalisees et suivi prets pour votre prochaine etape.",
      profileSettings: "Parametres du profil",
      saveProfile: "Sauvegarder le profil",
      saving: "Sauvegarde...",
      saved: "Profil mis a jour avec succes.",
      saveError: "Impossible de mettre a jour le profil.",
      healthSummary: "Resume de sante recent",
      conditions: "Conditions detectees",
      noConditions: "Aucune condition actuelle listee.",
    },
    healthScore: {
      title: "Score de sante",
      noData: "Pas encore de donnees",
      good: "Bon",
      fair: "Passable",
      needsAttention: "Necessite une attention",
      excellent: "Excellent",
      basedOn: "Fonde sur vos derniers",
      checkups: "examens",
    },
    emergency: {
      title: "Contacts d'urgence",
      services: "Services d'urgence",
      servicesDesc: "Police, Pompiers, Urgences medicales",
      poison: "Centre antipoison",
      poisonDesc: "Ligne d'aide 24h/24",
      crisis: "Ligne de crise",
      crisisDesc: "Soutien en crise de sante mentale",
      warning: "Si c'est une urgence medicale, appelez le 112 immediatement. N'attendez pas une reponse de l'IA.",
    },
    footer: {
      disclaimer: "Avertissement medical: Cette IA est uniquement informative et ne remplace pas un avis medical professionnel. En cas d'urgence, appelez les services d'urgence immediatement.",
    },
  },
};

export { translations };
