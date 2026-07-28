export type Locale = "en" | "es" | "fr";

export type TranslationKey = {
  nav: {
    history: string;
    tools: string;
    signIn: string;
    signOut: string;
    signInUnavailable: string;
    notifications: string;
    profile: string;
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
    validationAgeEmpty: string;
    validationAgeInvalid: string;
    profileSaved: string;
    profileSavedDesc: string;
    chatWelcome: string;
    chatWelcomeTools: string;
    error: string;
  };
  results: {
    title: string;
    subtitle: string;
    potentialCause: string;
    nextSteps: string;
    chatWithLaVida: string;
    startNewCheck: string;
    exportPdf: string;
    urgencyCritical: string;
    urgencyHigh: string;
    urgencyMedium: string;
    urgencyLow: string;
  };
  history: {
    title: string;
    signInPrompt: string;
    signInDesc: string;
    empty: string;
    loadFailed: string;
  };
  tools: {
    title: string;
    assistant: string;
    assistantDesc: string;
    reminders: string;
    remindersDesc: string;
    notifications: string;
    notificationsDesc: string;
    historyDesc: string;
    medications: string;
    medicationsDesc: string;
    healthReport: string;
    healthReportDesc: string;
    noDataToExport: string;
    noDataToExportDesc: string;
    addReminder: string;
    reminderPlaceholder: string;
    noReminders: string;
    back: string;
    close: string;
    activeCount: string;
  };
  chat: {
    title: string;
    subtitle: string;
    online: string;
    placeholder: string;
    close: string;
    error: string;
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
    back: string;
    careContinuity: string;
    careContinuityDesc: string;
    noRecentCheck: string;
    notAvailableYet: string;
    profileUpdated: string;
    profileUpdatedDesc: string;
    profileSaveError: string;
    profileSaveErrorDesc: string;
    profileSavedStatus: string;
    profileSaveFailStatus: string;
  };
  dashboardStats: {
    profile: string;
    history: string;
    lastCheck: string;
    tools: string;
    toolsDesc: string;
    noEmail: string;
    genderNotSet: string;
    ageNotSet: string;
    savedCheckups: string;
    years: string;
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
  healthOverview: {
    symptomHistory: string;
    latestAnalysis: string;
    detectedConditions: string;
    history: string;
    totalCheckups: string;
    noCheckupHistory: string;
  };
  quickActions: {
    title: string;
    newCheckup: string;
    newCheckupDesc: string;
    medicationTracker: string;
    medicationTrackerDesc: string;
    emergencyContacts: string;
    emergencyContactsDesc: string;
  };
  healthTips: {
    title: string;
    heartHealth: string;
    heartHealthTip: string;
    stayHydrated: string;
    stayHydratedTip: string;
    sleepWell: string;
    sleepWellTip: string;
    nutrition: string;
    nutritionTip: string;
    stayActive: string;
    stayActiveTip: string;
    preventiveCare: string;
    preventiveCareTip: string;
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
    servicesNumber: string;
    poisonNumber: string;
    crisisNumber: string;
  };
  error: {
    title: string;
    tryAgain: string;
  };
  medications: {
    title: string;
    add: string;
    active: string;
    inactive: string;
    noActive: string;
    noInactive: string;
    form: {
      addMedication: string;
      name: string;
      namePlaceholder: string;
      dosage: string;
      dosagePlaceholder: string;
      frequency: string;
      timeHint: string;
      timePlaceholder: string;
      notes: string;
      notesPlaceholder: string;
      startDate: string;
    };
    list: {
      onceDaily: string;
      twiceDaily: string;
      threeTimesDaily: string;
      weekly: string;
      asNeeded: string;
      started: string;
    };
  };
  notifications: {
    title: string;
    empty: string;
    readAll: string;
    clearAll: string;
    justNow: string;
  };
  confirm: {
    deleteTitle: string;
    deleteDescription: string;
    confirm: string;
    cancel: string;
  };
  theme: {
    toggle: string;
    light: string;
    dark: string;
    system: string;
  };
  language: {
    change: string;
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
      signInUnavailable: "Sign In Unavailable",
      notifications: "Notifications",
      profile: "Go to dashboard",
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
      validationAgeEmpty: "Please provide both age and a description of your symptoms.",
      validationAgeInvalid: "Please enter a valid age between 1 and 99.",
      profileSaved: "Profile saved",
      profileSavedDesc: "Your gender and age have been saved for future checkups.",
      chatWelcome: "Hi! I'm LaVida, your health buddy. I've analyzed your symptoms. Which of these conditions would you like to explore further, or do you have other questions about how you're feeling?",
      chatWelcomeTools: "Hi! I'm LaVida, your health buddy. I can help you with symptom follow-ups, health guidance, and wellness recommendations.",
      error: "Oops! Something went wrong. Please try again.",
    },
    results: {
      title: "AI Analysis",
      subtitle: "Urgency Assessment",
      potentialCause: "Potential Cause",
      nextSteps: "Recommended Next Steps",
      chatWithLaVida: "Chat with LaVida",
      startNewCheck: "Start New Check",
      exportPdf: "Export Health Report (PDF)",
      urgencyCritical: "Critical / Emergency",
      urgencyHigh: "High Urgency",
      urgencyMedium: "Moderate Urgency",
      urgencyLow: "Low Urgency",
    },
    history: {
      title: "History",
      signInPrompt: "Sign in to view history",
      signInDesc: "Create an account or sign in to save and access your symptom checkup history.",
      empty: "Your check-up history will appear here after your first symptom analysis.",
      loadFailed: "Failed to load history",
    },
    tools: {
      title: "Wellness Tools",
      assistant: "Wellness Assistant",
      assistantDesc: "Chat with LaVida for personalized health guidance, symptom follow-ups, and wellness recommendations.",
      reminders: "Reminders",
      remindersDesc: "Set health reminders and alerts",
      notifications: "Notifications",
      notificationsDesc: "View alerts and reminders",
      historyDesc: "View past symptom checkups",
      medications: "Medications",
      medicationsDesc: "Track your medications and dosages",
      healthReport: "Health Report",
      healthReportDesc: "Export your health summary as PDF",
      noDataToExport: "No checkup data",
      noDataToExportDesc: "Complete a symptom check first to export your health report.",
      addReminder: "Add",
      reminderPlaceholder: "Reminder title...",
      noReminders: "No reminders yet. Add one above.",
      back: "Back",
      close: "Close",
      activeCount: "{count} active",
    },
    chat: {
      title: "LaVida Buddy",
      subtitle: "Health Assistant",
      online: "Online",
      placeholder: "Ask a follow-up question...",
      close: "Close",
      error: "Sorry, I couldn't process that. Please try again.",
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
      back: "Back",
      careContinuity: "Care continuity",
      careContinuityDesc: "Your previous checkups remain available in one place for quick follow-up.",
      noRecentCheck: "No recent symptom check yet",
      notAvailableYet: "Not available yet",
      profileUpdated: "Profile updated",
      profileUpdatedDesc: "Your gender and age have been saved successfully.",
      profileSaveError: "Error",
      profileSaveErrorDesc: "Failed to save profile. Please try again.",
      profileSavedStatus: "Profile saved successfully",
      profileSaveFailStatus: "Failed to save profile. Please try again.",
    },
    dashboardStats: {
      profile: "Profile",
      history: "History",
      lastCheck: "Last check",
      tools: "Tools",
      toolsDesc: "Personalized recommendations, reminders, and follow-up support are ready for your next step.",
      noEmail: "No email on file",
      genderNotSet: "Gender not set",
      ageNotSet: "Age not set",
      savedCheckups: "Saved symptom checkups",
      years: "years",
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
    healthOverview: {
      symptomHistory: "Symptom history",
      latestAnalysis: "Latest Analysis",
      detectedConditions: "Detected Conditions",
      history: "History",
      totalCheckups: "total checkups recorded",
      noCheckupHistory: "No check-up history yet. Run your first symptom analysis from the main page.",
    },
    quickActions: {
      title: "Quick Actions",
      newCheckup: "New Symptom Check",
      newCheckupDesc: "Analyze new symptoms with AI",
      medicationTracker: "Medication Tracker",
      medicationTrackerDesc: "Track your medications",
      emergencyContacts: "Emergency Contacts",
      emergencyContactsDesc: "Quick access to help",
    },
    healthTips: {
      title: "Health Tips",
      heartHealth: "Heart Health",
      heartHealthTip: "Regular exercise and a balanced diet can reduce heart disease risk by up to 80%.",
      stayHydrated: "Stay Hydrated",
      stayHydratedTip: "Drink at least 8 glasses of water daily for optimal body function.",
      sleepWell: "Sleep Well",
      sleepWellTip: "Adults need 7-9 hours of quality sleep for immune system support.",
      nutrition: "Nutrition",
      nutritionTip: "Eat 5 servings of fruits and vegetables daily for essential vitamins.",
      stayActive: "Stay Active",
      stayActiveTip: "150 minutes of moderate exercise weekly improves mental and physical health.",
      preventiveCare: "Preventive Care",
      preventiveCareTip: "Annual check-ups can catch health issues early when they're most treatable.",
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
      servicesNumber: "911",
      poisonNumber: "1-800-222-1222",
      crisisNumber: "988",
    },
    error: {
      title: "Something went wrong",
      tryAgain: "Try Again",
    },
    medications: {
      title: "Medications",
      add: "Add",
      active: "Active",
      inactive: "Inactive",
      noActive: "No active medications. Add one to start tracking.",
      noInactive: "No inactive medications.",
      form: {
        addMedication: "Add Medication",
        name: "Name *",
        namePlaceholder: "Ibuprofen",
        dosage: "Dosage *",
        dosagePlaceholder: "200mg",
        frequency: "Frequency",
        timeHint: "Time(s) (comma separated)",
        timePlaceholder: "08:00, 20:00",
        notes: "Notes",
        notesPlaceholder: "Take with food",
        startDate: "Start Date",
      },
      list: {
        onceDaily: "Once daily",
        twiceDaily: "Twice daily",
        threeTimesDaily: "3x daily",
        weekly: "Weekly",
        asNeeded: "As needed",
        started: "Started",
      },
    },
    notifications: {
      title: "Notifications",
      empty: "No notifications yet",
      readAll: "Read all",
      clearAll: "Clear all notifications",
      justNow: "Just now",
    },
    confirm: {
      deleteTitle: "Are you sure?",
      deleteDescription: "This action cannot be undone.",
      confirm: "Delete",
      cancel: "Cancel",
    },
    theme: {
      toggle: "Toggle theme",
      light: "Light",
      dark: "Dark",
      system: "System",
    },
    language: {
      change: "Change language",
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
      signInUnavailable: "Inicio de sesion no disponible",
      notifications: "Notificaciones",
      profile: "Ir al panel",
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
      validationAgeEmpty: "Por favor proporciona tu edad y una descripcion de tus sintomas.",
      validationAgeInvalid: "Por favor ingresa una edad valida entre 1 y 99.",
      profileSaved: "Perfil guardado",
      profileSavedDesc: "Tu genero y edad han sido guardados para futuros chequeos.",
      chatWelcome: "Hola! Soy LaVida, tu companero de salud. He analizado tus sintomas. Cual de estas condiciones te gustaria explorar mas, o tienes otras preguntas sobre como te sientes?",
      chatWelcomeTools: "Hola! Soy LaVida, tu companero de salud. Puedo ayudarte con seguimiento de sintomas, orientacion de salud y recomendaciones de bienestar.",
      error: "Ups! Algo salio mal. Por favor intentalo de nuevo.",
    },
    results: {
      title: "Analisis IA",
      subtitle: "Evaluacion de urgencia",
      potentialCause: "Causa potencial",
      nextSteps: "Pasos recomendados",
      chatWithLaVida: "Chatear con LaVida",
      startNewCheck: "Iniciar nuevo analisis",
      exportPdf: "Exportar informe de salud (PDF)",
      urgencyCritical: "Critico / Emergencia",
      urgencyHigh: "Alta urgencia",
      urgencyMedium: "Urgencia moderada",
      urgencyLow: "Baja urgencia",
    },
    history: {
      title: "Historial",
      signInPrompt: "Inicia sesion para ver el historial",
      signInDesc: "Crea una cuenta o inicia sesion para guardar y acceder a tu historial de chequeos.",
      empty: "Tu historial de chequeos aparecera aqui despues de tu primer analisis de sintomas.",
      loadFailed: "Error al cargar el historial",
    },
    tools: {
      title: "Herramientas de bienestar",
      assistant: "Asistente de bienestar",
      assistantDesc: "Chatea con LaVida para obtener orientacion personalizada sobre salud y recomendaciones de bienestar.",
      reminders: "Recordatorios",
      remindersDesc: "Establecer recordatorios y alertas de salud",
      notifications: "Notificaciones",
      notificationsDesc: "Ver alertas y recordatorios",
      historyDesc: "Ver chequeos de sintomas anteriores",
      medications: "Medicamentos",
      medicationsDesc: "Seguimiento de tus medicamentos y dosificaciones",
      healthReport: "Informe de salud",
      healthReportDesc: "Exportar tu resumen de salud como PDF",
      noDataToExport: "Sin datos de chequeos",
      noDataToExportDesc: "Primero realiza un chequeo de sintomas para poder exportar tu informe de salud.",
      addReminder: "Agregar",
      reminderPlaceholder: "Titulo del recordatorio...",
      noReminders: "No hay recordatorios aun. Agrega uno arriba.",
      back: "Volver",
      close: "Cerrar",
      activeCount: "{count} activo(s)",
    },
    chat: {
      title: "Companero LaVida",
      subtitle: "Asistente de salud",
      online: "En linea",
      placeholder: "Haz una pregunta de seguimiento...",
      close: "Cerrar",
      error: "Lo siento, no pude procesar eso. Por favor intentalo de nuevo.",
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
      back: "Volver",
      careContinuity: "Continuidad de cuidado",
      careContinuityDesc: "Tus chequeos anteriores permanecen disponibles en un solo lugar para un seguimiento rapido.",
      noRecentCheck: "No hay chequeo de sintomas reciente",
      notAvailableYet: "No disponible aun",
      profileUpdated: "Perfil actualizado",
      profileUpdatedDesc: "Tu genero y edad han sido guardados exitosamente.",
      profileSaveError: "Error",
      profileSaveErrorDesc: "Error al guardar el perfil. Por favor intenta de nuevo.",
      profileSavedStatus: "Perfil guardado exitosamente",
      profileSaveFailStatus: "Error al guardar el perfil. Por favor intenta de nuevo.",
    },
    dashboardStats: {
      profile: "Perfil",
      history: "Historial",
      lastCheck: "Ultimo chequeo",
      tools: "Herramientas",
      toolsDesc: "Recomendaciones personalizadas, recordatorios y seguimiento listos para tu proximo paso.",
      noEmail: "Sin correo electronico",
      genderNotSet: "Genero no configurado",
      ageNotSet: "Edad no configurada",
      savedCheckups: "Chequeos de sintomas guardados",
      years: "anos",
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
    healthOverview: {
      symptomHistory: "Historial de sintomas",
      latestAnalysis: "Ultimo analisis",
      detectedConditions: "Condiciones detectadas",
      history: "Historial",
      totalCheckups: "chequeos totales registrados",
      noCheckupHistory: "No hay historial de chequeos aun. Realiza tu primer analisis de sintomas desde la pagina principal.",
    },
    quickActions: {
      title: "Acciones rapidas",
      newCheckup: "Nuevo chequeo de sintomas",
      newCheckupDesc: "Analizar nuevos sintomas con IA",
      medicationTracker: "Seguimiento de medicamentos",
      medicationTrackerDesc: "Seguimiento de tus medicamentos",
      emergencyContacts: "Contactos de emergencia",
      emergencyContactsDesc: "Acceso rapido a ayuda",
    },
    healthTips: {
      title: "Consejos de salud",
      heartHealth: "Salud del corazon",
      heartHealthTip: "El ejercicio regular y una dieta equilibrada pueden reducir el riesgo de enfermedades cardiacas hasta en un 80%.",
      stayHydrated: "Mantente hidratado",
      stayHydratedTip: "Bebe al menos 8 vasos de agua al dia para un funcionamiento optimo del cuerpo.",
      sleepWell: "Duerme bien",
      sleepWellTip: "Los adultos necesitan 7-9 horas de sueno de calidad para el sistema inmunologico.",
      nutrition: "Nutricion",
      nutritionTip: "Consume 5 porciones de frutas y verduras al dia para vitaminas esenciales.",
      stayActive: "Mantente activo",
      stayActiveTip: "150 minutos de ejercicio moderado a la semana mejoran la salud mental y fisica.",
      preventiveCare: "Cuidado preventivo",
      preventiveCareTip: "Los chequeos anuales pueden detectar problemas de salud temprano cuando son mas tratables.",
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
      servicesNumber: "911",
      poisonNumber: "01 45 42 59 59",
      crisisNumber: "024",
    },
    error: {
      title: "Algo salio mal",
      tryAgain: "Intentar de nuevo",
    },
    medications: {
      title: "Medicamentos",
      add: "Agregar",
      active: "Activos",
      inactive: "Inactivos",
      noActive: "No hay medicamentos activos. Agrega uno para comenzar el seguimiento.",
      noInactive: "No hay medicamentos inactivos.",
      form: {
        addMedication: "Agregar medicamento",
        name: "Nombre *",
        namePlaceholder: "Ibuprofeno",
        dosage: "Dosis *",
        dosagePlaceholder: "200mg",
        frequency: "Frecuencia",
        timeHint: "Hora(s) (separadas por coma)",
        timePlaceholder: "08:00, 20:00",
        notes: "Notas",
        notesPlaceholder: "Tomar con comida",
        startDate: "Fecha de inicio",
      },
      list: {
        onceDaily: "Una vez al dia",
        twiceDaily: "Dos veces al dia",
        threeTimesDaily: "3 veces al dia",
        weekly: "Semanal",
        asNeeded: "Segun necesidad",
        started: "Iniciado",
      },
    },
    notifications: {
      title: "Notificaciones",
      empty: "No hay notificaciones aun",
      readAll: "Marcar todas como leidas",
      clearAll: "Limpiar todas las notificaciones",
      justNow: "Ahora mismo",
    },
    confirm: {
      deleteTitle: "Estas seguro?",
      deleteDescription: "Esta accion no se puede deshacer.",
      confirm: "Eliminar",
      cancel: "Cancelar",
    },
    theme: {
      toggle: "Cambiar tema",
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema",
    },
    language: {
      change: "Cambiar idioma",
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
      signInUnavailable: "Connexion indisponible",
      notifications: "Notifications",
      profile: "Aller au tableau de bord",
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
      validationAgeEmpty: "Veuillez fournir votre age et une description de vos symptomes.",
      validationAgeInvalid: "Veuillez entrer un age valide entre 1 et 99.",
      profileSaved: "Profil sauvegarde",
      profileSavedDesc: "Votre genre et age ont ete sauvegardes pour les futurs examens.",
      chatWelcome: "Bonjour! Je suis LaVida, votre assistant sante. J'ai analyse vos symptomes. Quelle condition souhaitez-vous explorer davantage, ou avez-vous d'autres questions sur votre etat?",
      chatWelcomeTools: "Bonjour! Je suis LaVida, votre assistant sante. Je peux vous aider avec le suivi des symptomes, les conseils de sante et les recommandations de bien-etre.",
      error: "Desole, je n'ai pas pu traiter cela. Veuillez reessayer.",
    },
    results: {
      title: "Analyse IA",
      subtitle: "Evaluation de l'urgence",
      potentialCause: "Cause potentielle",
      nextSteps: "Prochaines etapes recommandees",
      chatWithLaVida: "Discuter avec LaVida",
      startNewCheck: "Commencer un nouvel examen",
      exportPdf: "Exporter le rapport de sante (PDF)",
      urgencyCritical: "Critique / Urgence",
      urgencyHigh: "Urgence elevee",
      urgencyMedium: "Urgence moderee",
      urgencyLow: "Faible urgence",
    },
    history: {
      title: "Historique",
      signInPrompt: "Connectez-vous pour voir l'historique",
      signInDesc: "Creez un compte ou connectez-vous pour sauvegarder et acceder a votre historique.",
      empty: "Votre historique d'examens apparaitra ici apres votre premiere analyse de symptomes.",
      loadFailed: "Echec du chargement de l'historique",
    },
    tools: {
      title: "Outils de bien-etre",
      assistant: "Assistant de bien-etre",
      assistantDesc: "Discutez avec LaVida pour des conseils de sante personnalises et des recommandations de bien-etre.",
      reminders: "Rappels",
      remindersDesc: "Definir des rappels et alertes de sante",
      notifications: "Notifications",
      notificationsDesc: "Voir les alertes et rappels",
      historyDesc: "Voir les examens de symptomes passes",
      medications: "Medicaments",
      medicationsDesc: "Suivre vos medicaments et dosages",
      healthReport: "Rapport de sante",
      healthReportDesc: "Exporter votre resume de sante en PDF",
      noDataToExport: "Aucune donnee d'examen",
      noDataToExportDesc: "Effectuez d'abord un examen de symptomes pour pouvoir exporter votre rapport de sante.",
      addReminder: "Ajouter",
      reminderPlaceholder: "Titre du rappel...",
      noReminders: "Pas encore de rappels. Ajoutez-en un ci-dessus.",
      back: "Retour",
      close: "Fermer",
      activeCount: "{count} actif(s)",
    },
    chat: {
      title: "Assistant LaVida",
      subtitle: "Assistant de sante",
      online: "En ligne",
      placeholder: "Posez une question de suivi...",
      close: "Fermer",
      error: "Desole, je n'ai pas pu traiter cela. Veuillez reessayer.",
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
      back: "Retour",
      careContinuity: "Continuite des soins",
      careContinuityDesc: "Vos examens precedents restent disponibles en un seul endroit pour un suivi rapide.",
      noRecentCheck: "Aucun examen de symptomes recent",
      notAvailableYet: "Pas encore disponible",
      profileUpdated: "Profil mis a jour",
      profileUpdatedDesc: "Votre genre et age ont ete sauvegardes avec succes.",
      profileSaveError: "Erreur",
      profileSaveErrorDesc: "Echec de la sauvegarde du profil. Veuillez reessayer.",
      profileSavedStatus: "Profil sauvegarde avec succes",
      profileSaveFailStatus: "Echec de la sauvegarde du profil. Veuillez reessayer.",
    },
    dashboardStats: {
      profile: "Profil",
      history: "Historique",
      lastCheck: "Dernier examen",
      tools: "Outils",
      toolsDesc: "Recommandations personnalisees, rappels et suivi prets pour votre prochaine etape.",
      noEmail: "Aucun e-mail enregistre",
      genderNotSet: "Genre non defini",
      ageNotSet: "Age non defini",
      savedCheckups: "Examens de symptomes sauvegardes",
      years: "ans",
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
    healthOverview: {
      symptomHistory: "Historique des symptomes",
      latestAnalysis: "Derniere analyse",
      detectedConditions: "Conditions detectees",
      history: "Historique",
      totalCheckups: "examens totaux enregistres",
      noCheckupHistory: "Pas encore d'historique d'examens. Effectuez votre premiere analyse de symptomes depuis la page principale.",
    },
    quickActions: {
      title: "Actions rapides",
      newCheckup: "Nouvel examen de symptomes",
      newCheckupDesc: "Analyser de nouveaux symptomes avec l'IA",
      medicationTracker: "Suivi des medicaments",
      medicationTrackerDesc: "Suivre vos medicaments",
      emergencyContacts: "Contacts d'urgence",
      emergencyContactsDesc: "Acces rapide a l'aide",
    },
    healthTips: {
      title: "Conseils de sante",
      heartHealth: "Sante cardiaque",
      heartHealthTip: "L'exercice regulier et une alimentation equilibree peuvent reduire le risque de maladie cardiaque de jusqu'a 80%.",
      stayHydrated: "Restez hydrate",
      stayHydratedTip: "Boivez au moins 8 verres d'eau par jour pour un fonctionnement optimal du corps.",
      sleepWell: "Dormez bien",
      sleepWellTip: "Les adultes ont besoin de 7-9 heures de sommeil de qualite pour le systeme immunitaire.",
      nutrition: "Nutrition",
      nutritionTip: "Mangez 5 portions de fruits et legumes par jour pour des vitamines essentielles.",
      stayActive: "Restez actif",
      stayActiveTip: "150 minutes d'exercice modere par semaine ameliorent la sante mentale et physique.",
      preventiveCare: "Soins preventifs",
      preventiveCareTip: "Les examens annuels peuvent detecter les problemes de sante tot lorsqu'ils sont les plus traitables.",
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
      servicesNumber: "112",
      poisonNumber: "15 (SAMU)",
      crisisNumber: "3114",
    },
    error: {
      title: "Une erreur s'est produite",
      tryAgain: "Reessayer",
    },
    medications: {
      title: "Medicaments",
      add: "Ajouter",
      active: "Actifs",
      inactive: "Inactifs",
      noActive: "Aucun medicament actif. Ajoutez-en un pour commencer le suivi.",
      noInactive: "Aucun medicament inactif.",
      form: {
        addMedication: "Ajouter un medicament",
        name: "Nom *",
        namePlaceholder: "Ibuprofene",
        dosage: "Dosage *",
        dosagePlaceholder: "200mg",
        frequency: "Frequence",
        timeHint: "Heure(s) (separes par une virgule)",
        timePlaceholder: "08:00, 20:00",
        notes: "Notes",
        notesPlaceholder: "Prendre avec de la nourriture",
        startDate: "Date de debut",
      },
      list: {
        onceDaily: "Une fois par jour",
        twiceDaily: "Deux fois par jour",
        threeTimesDaily: "3x par jour",
        weekly: "Hebdomadaire",
        asNeeded: "Au besoin",
        started: "Debute le",
      },
    },
    notifications: {
      title: "Notifications",
      empty: "Pas encore de notifications",
      readAll: "Tout marquer comme lu",
      clearAll: "Effacer toutes les notifications",
      justNow: "A l'instant",
    },
    confirm: {
      deleteTitle: "Etes-vous sur?",
      deleteDescription: "Cette action est irreversible.",
      confirm: "Supprimer",
      cancel: "Annuler",
    },
    theme: {
      toggle: "Changer le theme",
      light: "Clair",
      dark: "Sombre",
      system: "Systeme",
    },
    language: {
      change: "Changer la langue",
    },
    footer: {
      disclaimer: "Avertissement medical: Cette IA est uniquement informative et ne remplace pas un avis medical professionnel. En cas d'urgence, appelez les services d'urgence immediatement.",
    },
  },
};

export { translations };
