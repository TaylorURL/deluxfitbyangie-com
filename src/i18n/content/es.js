/*
 * Equivalente en espanol del arbol en `./en.js`. Los precios y los nombres de
 * los servicios son la copia del negocio, no formato que se pueda ajustar:
 *
 *   1. Membresia Delux Fit               - $14.99 / mes, general (no personalizado)
 *   2. Coaching Online Personalizado     - $150 / mes
 *   3. Sesion de Entrenamiento en Vivo   - $75, una sesion de prueba de 45-60 min
 *   4. Programa de Entrenamiento en Vivo - $50 / sesion, continuo, por Zoom
 *
 * Los servicios 3 y 4 son productos distintos y no se unifican a proposito: el
 * 3 es la prueba unica, el 4 el programa continuo. Cada clave de `./en.js` debe
 * existir aqui o el sitio en espanol muestra huecos.
 */

import {
  Dumbbell,
  Apple,
  CalendarCheck,
  ClipboardCheck,
  LineChart,
  PlayCircle,
  Video,
  Sparkles,
  ShieldCheck,
  Users,
  Library,
  HandHeart,
  GraduationCap,
  HeartPulse,
  MessageSquare,
  Repeat,
  Zap,
  Target,
} from 'lucide-react'

const services = {
  membership: {
    id: 'membership',
    slug: 'membership',
    href: '/membership',
    eyebrow: 'Membresía',
    name: 'Membresía Delux Fit',
    tagline: 'Contenido general de fitness para todos, a tu ritmo.',
    price: '$14.99',
    period: '/ mes',
    summary:
      'Membresía de nivel inicial con acceso a contenido general (no personalizado) de fitness y recursos educativos pensados para el público.',
    notPersonalizedNote: 'Este contenido es general y NO está personalizado.',
    bestFor:
      'Ideal para personas que quieren acceso económico a programas de entrenamiento y educación fitness, sin coaching personalizado.',
    includes: [
      'Programas de entrenamiento',
      'Biblioteca de ejercicios',
      'Videos de entrenamiento',
      'Educación fitness',
      'Guía general de nutrición',
      'Programas de pérdida de grasa',
      'Programas de ganancia muscular',
      'Rutinas de core y abdomen',
      'Contenido nuevo añadido regularmente',
    ],
    ctaLabel: 'Suscribirme',
    ctaHref: '/membership#sign-up',
    cardCta: 'Suscribirme',
  },
  coaching: {
    id: 'coaching',
    slug: 'online-coaching',
    href: '/online-coaching',
    eyebrow: 'Coaching Online',
    name: 'Coaching Online Personalizado',
    tagline: 'Un programa hecho para tus metas y tu nivel.',
    price: '$150',
    period: '/ mes',
    summary:
      'Coaching personalizado construido alrededor de tus metas y tu nivel, con mensajería directa a Angie dentro de la plataforma.',
    bestFor:
      'Ideal para clientes que quieren un programa estructurado y personalizado y guía profesional sin sesiones en vivo.',
    includes: [
      'Consulta inicial',
      'Plan de entrenamiento personalizado',
      'Calendario de entrenamiento personalizado',
      'Revisión de progreso mensual',
      'Check-in mensual',
      'Seguimiento de progreso',
      'Mensajería directa dentro de la plataforma',
      'Guía básica de nutrición',
      'Recomendaciones personalizadas',
    ],
    communicationNote:
      'Toda la comunicación ocurre dentro de la plataforma Delux Fit, no hay acceso telefónico personal. El tiempo de respuesta es de hasta 72 horas hábiles.',
    responseTime: 'Tiempo de respuesta: hasta 72 horas hábiles',
    ctaLabel: 'Aplicar Ahora',
    ctaHref: '/online-coaching#apply',
    badgeLabel: 'Más Personalizado',
    cardCta: 'Aplicar Ahora',
  },
  singleSession: {
    id: 'single-session',
    slug: 'single-session',
    href: '/single-session',
    eyebrow: 'Sesión Única',
    name: 'Sesión de Entrenamiento en Vivo',
    tagline: 'Una sesión privada en vivo, una sola vez, con Angie.',
    price: '$75',
    period: '/ sesión',
    sessionLength: '45-60 minutos',
    summary:
      'Una sesión privada virtual en vivo, una sola vez, con Angie, perfecta para probar Delux Fit antes de comprometerte.',
    perfectFor: [
      'Probar Delux Fit antes de comprometerte',
      'Aprender la técnica correcta',
      'Corrección de técnica',
      'Motivación',
      'Preguntas y respuestas',
      'Una experiencia de entrenamiento personalizada',
    ],
    ctaLabel: 'Reservar Sesión',
    ctaHref: '/single-session#book',
    cardCta: 'Reservar Sesión',
  },
  liveProgram: {
    id: 'live-program',
    slug: 'training',
    href: '/training',
    eyebrow: 'Entrenamiento en Vivo',
    name: 'Programa de Entrenamiento Personal en Vivo',
    tagline: 'Entrenamiento en vivo continuo, lo más cercano a lo presencial.',
    price: '$50',
    period: '/ sesión',
    summary:
      'Entrenamiento personal en vivo y continuo por Zoom con Angie presente durante toda la sesión, la experiencia más cercana al entrenamiento presencial.',
    recommendation: 'Recomendado un mínimo de 3 sesiones por semana.',
    recommendationExample: 'Ejemplo: 3 sesiones/semana = $150/semana.',
    includes: [
      'Coaching en vivo',
      'Correcciones en tiempo real',
      'Acompañamiento',
      'Guía de ejercicios',
      'Estructura de entrenamiento personalizada',
    ],
    ctaLabel: 'Empezar',
    ctaHref: '/training#book',
    cardCta: 'Reservar Sesiones',
  },
}

const es = {
  meta: {
    title: 'DeluxFit by Angie: Coaching Online, Membresías y Entrenamiento en Vivo',
    description:
      'DeluxFit by Angie ofrece una membresía de fitness por $14.99/mes, coaching online personalizado por $150/mes, sesiones de entrenamiento en vivo por $75 y un programa de entrenamiento personal en vivo por $50/sesión con la entrenadora personal certificada Angie.',
  },

  /*
   * Copia de cabecera por ruta. Cada ruta nombra su propio titulo y descripcion
   * para que ningun resultado se lea igual que otro; el router recurre a `meta`
   * para lo que no este listado. Los titulos van de 30 a 60 caracteres y las
   * descripciones de 120 a 160, que es lo que un resultado muestra antes de
   * cortar.
   */
  routes: {
    '/': {
      title: 'DeluxFit by Angie: Coaching de Fitness Online',
      description:
        'Membresías, coaching online personalizado y entrenamiento en vivo uno a uno con la entrenadora personal certificada Angie. Disciplina sobre excusas.',
      breadcrumb: 'Inicio',
    },
    '/about': {
      title: 'Sobre Angie: Entrenadora Personal Certificada',
      description:
        'Conoce a Angie: entrenadora personal certificada que construye cada programa alrededor de la persona. Su historia, sus credenciales y su método.',
      breadcrumb: 'Sobre Angie',
    },
    '/membership': {
      title: 'Membresía Delux Fit: $14.99 al Mes',
      description:
        'Programas de entrenamiento, biblioteca de ejercicios, videos y educación fitness por $14.99 al mes. Contenido general, sin coaching personalizado.',
      breadcrumb: 'Membresía',
    },
    '/online-coaching': {
      title: 'Coaching Online Personalizado: $150 al Mes',
      description:
        'Un plan de entrenamiento, un calendario y revisiones mensuales de progreso hechos para tus metas, con mensajería directa a Angie, por $150 al mes.',
      breadcrumb: 'Coaching Online',
    },
    '/single-session': {
      title: 'Sesión de Entrenamiento en Vivo: $75',
      description:
        'Una sesión privada en vivo de 45 a 60 minutos con Angie por video. Aprende la técnica, corrige tu forma y prueba Delux Fit antes de comprometerte.',
      breadcrumb: 'Sesión Única',
    },
    '/training': {
      title: 'Entrenamiento Personal en Vivo: $50 por Sesión',
      description:
        'Entrenamiento personal en vivo y continuo por Zoom con Angie guiando cada repetición, a $50 por sesión. Lo más cercano a entrenar en persona.',
      breadcrumb: 'Entrenamiento en Vivo',
    },
    '/testimonials': {
      title: 'Historias y Transformaciones de Clientes',
      description:
        'Historias de éxito, reseñas y fotos de antes y después de quienes terminaron un programa DeluxFit, en sus propias palabras y con su permiso.',
      breadcrumb: 'Testimonios',
    },
    '/contact': {
      title: 'Contactar a Angie',
      description:
        '¿Preguntas sobre la membresía, el coaching online o el entrenamiento en vivo? Envía un mensaje y Angie te responderá por correo personalmente.',
      breadcrumb: 'Contacto',
    },
    '/privacy': {
      title: 'Política de Privacidad',
      description:
        'Qué recoge DeluxFit by Angie, para qué se usa, quién más lo guarda, cuánto tiempo se conserva y cómo pedir que se borre.',
      breadcrumb: 'Privacidad',
    },
    '/terms': {
      title: 'Términos del Servicio',
      description:
        'Facturación, cancelación, cambios de fecha, reembolsos y términos de salud de la membresía, el coaching y las sesiones en vivo.',
      breadcrumb: 'Términos',
    },
    notFound: {
      title: 'Página No Encontrada',
      description:
        'Esta página no existe. Vuelve a los programas para encontrar la membresía, el coaching online personalizado o el entrenamiento en vivo con Angie.',
      breadcrumb: 'No Encontrada',
    },
  },

  brand: {
    name: 'DELUXFIT',
    fullName: 'DeluxFit by Angie',
    slogan: 'DISCIPLINA SOBRE EXCUSAS',
    tagline: 'Disciplina. Acompañamiento. Educación. Coaching personalizado.',
    mission:
      'Delux Fit ayuda a sus clientes a alcanzar sus metas de fitness a través de disciplina, acompañamiento, educación y coaching personalizado.',
  },

  nav: [
    { label: 'Inicio', href: '/' },
    { label: 'Sobre Angie', href: '/about' },
    { label: 'Membresía', href: '/membership' },
    { label: 'Coaching Online', href: '/online-coaching' },
    { label: 'Entrenamiento en Vivo', href: '/training' },
    { label: 'Testimonios', href: '/testimonials' },
    { label: 'Contacto', href: '/contact' },
  ],

  header: {
    programs: 'Programas',
    programsPanelLabel: 'Los Programas',
    menu: 'Menú',
    primaryCta: 'Aplicar Ahora',
    primaryCtaHref: '/online-coaching#apply',
    clientLogin: 'Acceso Clientes',
    clientLoginAria: 'Portal de Acceso para Clientes',
    admin: 'Admin',
    adminAria: 'Abrir el panel de administración',
    openMenu: 'Abrir Menú',
    closeMenu: 'Cerrar Menú',
    primaryNavLabel: 'Principal',
    mobileNavLabel: 'Móvil',
    mobileDialogLabel: 'Navegación Móvil',
  },

  a11y: {
    skipToContent: 'Saltar al Contenido',
  },

  language: {
    label: 'Idioma',
    english: 'Inglés',
    spanish: 'Español',
    switchToEnglish: 'Cambiar a inglés',
    switchToSpanish: 'Cambiar a español',
  },

  forms: {
    required: 'Requerido',
    invalidEmail: 'Escribe un correo válido',
    pickOne: 'Elige una opción',
    optional: 'Opcional',
    confirm: 'Confirma para continuar',
  },

  notFound: {
    eyebrow: '404',
    heading: 'Página no encontrada.',
    accent: 'no encontrada',
    body: 'La página que buscas no existe. Vuelve al inicio y usa la navegación desde ahí.',
    cta: 'Volver al Inicio',
  },

  gallery: {
    heading: 'Repeticiones reales. Garra real.',
    accent: 'Garra real',
    subhead:
      'Retratos de estudio y sesiones de gimnasio del rodaje de DeluxFit, la misma energía que Angie lleva a cada programa.',
  },

  auth: {
    emailLabel: 'Correo',
    emailPlaceholder: 'tu@ejemplo.com',
    passwordLabel: 'Contraseña',
    passwordHelper: 'Mínimo 8 caracteres',
    nameLabel: 'Nombre Completo',
    namePlaceholder: 'Nombre y apellido',
    login: {
      title: 'Iniciar sesión',
      subtitle: 'Bienvenida de nuevo. Continúa justo donde lo dejaste.',
      submit: 'Iniciar Sesión',
      submitting: 'Entrando…',
      failed: 'No se pudo iniciar sesión. Revisa el correo y la contraseña e inténtalo de nuevo.',
      createAccount: 'Crear una Cuenta',
      forgotPassword: '¿Olvidaste tu Contraseña?',
    },
    signup: {
      title: 'Crear cuenta',
      subtitle:
        'Únete a la comunidad DeluxFit. Los miembros reciben la biblioteca completa y coaching uno a uno.',
      submit: 'Crear Cuenta',
      submitting: 'Creando tu cuenta…',
      failed: 'No se pudo crear tu cuenta. Revisa los datos e inténtalo de nuevo.',
      haveAccount: '¿Ya eres miembro? Inicia Sesión',
      sentHeading: 'Revisa tu correo',
      sentBody: 'Te enviamos un enlace de confirmación. Ábrelo para terminar de crear tu cuenta.',
    },
    reset: {
      title: 'Restablecer contraseña',
      subtitle: 'Escribe el correo de tu cuenta y te enviamos un enlace para restablecerla.',
      submit: 'Enviar Enlace',
      submitting: 'Enviando…',
      failed: 'No se pudo enviar el enlace. Inténtalo de nuevo en un momento.',
      backToSignIn: 'Volver a Iniciar Sesión',
      sentHeading: 'Revisa tu correo',
      sentBody: 'Si existe una cuenta con ese correo, recibirás el enlace en un minuto.',
    },
    update: {
      title: 'Nueva contraseña',
      subtitle: 'Elige una segura. La usarás la próxima vez que inicies sesión.',
      newLabel: 'Nueva Contraseña',
      confirmLabel: 'Confirmar Contraseña',
      submit: 'Guardar Contraseña',
      submitting: 'Guardando…',
      failed: 'No se pudo guardar la nueva contraseña. Inténtalo de nuevo en un momento.',
      mismatch: 'Las dos contraseñas no coinciden',
      doneHeading: 'Contraseña actualizada',
      doneBody: 'Ya estás dentro. Te llevamos a tu panel…',
      continueLabel: 'Continuar',
    },
  },

  services,

  home: {
    hero: {
      badge: 'Aceptando nuevos clientes online',
      headline: ['Disciplina sobre', 'excusas.'],
      subhead:
        'Membresías, coaching online personalizado y entrenamiento 1 a 1 en vivo con la entrenadora personal certificada Angie.',
      primaryCta: 'Ver los Programas',
      primaryCtaHref: '#programs',
      secondaryCta: 'Aplicar a Coaching',
      secondaryCtaHref: '/online-coaching#apply',
      imageAlt: 'Angie en sentadilla en una máquina Smith, vista desde atrás',
      facts: [
        { value: '4', label: 'Programas' },
        { value: '$14.99', label: 'Al mes para empezar' },
        { value: '1 a 1', label: 'En vivo por video' },
      ],
    },

    marquee: [
      'Programación personalizada',
      'Entrenamiento 1 a 1 en vivo',
      'Fuerza, pérdida de grasa, ganancia muscular',
      'Entrenamiento con una entrenadora certificada',
      'En casa o en el gimnasio',
    ],

    intro: {
      eyebrow: 'Conoce a Angie',
      heading: 'Una coach que construye el programa alrededor de la persona, no al revés.',
      accent: 'alrededor de la persona',
      body: [
        'Soy Angie, entrenadora personal certificada. Ayudo a personas a volverse más fuertes, más constantes y más seguras con disciplina, acompañamiento, educación y un coaching que se adapta a su vida real.',
        'Ya sea que quieras contenido de membresía general, un programa totalmente personalizado o sesiones en vivo por video conmigo, todo lo que ofrezco lo entrego directamente yo, sin plantillas, sin programas reciclados, sin adivinanzas.',
      ],
      ctaLabel: 'Lee Mi Historia',
      ctaHref: '/about',
      imageAlt: 'Angie acompañando a una clienta en una serie de prensa de piernas',
    },

    transformationCallout: {
      eyebrow: 'Sobre qué se construye',
      heading: 'Disciplina, acompañamiento, educación, hecho para la vida real.',
      accent: 'vida real',
      body: 'Cada programa DeluxFit se apoya en las mismas tres cosas, sea cual sea el nivel de acompañamiento que elijas.',
      pillars: [
        {
          icon: Dumbbell,
          title: 'Entrenamiento real',
          description:
            'Programación diseñada según tu meta (pérdida de grasa, ganancia muscular, fuerza o fitness general), no una plantilla genérica.',
        },
        {
          icon: HeartPulse,
          title: 'Guía real',
          description:
            'Guía básica de nutrición, educación fitness y coaching enfocado en técnica para que el esfuerzo que pones realmente te haga avanzar.',
        },
        {
          icon: HandHeart,
          title: 'Acompañamiento real',
          description:
            'Acceso directo a mí dentro de la plataforma, check-ins mensuales en coaching, coaching en vivo en las sesiones, sin excusas.',
        },
      ],
      ctaLabel: 'Ver Historias',
      ctaHref: '/testimonials',
    },

    closing: {
      heading: 'Elige el programa que encaja contigo.',
      accent: 'encaja contigo',
      subhead:
        'Suscríbete a la membresía, aplica al coaching personalizado o reserva una sesión de entrenamiento en vivo, y arrancamos desde ahí.',
      primaryCta: 'Aplicar a Coaching',
      primaryCtaHref: '/online-coaching#apply',
      secondaryCta: 'Reservar Sesión',
      secondaryCtaHref: '/single-session#book',
    },
  },

  about: {
    hero: {
      eyebrow: 'Sobre Angie',
      heading: 'La entrenadora que siempre quise.',
      accent: 'siempre quise',
      subhead:
        'Soy Angie, entrenadora personal certificada. Construí DeluxFit para entrenar a las personas como me habría gustado que me entrenaran a mí.',
      imageAlt: 'Angie acompañando a una clienta en una serie de prensa de piernas',
    },
    mission: {
      heading: 'Disciplina sobre excusas.',
      accent: 'sobre excusas',
      body: 'Delux Fit ayuda a sus clientes a alcanzar sus metas de fitness a través de disciplina, acompañamiento, educación y coaching personalizado.',
    },
    story: {
      heading: 'Entrenar cambió mucho más que mi cuerpo.',
      accent: 'mucho más que mi cuerpo',
      paragraphs: [
        'El fitness llegó a mi vida porque quería hacer un cambio real en mí, tanto físico como mental. Muy pronto se convirtió en mucho más que eso.',
        'En ese momento estaba atravesando una de las etapas más difíciles de mi vida. Mi hijo menor nació con condiciones médicas especiales, y casi al mismo tiempo recibí la noticia de que mi papá tenía cáncer.',
        'Entrenar se volvió la pequeña parte del día que podía dedicarme por completo a mí. Me dio un espacio para desconectarme del estrés, del miedo y de las responsabilidades de la vida diaria, y enfocarme en hacerme más fuerte, no solo físicamente, sino también mental y emocionalmente.',
        'A través del fitness descubrí de lo que era capaz cuando practicaba disciplina, constancia y compromiso. Me enamoré del proceso porque entrenar no estaba cambiando solamente mi cuerpo; estaba cambiando la forma en que enfrentaba los momentos difíciles de mi vida. Esa experiencia es gran parte de la razón por la que me convertí en coach.',
        'Hoy quiero que otras mujeres entiendan que el fitness puede ser mucho más que verse bien. Puede convertirse en un espacio para cuidarte, recuperar tu confianza, construir disciplina, sentirte más fuerte y descubrir de lo que eres capaz.',
        'Mi meta es ayudar a las mujeres a lograr cambios físicos de los que se sientan orgullosas, mientras desarrollan una fuerza y una confianza que las acompañan en todas las demás áreas de su vida.',
      ],
    },
    credentials: {
      eyebrow: 'Certificaciones y experiencia',
      heading: 'Formada para entrenar, certificada para liderar.',
      accent: 'certificada para liderar',
      items: [
        'Entrenadora Personal Certificada',
        'Educación continua en fuerza y acondicionamiento',
        'Años de experiencia entrenando online y de manera presencial',
        'Experiencia programando para pérdida de grasa, ganancia muscular, fuerza y fitness general',
      ],
    },
    philosophy: {
      heading: 'Personalizado, profesional, sostenible.',
      accent: 'sostenible',
      pillars: [
        {
          icon: ClipboardCheck,
          title: 'Hecho para ti',
          description:
            'Cada programa personalizado se forma alrededor de tus metas, tu nivel, tu estilo de vida y tu experiencia, nunca un plan genérico sacado de una plantilla.',
        },
        {
          icon: GraduationCap,
          title: 'Coaching, no adivinanza',
          description:
            'Recibes el plan Y la explicación, por qué esos ejercicios, esa estructura, esa progresión. La meta es que cada mes salgas más informada e independiente.',
        },
        {
          icon: HandHeart,
          title: 'Progreso honesto y sostenible',
          description:
            'Sin promesas exageradas, sin planes de comida, sin un ritmo de check-ins irreal. Guía básica de nutrición, entrenamiento real y una estructura que realmente puedes mantener.',
        },
      ],
    },
    cta: {
      heading: '¿Lista para entrenar juntas?',
      accent: 'entrenar juntas',
      subhead:
        'Explora la membresía, aplica al coaching personalizado o reserva una sesión en vivo online.',
      primary: { label: 'Ver los Programas', href: '/#programs' },
      secondary: { label: 'Contactar a Angie', href: '/contact' },
    },
  },

  membership: {
    hero: {
      eyebrow: 'Membresía Delux Fit',
      heading: 'Fitness a tu propio ritmo.',
      accent: 'a tu propio ritmo',
      subhead:
        'Programas generales de entrenamiento, biblioteca de ejercicios y educación de fitness, por $14.99 al mes.',
      primaryCta: 'Suscribirme por $14.99 al Mes',
      primaryCtaHref: '#sign-up',
      secondaryCta: 'Comparar programas',
      secondaryCtaHref: '/#programs',
    },
    notPersonalizedCallout:
      'Esta es una membresía de nivel inicial. El contenido es GENERAL y NO está personalizado. Para un programa hecho a tu medida, mira el Coaching Online Personalizado.',
    includesHeading: 'Todo lo que necesitas para entrenar con constancia.',
    includesAccent: 'entrenar con constancia',
    includes: [
      {
        icon: Library,
        title: 'Programas de entrenamiento',
        description:
          'Un catálogo creciente de programas generales que puedes seguir a tu propio ritmo.',
      },
      {
        icon: Dumbbell,
        title: 'Biblioteca de ejercicios',
        description:
          'Una biblioteca de referencia de movimientos para que siempre sepas qué haces y por qué.',
      },
      {
        icon: PlayCircle,
        title: 'Videos de entrenamiento',
        description:
          'Demostraciones en video de cada movimiento para que la técnica quede clara antes de empezar.',
      },
      {
        icon: GraduationCap,
        title: 'Educación fitness',
        description:
          'Lecciones cortas y prácticas que explican el porqué del entrenamiento, no solo el qué.',
      },
      {
        icon: Apple,
        title: 'Guía general de nutrición',
        description:
          'Una guía general de nutrición para construir hábitos sostenibles junto a tu entrenamiento.',
      },
      {
        icon: Zap,
        title: 'Programas de pérdida de grasa',
        description:
          'Entrenamiento estructurado de pérdida de grasa que puedes empezar de inmediato.',
      },
      {
        icon: HeartPulse,
        title: 'Programas de ganancia muscular',
        description:
          'Programas enfocados en hipertrofia para construir tamaño y fuerza con el tiempo.',
      },
      {
        icon: Target,
        title: 'Rutinas de core y abdomen',
        description: 'Rutinas de core y abdomen para completar tu entrenamiento.',
      },
      {
        icon: Sparkles,
        title: 'Contenido nuevo añadido regularmente',
        description: 'La biblioteca crece con el tiempo para que tu entrenamiento siga vigente.',
      },
    ],
    bestFor: {
      heading: '¿Para quién es la membresía Delux Fit?',
      accent: 'la membresía Delux Fit?',
      body: 'Si eres auto-motivada y quieres una biblioteca estructurada para entrenar, la membresía es la forma más económica de entrenar con DeluxFit. Para un programa personalizado, mira Coaching Online. Para sesiones en vivo en tiempo real con Angie, mira la Sesión en Vivo o el Programa de Entrenamiento Personal en Vivo.',
    },
    signupForm: {
      nameLabel: 'Nombre Completo',
      namePlaceholder: 'Tu nombre',
      emailLabel: 'Correo',
      emailPlaceholder: 'tu@ejemplo.com',
      notesLabel: '¿Algo que Angie deba saber?',
      notesPlaceholder: 'Metas, horarios, equipo disponible',
      notesHelper: 'Le llega a Angie junto con tu registro.',
      submitLabel: 'Suscribirme por $14.99 al Mes',
      submittingLabel: 'Iniciando el pago…',
      required: 'Requerido',
      invalidEmail: 'Escribe un correo válido',
      successHeading: 'Ya estás en la lista.',
      successBody:
        'Gracias por registrarte. Angie te enviará tus datos de acceso y la información inicial por correo.',
      errorBody: 'Vuelve a intentarlo en un momento.',
      followUp: 'Angie te escribirá con tus datos de acceso.',
      accountFirstHeading: 'Primero crea tu cuenta.',
      accountFirstBody:
        'La membresía vive en tu portal de clientes, así que tu suscripción tiene que pertenecer a una cuenta. Crea una ahora — toma un momento — y volverás aquí mismo para suscribirte.',
      accountFirstCta: 'Crear Mi Cuenta',
      accountFirstSignIn: '¿Ya tienes una cuenta? Inicia sesión',
    },
    signupSection: {
      id: 'sign-up',
      heading: 'Comienza la membresía por $14.99 al mes.',
      accent: '$14.99 / mes',
      body: 'Suscríbete abajo para iniciar tu membresía de $14.99/mes y desbloquear la biblioteca de contenido general. Cancela cuando quieras.',
    },
  },

  coaching: {
    hero: {
      eyebrow: 'Coaching Online Personalizado',
      heading: 'Coaching hecho para ti.',
      accent: 'para ti',
      subhead:
        'Un plan para tus metas, revisiones mensuales, seguimiento de progreso y mensajería directa con Angie.',
      primaryCta: 'Aplicar Ahora',
      primaryCtaHref: '#apply',
      secondaryCta: 'Comparar programas',
      secondaryCtaHref: '/#programs',
    },
    includesHeading: 'Todo lo que necesitas, hecho para ti, ajustado conforme avanzas.',
    includesAccent: 'ajustado conforme avanzas',
    includes: [
      {
        icon: ClipboardCheck,
        title: 'Consulta inicial',
        description:
          'Empezamos con una consulta para entender tus metas, tu historial, tu agenda y tus limitaciones.',
      },
      {
        icon: Dumbbell,
        title: 'Plan de entrenamiento personalizado',
        description:
          'Un programa diseñado específicamente para ti, nunca una plantilla, construido alrededor de tus metas y tu nivel.',
      },
      {
        icon: CalendarCheck,
        title: 'Calendario de entrenamiento personalizado',
        description:
          'Un calendario de entrenamiento estructurado alrededor de tu semana y tu disponibilidad.',
      },
      {
        icon: LineChart,
        title: 'Revisión de progreso mensual',
        description: 'Cada mes revisamos juntas tu progreso para ver qué funciona y qué ajustar.',
      },
      {
        icon: Video,
        title: 'Check-in mensual',
        description:
          'Un check-in agendado al mes para revisar el entrenamiento, resolver dudas y afinar el plan.',
      },
      {
        icon: Target,
        title: 'Seguimiento de progreso',
        description:
          'Lleva el registro de tu progreso dentro de la plataforma para que cada ajuste se base en datos reales.',
      },
      {
        icon: MessageSquare,
        title: 'Mensajería directa dentro de la plataforma',
        description:
          'Escríbele a Angie directamente dentro de Delux Fit, el único canal de comunicación del coaching.',
      },
      {
        icon: Apple,
        title: 'Guía básica de nutrición',
        description:
          'Orientación nutricional general y sostenible para apoyar tu entrenamiento, sin planes de comida.',
      },
      {
        icon: Sparkles,
        title: 'Recomendaciones personalizadas',
        description:
          'Recomendaciones según tus metas, tu progreso y el momento en el que estás del programa.',
      },
    ],
    communication: {
      heading: 'Toda la comunicación ocurre dentro de la plataforma Delux Fit.',
      accent: 'dentro de la plataforma Delux Fit',
      body: 'No hay acceso telefónico personal. Le escribes a Angie directamente por la plataforma y ella responde en hasta 72 horas hábiles.',
      points: [
        'Toda la comunicación ocurre dentro de la plataforma Delux Fit',
        'Sin acceso telefónico personal',
        'Tiempo de respuesta: hasta 72 horas hábiles',
      ],
    },
    bestFor: {
      heading: '¿Para quién es el coaching online?',
      accent: 'el coaching online?',
      body: 'Si quieres un programa hecho específicamente para ti que puedas seguir por tu cuenta, con coaching mensual de Angie, Coaching Online es la opción. Si además quieres coaching en vivo, suma una Sesión en Vivo o el Programa de Entrenamiento Personal en Vivo.',
    },
    applicationSection: {
      id: 'apply',
      heading: 'Cuéntale a Angie sobre tus metas.',
      accent: 'tus metas',
      body: 'Llena la aplicación de abajo. Angie revisa cada una personalmente y responde con los siguientes pasos antes de cobrar.',
    },
    application: {
      submitLabel: 'Enviar Aplicación',
      submittingLabel: 'Enviando…',
      successHeading: 'Aplicación recibida.',
      successBody:
        'Gracias por aplicar. Angie revisará tu aplicación personalmente y te escribirá por correo con los siguientes pasos.',
      errorBody:
        'Algo salió mal al enviar tu aplicación. Inténtalo de nuevo o escríbele directamente desde la página de Contacto.',
      fields: {
        name: { label: 'Nombre Completo', placeholder: 'Tu nombre', required: true },
        email: { label: 'Correo Electrónico', placeholder: 'tu@ejemplo.com', required: true },
        phone: { label: 'Teléfono (Opcional)', placeholder: '(555) 555-5555' },
        age: { label: 'Edad', placeholder: '30', required: true },
        location: { label: 'Ciudad / Ubicación', placeholder: 'Ciudad, Estado' },
        goal: {
          label: 'Meta Principal',
          placeholder: 'Selecciona tu meta principal',
          required: true,
          options: [
            'Pérdida de grasa',
            'Ganancia muscular',
            'Desarrollo de fuerza',
            'Fitness general',
            'Otra',
          ],
        },
        experience: {
          label: 'Experiencia de Entrenamiento',
          placeholder: 'Selecciona tu nivel',
          required: true,
          options: [
            'Principiante total, nunca he entrenado con constancia',
            'Principiante, entreno ocasionalmente',
            'Intermedio, he entrenado con constancia 1+ año',
            'Avanzado, varios años de entrenamiento estructurado',
          ],
        },
        equipment: {
          label: '¿A qué equipo tienes acceso?',
          placeholder: 'Gimnasio completo, mancuernas en casa, solo peso corporal, etc.',
          required: true,
        },
        availability: {
          label: '¿Cuántos días por semana puedes entrenar?',
          required: true,
          options: ['1-2', '3-4', '5-6', '7'],
          unit: 'días por semana',
        },
        notes: {
          label: '¿Algo más que Angie deba saber?',
          placeholder:
            'Lesiones, condiciones médicas, restricciones de horario, metas específicas…',
        },
        consent: {
          label:
            'Entiendo que esto es una aplicación, Angie la revisará y me escribirá antes de cobrar.',
          required: true,
        },
      },
    },
  },

  session: {
    hero: {
      eyebrow: 'Sesión de Entrenamiento en Vivo',
      heading: 'Una sesión, antes de comprometerte.',
      accent: 'antes de comprometerte',
      subhead: 'Una sesión privada virtual con Angie, de 45 a 60 minutos, por $75.',
      primaryCta: 'Reservar Sesión',
      primaryCtaHref: '#book',
      secondaryCta: 'Comparar programas',
      secondaryCtaHref: '/#programs',
    },
    perfectForHeading: 'Una sesión privada, construida por completo alrededor de ti.',
    perfectForAccent: 'alrededor de ti',
    perfectFor: [
      { icon: Sparkles, title: 'Probar Delux Fit antes de comprometerte' },
      { icon: GraduationCap, title: 'Aprender la técnica correcta' },
      { icon: ClipboardCheck, title: 'Corrección de técnica' },
      { icon: HandHeart, title: 'Motivación' },
      { icon: MessageSquare, title: 'Preguntas y respuestas' },
      { icon: Dumbbell, title: 'Una experiencia de entrenamiento personalizada' },
    ],
    bookSection: {
      id: 'book',
      heading: 'Elige una fecha y un horario y entrena con Angie en vivo.',
      accent: 'entrena con Angie en vivo',
      body: 'Selecciona abajo una fecha, un horario, tu enfoque de entrenamiento y tu meta. Tu cita se reserva por el calendario y se confirma automáticamente.',
    },
  },

  training: {
    hero: {
      eyebrow: 'Programa de Entrenamiento en Vivo',
      heading: 'Lo más cercano a lo presencial.',
      accent: 'a lo presencial',
      subhead:
        'Entrenamiento en vivo por Zoom, con Angie presente toda la sesión, a $50 por sesión.',
      primaryCta: 'Empezar',
      primaryCtaHref: '#book',
      secondaryCta: 'Comparar programas',
      secondaryCtaHref: '/#programs',
    },
    includesHeading: 'Coaching en vivo, por Zoom, en tiempo real.',
    includesAccent: 'en tiempo real',
    includes: [
      {
        icon: Video,
        title: 'Coaching en vivo',
        description:
          'Una sesión en tiempo real por Zoom, Angie está presente durante todo el entrenamiento.',
      },
      {
        icon: ClipboardCheck,
        title: 'Correcciones en tiempo real',
        description:
          'Angie observa tu técnica y la corrige sobre la marcha para que cada repetición cuente.',
      },
      {
        icon: HandHeart,
        title: 'Acompañamiento',
        description:
          'Sin saltarte repeticiones ni series a medias, el acompañamiento está en cada sesión.',
      },
      {
        icon: GraduationCap,
        title: 'Guía de ejercicios',
        description:
          'Guía de tempo, señales, intensidad y descansos, todo en vivo mientras entrenas.',
      },
      {
        icon: Dumbbell,
        title: 'Estructura de entrenamiento personalizada',
        description: 'Cada sesión se estructura alrededor de tus metas y del equipo que tienes.',
      },
    ],
    recommendation: {
      heading: 'Recomendado un mínimo de 3 sesiones por semana.',
      accent: '3 sesiones por semana',
      body: 'Para los mejores resultados recomendamos un mínimo de 3 sesiones por semana. Ejemplo: 3 sesiones/semana = $150/semana. Es continuo, la experiencia más cercana al entrenamiento presencial, desde donde estés.',
      perSessionLabel: 'por sesión',
      sessionsPerWeek: 3,
      sessionsLabel: 'sesiones por semana recomendadas',
      weeklyLabel: 'por semana a ese ritmo',
    },
    bookSection: {
      id: 'book',
      heading: 'Elige tus horarios y entrena con Angie en vivo.',
      accent: 'entrena con Angie en vivo',
      body: 'Selecciona abajo una fecha, un horario, tu enfoque de entrenamiento y tu meta. Reserva una sesión o varias en la semana, recomendamos un mínimo de 3 por semana.',
    },
  },

  booking: {
    selectDateLabel: 'Selecciona una Fecha',
    selectTimeLabel: 'Selecciona un Horario',
    trainingFocusLabel: 'Enfoque de Entrenamiento',
    trainingFocusPlaceholder: 'Selecciona un enfoque',
    fitnessGoalLabel: 'Meta de Fitness',
    fitnessGoalPlaceholder: 'Selecciona tu meta',
    nameLabel: 'Nombre Completo',
    namePlaceholder: 'Tu nombre',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'tu@ejemplo.com',
    loadingSlots: 'Cargando horarios disponibles…',
    noSlots: 'No hay horarios disponibles en esta fecha. Prueba otro día.',
    pickDateFirst: 'Elige una fecha para ver los horarios disponibles.',
    slotTaken: 'Ocupado',
    submitLabel: 'Confirmar Reserva',
    submittingLabel: 'Reservando…',
    successHeading: 'Sesión reservada.',
    successBody:
      'Tu sesión está confirmada. Recibirás una confirmación con el enlace seguro de video. Gestiona tus reservas cuando quieras desde el portal de clientes.',
    errorBody:
      'Algo salió mal al reservar tu sesión. Inténtalo de nuevo o escríbenos desde la página de Contacto.',
    slotTakenError:
      'Ese horario lo acaba de reservar otra persona. Por favor elige otro horario disponible.',
    notConfiguredNotice:
      'Esta sesión no pudo reservarse automáticamente. Angie tiene tu selección y confirmará la hora por correo.',
    trainingFocusOptions: [
      'Cuerpo completo',
      'Tren superior',
      'Tren inferior',
      'Core y abdomen',
      'Fuerza',
      'Acondicionamiento / cardio',
      'Técnica',
      'Movilidad',
    ],
    fitnessGoalOptions: [
      'Pérdida de grasa',
      'Ganancia muscular',
      'Desarrollo de fuerza',
      'Fitness general',
      'Otra',
    ],
  },

  testimonials: {
    hero: {
      eyebrow: 'Historias de clientes',
      heading: 'Clientes reales, progreso real.',
      accent: 'progreso real',
      subhead:
        'Las historias se publican aquí cuando las clientas terminan su programa, en sus palabras y con su permiso.',
    },
    marquee: [
      'Resultados reales',
      'Constancia real',
      'Disciplina sobre excusas',
      'Ganado, no dicho',
    ],
    storiesNote:
      'Cada cita de esta página pertenece a una clienta que terminó su programa. Nada de lo que aparece aquí se escribió en su nombre.',
    storiesHeading: 'Lo que dicen las clientas.',
    storiesAccent: 'dicen las clientas',
    storiesEmpty: {
      heading: 'Las primeras historias todavía se están ganando.',
      body: 'Angie publica la historia de una clienta cuando termina su programa, en sus propias palabras y con su permiso. Empieza un programa y la tuya puede ser una de ellas.',
      ctaLabel: 'Aplicar a Coaching',
      ctaHref: '/online-coaching#apply',
    },
    cta: {
      heading: '¿Quieres ser una de las historias reales?',
      accent: 'historias reales',
      subhead:
        'Elige un programa y empieza. Tu transformación puede ser la siguiente que destaquemos aquí, con tu permiso.',
      primary: { label: 'Aplicar a Coaching', href: '/online-coaching#apply' },
      secondary: { label: 'Reservar Sesión', href: '/single-session#book' },
    },
  },

  contact: {
    hero: {
      eyebrow: 'Contacto',
      heading: 'Ponte en contacto con Angie.',
      accent: 'con Angie',
      subhead:
        '¿Dudas sobre la membresía, el coaching o el entrenamiento en vivo? Escribe y Angie te responde personalmente.',
    },
    formHeading: 'Cuéntale a Angie de qué quieres hablar.',
    formAccent: 'de qué quieres hablar',
    socialHeading: 'Redes sociales',
    socialBody:
      'Angie publica consejos de entrenamiento, rutinas y contenido detrás de cámaras en estos canales.',
    directNote:
      '¿Quieres registrarte, aplicar al coaching o reservar una sesión 1 a 1? El camino más rápido es la página del servicio que te interesa. Esos formularios llegan directo a Angie.',
    form: {
      submitLabel: 'Enviar Mensaje',
      submittingLabel: 'Enviando…',
      successHeading: 'Mensaje enviado.',
      successBody: 'Gracias por escribir, Angie te contestará por correo en cuanto pueda.',
      errorBody: 'Algo salió mal al enviar tu mensaje. Inténtalo de nuevo en un momento.',
      fields: {
        name: { label: 'Tu Nombre', placeholder: 'Tu nombre', required: true },
        email: { label: 'Correo Electrónico', placeholder: 'tu@ejemplo.com', required: true },
        topic: {
          label: '¿De qué se trata?',
          placeholder: 'Elige un tema',
          required: true,
          options: [
            'Pregunta de membresía',
            'Pregunta de coaching online',
            'Pregunta de sesión en vivo',
            'Pregunta del programa de entrenamiento en vivo',
            'Prensa / colaboraciones',
            'Otra cosa',
          ],
        },
        message: {
          label: 'Mensaje',
          placeholder: 'Cuéntale a Angie de qué quieres hablar…',
          required: true,
        },
      },
    },
  },

  programs: {
    heading: 'Elige el nivel de apoyo que encaja.',
    accent: 'nivel de apoyo',
    subhead: 'Cuatro formas de entrenar. Cada precio y cada inclusión está en la tarjeta.',
  },

  /* LEGAL — privacidad y terminos, un componente renderiza ambos */
  legal: {
    contentsLabel: 'Contenido',
    lastUpdatedLabel: 'Última actualización',
    contactCta: 'Escribir a Angie',
    lastUpdated: 'Febrero de 2026',
    privacy: {
      eyebrow: 'Privacidad',
      heading: 'Qué recoge DeluxFit, y para qué.',
      accent: 'recoge',
      subhead:
        'Angie lleva este sitio ella misma. Guarda lo que una entrenadora necesita para entrenarte y nada más.',
      sections: [
        {
          heading: 'Qué se recoge',
          body: 'Llegan dos cosas a DeluxFit. La primera es lo que escribes en un formulario: tu nombre, tu correo y lo que pongas en el mensaje, la solicitud o la reserva. La segunda es lo que guarda una cuenta de miembro: tu plan de entrenamiento, tu plan de nutrición, las entradas de progreso que registras, los mensajes entre Angie y tú, y cualquier foto que subas a una entrada de progreso.',
        },
        {
          heading: 'Para qué se usa',
          body: 'Los datos de contacto se usan para responderte y para llevar tu programa. Los datos de entrenamiento se usan para escribir tu plan y revisar tu progreso. Nada se vende, se alquila ni se entrega a un anunciante, y DeluxFit no envía correo publicitario que no hayas pedido.',
        },
        {
          heading: 'Quién más lo guarda',
          body: 'Las cuentas, los planes, los mensajes y las subidas se guardan en Supabase. Los pagos los cobra Stripe, que maneja los datos de la tarjeta directamente: DeluxFit nunca ve ni guarda un número de tarjeta. El sitio lo sirve Vercel. Cada una de esas empresas procesa los datos por encargo de Angie y bajo sus propios términos de privacidad.',
        },
        {
          heading: 'Cuánto tiempo se guarda',
          body: 'Los datos de la cuenta se guardan mientras la cuenta esté abierta. Pídele a Angie que la cierre y se borra todo lo asociado, salvo los registros de pago que Stripe debe conservar por obligación fiscal y contable. Los mensajes del formulario de contacto se guardan mientras la conversación siga viva y se borran cuando termina.',
        },
        {
          heading: 'Qué puedes pedir',
          body: 'Puedes pedir una copia de todo lo que DeluxFit guarda sobre ti, pedir que se corrija cualquier parte, o pedir que se borre todo. Escríbele a Angie desde la página de contacto y ella lo hará.',
        },
        {
          heading: 'Menores',
          body: 'Los programas de DeluxFit se venden a personas adultas. El sitio no está dirigido a menores de 18 años y no debe abrirse una cuenta para uno.',
        },
      ],
    },
    terms: {
      eyebrow: 'Términos',
      heading: 'El acuerdo entre DeluxFit y tú.',
      accent: 'acuerdo',
      subhead: 'Comprar un programa o abrir una cuenta significa que estos términos te aplican.',
      sections: [
        {
          heading: 'Qué estás comprando',
          body: 'La membresía te da contenido general de fitness que no está escrito para ti en particular. El coaching online, las sesiones individuales y el programa de entrenamiento en vivo son servicios personalizados que imparte Angie. Cada página de programa indica su precio, su periodo de facturación y lo que incluye, y esas páginas son los términos de la venta.',
        },
        {
          heading: 'Facturación y cancelación',
          body: 'La membresía y el coaching online se cobran cada mes por Stripe hasta que canceles. Cancela cuando quieras y el acceso llega hasta el final del periodo que ya pagaste. Las sesiones individuales y las sesiones del programa en vivo se pagan al reservarlas.',
        },
        {
          heading: 'Sesiones perdidas y cambios de fecha',
          body: 'Avisa con al menos 24 horas para mover una sesión en vivo ya reservada y se cambia de fecha sin coste. Una sesión perdida sin ese aviso cuenta como impartida.',
        },
        {
          heading: 'Reembolsos',
          body: 'Una sesión en vivo que aún no has tomado se reembolsa completa. Un mes de membresía o de coaching que ya corrió no se reembolsa, porque el contenido y el plan de ese mes se entregaron. Si algo salió mal, escríbele a Angie antes de abrir una disputa.',
        },
        {
          heading: 'Salud y seguridad',
          body: 'Angie es entrenadora personal certificada, no médica, y nada en este sitio es consejo médico. Habla con tu médico antes de empezar cualquier programa de ejercicio o nutrición. Entrenas bajo tu propia responsabilidad y te toca a ti parar cuando algo duele.',
        },
        {
          heading: 'Tu cuenta',
          body: 'Guarda tu contraseña y no compartas tu acceso. Los planes, los videos y el material de los programas son obra de Angie y se te licencian solo para tu propio entrenamiento, no para redistribuir ni revender.',
        },
        {
          heading: 'Terminar el acuerdo',
          body: 'Puedes cerrar tu cuenta cuando quieras pidiéndoselo a Angie. Ella puede cerrar una cuenta que se use para redistribuir material del programa o para abusar de la mensajería, y reembolsará cualquier periodo pagado y no entregado.',
        },
      ],
    },
  },

  footer: {
    cta: 'Aplicar a Coaching',
    ctaHref: '/online-coaching#apply',
    legalLabel: 'Legal',
    legal: [
      { label: 'Política de Privacidad', href: '/privacy' },
      { label: 'Términos del Servicio', href: '/terms' },
      { label: 'Contacto', href: '/contact' },
    ],
    blurb:
      'Disciplina sobre excusas. Membresías de fitness, coaching online personalizado y entrenamiento en vivo con la entrenadora personal certificada Angie.',
    navLabel: 'Pie de página',
    rightsReserved: 'Todos los derechos reservados.',
    socials: [],
    smallPrint:
      'Los resultados varían. DeluxFit by Angie ofrece coaching de fitness con fines educativos y no sustituye el consejo médico. Consulta a tu médico antes de iniciar cualquier programa de ejercicio o nutrición.',
  },

  portal: {
    backToSite: 'Volver al Sitio',
    sectionsLabel: 'Secciones del Portal',
    more: 'Más',
    moreLabel: 'Más Secciones',
    close: 'Cerrar',
    optional: 'Opcional',
    backToHome: 'Volver a DeluxFit',
    brandLockup: 'Portal de Clientes',
    preview: {
      staffLabel: 'Vista de entrenadora',
      staffBody:
        'Como entrenadora ves todos los elementos de la biblioteca, sin importar su nivel de acceso. Previsualiza el portal para comprobar lo que realmente recibe una clienta.',
      previewAs: 'Previsualizar como',
      levelLabel: {
        membership: 'Miembro',
        coaching: 'Clienta de Coaching',
      },
      activeLabel: 'Vista de clienta',
      levelBody: {
        membership:
          'Previsualizando como miembro. Esto es exactamente lo que desbloquea la membresía Delux Fit.',
        coaching:
          'Previsualizando como clienta de coaching. Esto es exactamente lo que desbloquea el coaching online personalizado.',
      },
      ownData: 'Tu propio plan, nutrición, progreso, sesiones y mensajes siguen siendo tuyos.',
      exit: 'Salir de la Vista Previa',
    },
    auth: {
      signInTitle: 'Acceso Clientes',
      signUpTitle: 'Crea tu cuenta',
      signInSubtitle: 'Inicia sesión en tu portal de cliente Delux Fit.',
      signUpSubtitle: 'Únete a Delux Fit para acceder a tu plan, tu progreso y tu coach.',
      nameLabel: 'Nombre Completo',
      namePlaceholder: 'Tu nombre',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'tu@ejemplo.com',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Al menos 8 caracteres',
      signInCta: 'Iniciar Sesión',
      signUpCta: 'Crear Cuenta',
      signingIn: 'Iniciando sesión…',
      signingUp: 'Creando cuenta…',
      toSignUp: '¿Nueva en Delux Fit? Crea una cuenta',
      toSignIn: '¿Ya tienes cuenta? Inicia sesión',
      signOut: 'Cerrar Sesión',
      checkEmail: 'Revisa tu correo para confirmar tu cuenta y luego inicia sesión.',
      genericError: 'Algo salió mal. Revisa tus datos e inténtalo de nuevo.',
    },
    nav: {
      overview: 'Hoy',
      plan: 'Mi Plan',
      progress: 'Progreso',
      nutrition: 'Nutrición',
      bookings: 'Sesiones',
      messages: 'Mensajes',
      library: 'Biblioteca',
    },
    overview: {
      greeting: 'Hola de nuevo',
      subtitle: 'Esto es todo lo que hay en tu cuenta Delux Fit.',
      membershipStatus: 'Membresía',
      coachingStatus: 'Coaching',
      noEntitlements:
        'Todavía no tienes una membresía o un plan de coaching activo. Explora los programas para empezar.',
      explorePrograms: 'Explorar Programas',
      active: 'Activo',
      inactive: 'Inactivo',
    },
    plan: {
      title: 'Mi plan personalizado',
      empty:
        'Todavía no se ha asignado un plan personalizado. Los planes personalizados están disponibles con el Coaching Online Personalizado.',
      emptyCta: 'Aplicar a Coaching',
      gatedTitle: 'Los planes personalizados son parte del coaching',
      gatedBody:
        'Tus planes de entrenamiento asignados aparecen aquí cuando eres clienta activa de coaching.',
    },
    progress: {
      title: 'Seguimiento de progreso',
      addEntry: 'Registrar una Entrada',
      dateLabel: 'Fecha',
      weightLabel: 'Peso (lb)',
      bodyFatLabel: 'Grasa Corporal (%)',
      notesLabel: 'Notas',
      notesPlaceholder: '¿Cómo se sintió el entrenamiento? Energía, sueño, logros…',
      measurementsLabel: 'Medidas (pulg)',
      waistLabel: 'Cintura',
      hipsLabel: 'Cadera',
      chestLabel: 'Pecho',
      armsLabel: 'Brazos',
      thighsLabel: 'Muslos',
      photoLabel: 'Foto de Progreso',
      photoHelper: 'Opcional, solo tú y Angie pueden verla.',
      saveEntry: 'Guardar Entrada',
      saving: 'Guardando…',
      empty: 'Aún no hay entradas. Registra la primera para empezar a llevar el seguimiento.',
      trendTitle: 'Tendencia de peso',
      photo: 'Foto',
      viewPhoto: 'Ver Foto',
      colDate: 'Fecha',
      colWeight: 'Peso',
      colBodyFat: 'Grasa Corporal',
      colNotes: 'Notas',
      cancel: 'Cancelar',
      today: 'Hoy',
      yesterday: 'Ayer',
      decrease: 'Disminuir',
      increase: 'Aumentar',
      photoDrop: 'Agregar una foto de progreso',
      removePhoto: 'Quitar Foto',
      entriesLogged: 'registros',
      sinceLast: 'desde el último registro',
      tableCaption: 'Todos los registros de progreso que has guardado',
    },
    bookings: {
      title: 'Tus sesiones',
      empty: 'No hay sesiones próximas. Reserva una sesión en vivo para empezar.',
      bookCta: 'Reservar una Sesión',
      upcoming: 'Próximas',
      past: 'Pasadas',
      status: { pending: 'Pendiente', confirmed: 'Confirmada', canceled: 'Cancelada' },
    },
    messages: {
      title: 'Mensajes con Angie',
      intro:
        'Este es el único canal de comunicación del coaching. El tiempo de respuesta es de hasta 72 horas hábiles.',
      placeholder: 'Escríbele un mensaje a Angie…',
      send: 'Enviar',
      sending: 'Enviando…',
      empty: 'Aún no hay mensajes. Saluda para empezar la conversación.',
      attach: 'Adjuntar Archivo',
      viewAttachment: 'Ver Adjunto',
      coachName: 'Angie',
      youName: 'Tú',
      gatedBody: 'La mensajería directa está disponible para clientes activos de coaching.',
    },
    library: {
      title: 'Biblioteca de contenido',
      intro: 'Videos de entrenamiento, recursos de nutrición y educación fitness.',
      empty:
        'Aún no hay contenido disponible. Vuelve pronto, se añade contenido nuevo regularmente.',
      gatedTitle: 'Desbloquea la biblioteca de contenido',
      gatedBody:
        'La biblioteca de contenido está disponible con una membresía o un plan de coaching activo.',
      gatedCta: 'Ver Membresía',
      categoryAll: 'Todo',
      categoryWorkout: 'Entrenamientos',
      categoryNutrition: 'Nutrición',
      categoryEducation: 'Educación',
      locked: 'Bloqueado',
      open: 'Abrir',
      opening: 'Abriendo…',
      weekLabel: 'Semana',
      dayLabel: 'Día',
      resourcesGroup: 'Recursos',
    },
    nutrition: {
      title: 'Nutrición',
      intro: 'Tus objetivos de calorías, estructura de comidas y recursos personalizados de Angie.',
      empty:
        'Aún no se ha escrito una guía de nutrición. Angie la construye en torno a tus objetivos cuando empiezas el coaching.',
      unavailable:
        'Tu plan de nutrición no se pudo cargar. Actualiza la página para volver a intentarlo.',
      gatedTitle: 'La guía de nutrición es parte del coaching',
      gatedBody:
        'Tu plan de nutrición personalizado aparece aquí cuando eres clienta activa de coaching.',
      gatedCta: 'Aplicar a Coaching',
      caloriesLabel: 'Calorías Diarias',
      proteinLabel: 'Proteína',
      carbsLabel: 'Carbohidratos',
      fatLabel: 'Grasa',
      mealsTitle: 'Estructura de comidas',
      resourcesTitle: 'Recursos',
      notesTitle: 'Notas de Angie',
      grams: 'g',
    },
    hero: {
      thisWeek: 'Esta semana',
      todayLabel: 'Hoy',
      bookedLabel: 'Sesión',
      restLabel: 'Descanso',
      messagesTitle: 'Mensajes',
      latestFromCoach: 'Lo último de Angie',
      noMessages: 'Aún no hay mensajes. Saluda para empezar la conversación.',
      openMessages: 'Abrir Mensajes',
      messagesLocked: 'Únete al coaching para escribirle directamente a Angie.',
      libraryTitle: 'Sigue entrenando',
      openLibrary: 'Abrir la Biblioteca',
      libraryLocked: 'Únete a la membresía para abrir la biblioteca.',
      planProgress: 'del plan completado',
      streak: 'Registros este mes',
      quickActions: 'Acciones rápidas',
      logEntry: 'Registrar Entrada',
      dateFormat: 'long',
      eyebrow: 'Hoy',
      nextSession: 'Próxima sesión',
      noUpcoming: 'Aún no tienes sesiones próximas',
      book: 'Reservar Sesión',
      allSessions: 'Todas las Sesiones',
      currentPlan: 'Plan actual',
      noPlan: 'Aún no tienes un plan asignado',
      planLocked: 'Se desbloquea con coaching',
      viewPlan: 'Ver Plan',
      weeks: 'semanas',
      todaysFuel: 'Tu nutrición de hoy',
      noFuel: 'Aún no hay objetivos',
      viewNutrition: 'Ver Nutrición',
      kcal: 'kcal / día',
      latestWeight: 'Peso reciente',
      noProgress: 'Aún no hay registros',
      startTracking: 'Empezar a Registrar',
      viewProgress: 'Ver Progreso',
      entries: 'registros',
      daysAway: 'días',
      sinceLast: 'desde el último registro',
    },
    loading: 'Cargando…',
    offlineNotice:
      'El portal no pudo conectar con el servidor. Algunos datos pueden no estar disponibles ahora.',
  },

  icons: {
    shield: ShieldCheck,
    users: Users,
    repeat: Repeat,
  },
}

export default es
