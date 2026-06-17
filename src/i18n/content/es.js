/* =============================================================================
   DELUXFIT BY ANGIE — CONTENIDO EN ESPAÑOL (es)
   -----------------------------------------------------------------------------
   Equivalente en español del árbol en `./en.js`. Precios, características y
   lenguaje de servicio respetan EXACTAMENTE el plan del cliente:

     1. Membresía de Fitness — $14.99 al mes
     2. Coaching Online Personalizado — $150 al mes
     3. Entrenamiento Online 1 a 1 en Vivo — $50 por sesión (45–60 min)

   El entrenamiento presencial ($75/sesión) solo se muestra como "Muy Pronto" —
   no es reservable ni se describe como activo.

   Reglas duras: nunca anunciar coaching diario, check-ins semanales, mensajería
   ilimitada, resultados garantizados, planes de comida personalizados, ni nada
   fuera de los tres servicios activos. Coaching Online incluye un check-in
   MENSUAL y una revisión de progreso MENSUAL; nutrición es únicamente "guía
   básica de nutrición" — nunca un plan de comidas.
   ========================================================================== */

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
  Instagram,
  Library,
  Home,
  Building2,
  MonitorPlay,
  HandHeart,
  GraduationCap,
  HeartPulse,
} from 'lucide-react'

const services = {
  membership: {
    id: 'membership',
    slug: 'membership',
    href: '/membership',
    eyebrow: 'Servicio 01',
    name: 'Membresía de Fitness',
    tagline: 'Entrenamiento auto-guiado, a tu ritmo.',
    price: '$14.99',
    period: '/ mes',
    summary:
      'Acceso económico a programas de entrenamiento, biblioteca de ejercicios y educación fitness — sin coaching personalizado.',
    bestFor:
      'Ideal para personas que quieren acceso económico a programas de entrenamiento y educación fitness sin coaching personalizado.',
    includes: [
      'Biblioteca de entrenamientos',
      'Demostraciones de ejercicios',
      'Rutinas para casa y gimnasio',
      'Contenido educativo de fitness',
      'Recursos de guía básica de nutrición',
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
    eyebrow: 'Servicio 02',
    name: 'Coaching Online Personalizado',
    tagline: 'Un programa hecho para ti — guiado por Angie.',
    price: '$150',
    period: '/ mes',
    summary:
      'Coaching online personalizado diseñado en torno a tus metas, nivel, estilo de vida y experiencia.',
    bestFor:
      'Ideal para clientes que quieren un plan estructurado y guía profesional sin sesiones en vivo.',
    includes: [
      'Evaluación inicial de onboarding',
      'Plan de entrenamiento personalizado',
      '4 programas semanales por mes',
      'Programación según tu meta (pérdida de grasa, ganancia muscular, fuerza, fitness general)',
      'Revisión de progreso mensual',
      'Check-in mensual',
      'Ajustes al programa cuando sea necesario',
      'Guía básica de nutrición',
    ],
    responsibilities: [
      'Completar los entrenamientos por tu cuenta',
      'Llevar registro de tu progreso',
      'Enviar fotos y actualizaciones de progreso cada mes',
    ],
    ctaLabel: 'Aplicar Ahora',
    ctaHref: '/online-coaching#apply',
    cardCta: 'Aplicar Ahora',
  },
  oneOnOne: {
    id: 'one-on-one',
    slug: 'training',
    href: '/training',
    eyebrow: 'Servicio 03',
    name: 'Entrenamiento Online 1 a 1 en Vivo',
    tagline: 'Entrenamiento personal virtual en vivo con Angie.',
    price: '$50',
    period: '/ sesión',
    sessionLength: '45–60 minutos por sesión',
    summary:
      'Entrenamiento personal virtual en vivo donde Angie trabaja contigo directamente durante la sesión — coaching en tiempo real, corrección de ejercicios y acompañamiento.',
    bestFor:
      'Ideal para clientes que quieren coaching directo e interacción real durante su entrenamiento.',
    includes: [
      'Sesión por video en vivo',
      'Coaching en tiempo real',
      'Corrección de ejercicios',
      'Motivación y acompañamiento',
      'Sesión personalizada',
      'Instrucción según tu meta',
    ],
    ctaLabel: 'Reservar Sesión',
    ctaHref: '/training#book',
    cardCta: 'Reservar Sesión',
  },
  inPerson: {
    id: 'in-person',
    name: 'Entrenamiento Personal Presencial',
    price: '$75',
    period: '/ sesión',
    sessionLength: '45–60 minutos por sesión',
    summary:
      'Entrenamiento personal presencial con Angie. Próximamente — todavía no se puede reservar.',
    status: 'Muy Pronto',
  },
}

const es = {
  meta: {
    title: 'DeluxFit by Angie — Coaching Online de Fitness y Entrenamiento 1 a 1',
    description:
      'DeluxFit by Angie ofrece membresía de fitness por $14.99/mes, coaching online personalizado por $150/mes y sesiones de entrenamiento 1 a 1 en vivo por $50 con la entrenadora personal certificada Angie.',
  },

  brand: {
    name: 'DELUXFIT',
    fullName: 'DeluxFit by Angie',
    tagline: 'Coaching de fitness personalizado, diseñado alrededor de tu vida.',
  },

  nav: [
    { label: 'Inicio', href: '/' },
    { label: 'Sobre Angie', href: '/about' },
    { label: 'Membresía', href: '/membership' },
    { label: 'Coaching Online', href: '/online-coaching' },
    { label: 'Entrenamiento 1 a 1', href: '/training' },
    { label: 'Testimonios', href: '/testimonials' },
    { label: 'Contacto', href: '/contact' },
  ],

  header: {
    primaryCta: 'Aplicar Ahora',
    primaryCtaHref: '/online-coaching#apply',
    clientLogin: 'Acceso Clientes',
    clientLoginAria: 'Portal de acceso para clientes',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    primaryNavLabel: 'Principal',
    mobileNavLabel: 'Móvil',
    mobileDialogLabel: 'Navegación móvil',
  },

  language: {
    label: 'Idioma',
    english: 'Inglés',
    spanish: 'Español',
    switchToEnglish: 'Cambiar a inglés',
    switchToSpanish: 'Cambiar a español',
  },

  services,

  home: {
    hero: {
      badge: 'Aceptando nuevos clientes online',
      headline: ['Entrenamiento personalizado', 'diseñado para', 'tus metas.'],
      subhead:
        'DeluxFit by Angie es coaching online de fitness personalizado y entrenamiento 1 a 1 en vivo con la entrenadora personal certificada Angie — pensado para quien quiere un programa diseñado alrededor de sus metas, su agenda y su experiencia.',
      primaryCta: 'Ver los programas',
      primaryCtaHref: '#programs',
      secondaryCta: 'Aplicar a Coaching',
      secondaryCtaHref: '/online-coaching#apply',
      trust: {
        pillarValue: '1:1',
        pillarLabel: 'coaching personalizado',
        tagline: 'Membresía · Coaching Online · 1 a 1 en vivo',
      },
      imageAlt: 'Angie en sentadilla en una máquina Smith, vista desde atrás',
    },

    intro: {
      eyebrow: 'Conoce a Angie',
      heading: 'Una coach que construye el programa alrededor de la persona — no al revés.',
      accent: 'alrededor de la persona',
      body: [
        'Soy Angie — entrenadora personal certificada. Ayudo a personas a volverse más fuertes, más constantes y más seguras con un coaching que se adapta a su vida real.',
        'Ya sea que quieras una membresía auto-guiada, un programa totalmente personalizado o sesiones en vivo por video conmigo, todo lo que ofrezco lo entrego directamente yo — sin plantillas, sin programas reciclados, sin adivinanzas.',
      ],
      ctaLabel: 'Lee mi historia',
      ctaHref: '/about',
      imageAlt: 'Angie acompañando a una clienta en una serie de prensa de piernas',
    },

    servicesSection: {
      eyebrow: 'Elige cómo trabajamos juntos',
      heading: 'Tres formas de entrenar con DeluxFit by Angie.',
      accent: 'Tres formas',
      subhead:
        'Membresía auto-guiada, coaching online personalizado o sesiones 1 a 1 en vivo por video — elige el nivel de apoyo que se ajusta a donde estás hoy.',
    },

    transformationCallout: {
      eyebrow: 'Así se ve',
      heading: 'Coaching real, hecho para la vida real — no para el feed perfecto.',
      accent: 'vida real',
      body: 'Las historias y fotos de transformación de clientes aparecen en la página de testimonios a medida que las clientas terminan sus programas. Mientras tanto, esto es alrededor de lo que se construye cada programa DeluxFit.',
      pillars: [
        {
          icon: Dumbbell,
          title: 'Entrenamiento real',
          description:
            'Programación diseñada según tu meta — pérdida de grasa, ganancia muscular, fuerza o fitness general — no una plantilla genérica.',
        },
        {
          icon: HeartPulse,
          title: 'Guía real',
          description:
            'Guía básica de nutrición y coaching enfocado en técnica para que el esfuerzo que pones realmente te haga avanzar.',
        },
        {
          icon: HandHeart,
          title: 'Apoyo real',
          description:
            'Acceso directo a mí en cada programa — check-ins mensuales en coaching, coaching en vivo en sesiones de entrenamiento.',
        },
      ],
      ctaLabel: 'Ver historias',
      ctaHref: '/testimonials',
    },

    closing: {
      eyebrow: '¿Lista para empezar?',
      heading: 'Elige el programa que encaja contigo.',
      accent: 'encaja contigo',
      subhead:
        'Suscríbete a la membresía, aplica al coaching personalizado o reserva una sesión 1 a 1 en vivo — y arrancamos desde ahí.',
      primaryCta: 'Aplicar a Coaching',
      primaryCtaHref: '/online-coaching#apply',
      secondaryCta: 'Reservar Sesión',
      secondaryCtaHref: '/training#book',
    },
  },

  about: {
    hero: {
      eyebrow: 'Sobre Angie',
      heading: 'Hola, soy Angie — y construí DeluxFit para entrenar a personas como yo siempre quise que me entrenaran.',
      accent: 'entrenar a personas como yo siempre quise que me entrenaran',
      tagline: 'Entrenadora Personal Certificada · Online y en vivo',
      imageAlt: 'Angie acompañando a una clienta en una serie de prensa de piernas',
    },
    story: {
      eyebrow: 'Mi historia',
      heading: 'De entrenarme a mí, a entrenar a otras personas.',
      accent: 'entrenar a otras personas',
      paragraphs: [
        'El fitness ha sido parte de mi vida desde que tengo memoria. Lo que empezó como algo personal se convirtió en carrera — porque vi a amigas, familia y desconocidos recibir programas genéricos que ignoraban sus metas, sus cuerpos y la vida que realmente vivían.',
        'Por eso creé DeluxFit by Angie: para hacer lo contrario. Entrenamiento que se moldea alrededor de la persona, con coaching real, acompañamiento real y una estructura que puedes mantener — entrenes en un gimnasio completo o en tu sala.',
        'Ya sea que apenas estés empezando o estés regresando después de un buen rato, no necesitas otro plan genérico. Necesitas a una coach que de verdad te preste atención.',
      ],
    },
    credentials: {
      eyebrow: 'Certificaciones y experiencia',
      heading: 'Formada para entrenar, certificada para liderar.',
      accent: 'certificada para liderar',
      note: 'Logos y números detallados de certificación serán añadidos por Angie como parte de la revisión pública del sitio.',
      items: [
        'Entrenadora Personal Certificada',
        'Educación continua en fuerza y acondicionamiento',
        'Años de experiencia entrenando online y de manera presencial',
        'Experiencia programando para pérdida de grasa, ganancia muscular, fuerza y fitness general',
      ],
    },
    philosophy: {
      eyebrow: 'Filosofía de coaching',
      heading: 'Personalizado, profesional, sostenible.',
      accent: 'sostenible',
      pillars: [
        {
          icon: ClipboardCheck,
          title: 'Hecho para ti',
          description:
            'Cada programa se forma alrededor de tus metas, tu nivel, tu estilo de vida y tu experiencia — nunca un plan genérico sacado de una plantilla.',
        },
        {
          icon: GraduationCap,
          title: 'Coaching, no adivinanza',
          description:
            'Recibes el plan Y la explicación — por qué esos ejercicios, esa estructura, esa progresión. La meta es que cada mes salgas más informada e independiente.',
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
        'Explora la membresía, aplica al coaching personalizado o reserva una sesión 1 a 1 en vivo por video.',
      primary: { label: 'Ver los programas', href: '/#programs' },
      secondary: { label: 'Contactar a Angie', href: '/contact' },
    },
  },

  membership: {
    hero: {
      eyebrow: 'Servicio 01 · Membresía de Fitness',
      heading: 'Una membresía hecha para el entrenamiento auto-guiado.',
      accent: 'entrenamiento auto-guiado',
      subhead:
        'Por $14.99 al mes tienes acceso a una biblioteca creciente de programas de entrenamiento, demostraciones de ejercicios, contenido educativo de fitness y recursos de guía básica de nutrición — a tu ritmo.',
      primaryCta: 'Suscribirme — $14.99 / mes',
      primaryCtaHref: '#sign-up',
      secondaryCta: 'Comparar programas',
      secondaryCtaHref: '/#programs',
    },
    includesEyebrow: 'Qué incluye',
    includesHeading: 'Todo lo que necesitas para entrenar con constancia.',
    includesAccent: 'entrenar con constancia',
    includes: [
      {
        icon: Library,
        title: 'Biblioteca de entrenamientos',
        description:
          'Un catálogo creciente de programas que puedes seguir a tu propio ritmo.',
      },
      {
        icon: PlayCircle,
        title: 'Demostraciones de ejercicios',
        description:
          'Demostraciones en video de cada movimiento para que la técnica quede clara antes de empezar.',
      },
      {
        icon: Home,
        title: 'Rutinas para casa y gimnasio',
        description:
          'Rutinas para lo que tengas — entrenamientos en casa con poco equipo o sesiones completas en el gimnasio.',
      },
      {
        icon: GraduationCap,
        title: 'Contenido educativo de fitness',
        description:
          'Lecciones cortas y prácticas que explican el porqué del entrenamiento, no solo el qué.',
      },
      {
        icon: Apple,
        title: 'Recursos de guía básica de nutrición',
        description:
          'Recursos educativos de nutrición para construir hábitos sostenibles junto a tu entrenamiento.',
      },
      {
        icon: Sparkles,
        title: 'Contenido nuevo añadido regularmente',
        description:
          'La biblioteca crece con el tiempo para que tu entrenamiento siga vigente.',
      },
    ],
    bestFor: {
      eyebrow: 'Para quién es',
      heading: 'Ideal para personas que quieren acceso económico a programas y educación fitness — sin coaching personalizado.',
      accent: 'sin coaching personalizado',
      body: 'Si eres auto-motivada y quieres una biblioteca estructurada para entrenar, la membresía es la forma más económica de entrenar con DeluxFit. Para un programa personalizado, mira Coaching Online. Para sesiones en vivo en tiempo real con Angie, mira Entrenamiento 1 a 1.',
    },
    signupSection: {
      id: 'sign-up',
      eyebrow: 'Suscríbete',
      heading: 'Comienza la membresía — $14.99 / mes.',
      accent: '$14.99 / mes',
      body: 'Suscríbete abajo y Angie te enviará los detalles de acceso. Cancela cuando quieras.',
    },
  },

  coaching: {
    hero: {
      eyebrow: 'Servicio 02 · Coaching Online Personalizado',
      heading: 'Coaching online personalizado, diseñado alrededor de ti.',
      accent: 'diseñado alrededor de ti',
      subhead:
        'Por $150 al mes recibes coaching online personalizado construido alrededor de tus metas, tu nivel, tu estilo de vida y tu experiencia — con un programa personalizado, check-in mensual y revisión mensual de progreso.',
      primaryCta: 'Aplicar Ahora',
      primaryCtaHref: '#apply',
      secondaryCta: 'Comparar programas',
      secondaryCtaHref: '/#programs',
    },
    includesEyebrow: 'Qué incluye',
    includesHeading: 'Todo lo que necesitas — hecho para ti, ajustado conforme avanzas.',
    includesAccent: 'ajustado conforme avanzas',
    includes: [
      {
        icon: ClipboardCheck,
        title: 'Evaluación inicial de onboarding',
        description:
          'Empezamos con una evaluación completa de tus metas, historial de entrenamiento, agenda y limitaciones.',
      },
      {
        icon: Dumbbell,
        title: 'Plan de entrenamiento personalizado',
        description:
          'Un programa diseñado específicamente para ti — no una plantilla — basado en la evaluación inicial.',
      },
      {
        icon: CalendarCheck,
        title: '4 programas semanales por mes',
        description:
          'Cada mes recibes cuatro programas semanales estructurados para progresar a lo largo del mes.',
      },
      {
        icon: Sparkles,
        title: 'Programación según tu meta',
        description:
          'Programación para pérdida de grasa, ganancia muscular, fuerza o fitness general — según tu meta.',
      },
      {
        icon: LineChart,
        title: 'Revisión de progreso mensual',
        description:
          'Cada mes revisamos juntas tu progreso para ver qué funciona y qué ajustar.',
      },
      {
        icon: Video,
        title: 'Check-in mensual',
        description:
          'Un check-in agendado al mes para revisar el entrenamiento, resolver dudas y afinar el plan.',
      },
      {
        icon: ClipboardCheck,
        title: 'Ajustes al programa cuando sea necesario',
        description:
          'Tu programa se actualiza con base en la revisión mensual para que siga moviéndose contigo.',
      },
      {
        icon: Apple,
        title: 'Guía básica de nutrición',
        description:
          'Orientación nutricional general y sostenible para apoyar tu entrenamiento — sin planes de comida.',
      },
    ],
    responsibilities: {
      eyebrow: 'Responsabilidades del cliente',
      heading: 'Lo que tú aportas al programa.',
      accent: 'tú aportas',
      body: 'El coaching online funciona mejor cuando ambas partes cumplen lo suyo. Tu parte se ve así:',
      items: [
        'Completar los entrenamientos por tu cuenta',
        'Llevar registro de tu progreso',
        'Enviar fotos y actualizaciones de progreso cada mes',
      ],
    },
    bestFor: {
      eyebrow: 'Para quién es',
      heading: 'Ideal para clientes que quieren un plan estructurado y guía profesional — sin sesiones en vivo.',
      accent: 'sin sesiones en vivo',
      body: 'Si quieres un programa hecho específicamente para ti que puedas seguir por tu cuenta, con coaching mensual de Angie, Coaching Online es la opción. Si además quieres coaching en vivo, suma o cambia a Entrenamiento 1 a 1.',
    },
    applicationSection: {
      id: 'apply',
      eyebrow: 'Aplica al coaching',
      heading: 'Cuéntale a Angie sobre tus metas.',
      accent: 'tus metas',
      body: 'Llena la aplicación de abajo. Angie revisa cada una personalmente y responde con los siguientes pasos.',
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
        name: { label: 'Nombre completo', placeholder: 'Tu nombre', required: true },
        email: { label: 'Correo electrónico', placeholder: 'tu@ejemplo.com', required: true },
        phone: { label: 'Teléfono (opcional)', placeholder: '(555) 555-5555' },
        age: { label: 'Edad', placeholder: '30', required: true },
        location: { label: 'Ciudad / ubicación', placeholder: 'Ciudad, Estado' },
        goal: {
          label: 'Meta principal',
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
          label: 'Experiencia de entrenamiento',
          placeholder: 'Selecciona tu nivel',
          required: true,
          options: [
            'Principiante total — nunca he entrenado con constancia',
            'Principiante — entreno ocasionalmente',
            'Intermedio — he entrenado con constancia 1+ año',
            'Avanzado — varios años de entrenamiento estructurado',
          ],
        },
        equipment: {
          label: '¿A qué equipo tienes acceso?',
          placeholder:
            'Gimnasio completo, mancuernas en casa, solo peso corporal, etc.',
          required: true,
        },
        availability: {
          label: '¿Cuántos días por semana puedes entrenar?',
          placeholder: 'ej. 3–4 días',
          required: true,
        },
        notes: {
          label: '¿Algo más que Angie deba saber?',
          placeholder:
            'Lesiones, condiciones médicas, restricciones de horario, metas específicas…',
        },
        consent: {
          label:
            'Entiendo que esto es una aplicación — Angie la revisará y me escribirá antes de cobrar.',
          required: true,
        },
      },
    },
  },

  training: {
    hero: {
      eyebrow: 'Servicio 03 · Entrenamiento Online 1 a 1 en Vivo',
      heading: 'Entrenamiento personal virtual en vivo — directamente con Angie.',
      accent: 'directamente con Angie',
      subhead:
        '$50 por sesión, 45–60 minutos por sesión. Sesiones por video en vivo donde Angie trabaja directamente contigo — coaching en tiempo real, corrección de ejercicios, motivación y acompañamiento en cada sesión.',
      primaryCta: 'Reservar Sesión',
      primaryCtaHref: '#book',
      secondaryCta: 'Comparar programas',
      secondaryCtaHref: '/#programs',
    },
    includesEyebrow: 'Qué incluye',
    includesHeading: 'Coaching directo, en video, en tiempo real.',
    includesAccent: 'en tiempo real',
    includes: [
      {
        icon: Video,
        title: 'Sesión por video en vivo',
        description:
          'Una sesión en cámara y en tiempo real — Angie está contigo durante todo el entrenamiento.',
      },
      {
        icon: HandHeart,
        title: 'Coaching en tiempo real',
        description:
          'Coaching mientras entrenas: tempo, señales, intensidad, descansos — todo guiado en vivo.',
      },
      {
        icon: ClipboardCheck,
        title: 'Corrección de ejercicios',
        description:
          'Angie observa tu técnica y la corrige sobre la marcha para que cada repetición cuente.',
      },
      {
        icon: Sparkles,
        title: 'Motivación y acompañamiento',
        description:
          'Sin saltarte repeticiones ni series a medias — el acompañamiento es parte de la sesión.',
      },
      {
        icon: Dumbbell,
        title: 'Sesión personalizada',
        description:
          'Cada sesión se arma alrededor de lo que estás trabajando y el equipo que tienes.',
      },
      {
        icon: MonitorPlay,
        title: 'Instrucción según tu meta',
        description:
          'Las sesiones se construyen según tu meta — pérdida de grasa, ganancia muscular, fuerza o fitness general.',
      },
    ],
    sessionDetails: {
      eyebrow: 'Detalles de la sesión',
      length: '45–60 minutos por sesión',
      price: '$50 por sesión',
      bestFor:
        'Ideal para clientes que quieren coaching directo e interacción real durante su entrenamiento.',
    },
    bookSection: {
      id: 'book',
      eyebrow: 'Reservar sesión',
      heading: 'Elige un horario y entrena con Angie en vivo.',
      accent: 'en vivo',
      body: 'Llena la solicitud abajo con algunos horarios que te funcionen. Angie confirma por correo y te envía el enlace seguro de video.',
    },
    booking: {
      submitLabel: 'Solicitar Sesión',
      submittingLabel: 'Enviando…',
      successHeading: 'Solicitud recibida.',
      successBody:
        'Gracias — Angie te contactará para confirmar tu sesión y compartir el enlace seguro de video.',
      errorBody:
        'Algo salió mal al enviar tu solicitud. Inténtalo de nuevo o escríbele directamente desde la página de Contacto.',
      fields: {
        name: { label: 'Nombre completo', placeholder: 'Tu nombre', required: true },
        email: { label: 'Correo electrónico', placeholder: 'tu@ejemplo.com', required: true },
        phone: { label: 'Teléfono (opcional)', placeholder: '(555) 555-5555' },
        timezone: {
          label: 'Zona horaria',
          placeholder: 'ej. EST, PST, CST, MX',
          required: true,
        },
        availability: {
          label: 'Horarios preferidos',
          placeholder:
            'Lista algunos días / horarios (ej. Mar 7am EST, Mié 6pm EST)',
          required: true,
        },
        goal: {
          label: 'En qué quieres trabajar',
          placeholder:
            'Corrección de técnica, programación, fuerza, pérdida de grasa, empezar de cero, etc.',
          required: true,
        },
        equipment: {
          label: 'Equipo disponible',
          placeholder: 'Gimnasio completo, mancuernas, solo peso corporal, etc.',
        },
        notes: {
          label: '¿Algo más que Angie deba saber?',
          placeholder: 'Lesiones, nivel de experiencia, preocupaciones específicas…',
        },
      },
    },
  },

  testimonials: {
    hero: {
      eyebrow: 'Historias de clientes',
      heading: 'Clientes reales, progreso real.',
      accent: 'progreso real',
      subhead:
        'Las historias de éxito, reseñas y fotos de transformación aparecerán aquí a medida que las clientas de Angie terminen sus programas. Las tarjetas de abajo son ejemplos provisionales hasta que se sume el contenido real.',
    },
    placeholderNote:
      'Contenido provisional — las historias reales aparecerán aquí a medida que las clientas terminen sus programas.',
    items: [
      {
        metric: 'Muy pronto',
        quote:
          'Las historias de éxito de clientas vivirán aquí. Ellas contarán qué cambió, qué aprendieron y cómo lo sostuvieron.',
        name: 'Cliente futura',
        result: 'Historia real próximamente',
        rating: 5,
      },
      {
        metric: 'Muy pronto',
        quote:
          'Esta es una tarjeta provisional. Cuando las clientas terminen sus programas, sus palabras y resultados estarán aquí en su propia voz.',
        name: 'Cliente futura',
        result: 'Historia real próximamente',
        rating: 5,
      },
      {
        metric: 'Muy pronto',
        quote:
          'Las reseñas se reservan únicamente para clientes reales. No inventamos testimonios — lo que aparezca aquí será genuino.',
        name: 'Cliente futura',
        result: 'Historia real próximamente',
        rating: 5,
      },
    ],
    galleryEyebrow: 'Transformaciones',
    galleryHeading: 'Galería antes y después.',
    galleryAccent: 'antes y después',
    galleryNote:
      'Fotos de transformación muy pronto — se muestran imágenes provisionales hasta que Angie sume contenido real.',
    gallery: [
      { label: 'Muy pronto', alt: 'Marcador de transformación antes y después' },
      { label: 'Muy pronto', alt: 'Marcador de transformación antes y después' },
      { label: 'Muy pronto', alt: 'Marcador de transformación antes y después' },
      { label: 'Muy pronto', alt: 'Marcador de transformación antes y después' },
      { label: 'Muy pronto', alt: 'Marcador de transformación antes y después' },
      { label: 'Muy pronto', alt: 'Marcador de transformación antes y después' },
    ],
    cta: {
      heading: '¿Quieres ser una de las historias reales?',
      accent: 'historias reales',
      subhead:
        'Elige un programa y empieza. Tu transformación puede ser la siguiente que destaquemos aquí — con tu permiso.',
      primary: { label: 'Aplicar a Coaching', href: '/online-coaching#apply' },
      secondary: { label: 'Reservar Sesión', href: '/training#book' },
    },
  },

  contact: {
    hero: {
      eyebrow: 'Contacto',
      heading: 'Ponte en contacto con Angie.',
      accent: 'con Angie',
      subhead:
        '¿Dudas sobre la membresía, el coaching online o las sesiones 1 a 1 en vivo? Envía un mensaje abajo — Angie lee y responde cada uno personalmente.',
    },
    socialEyebrow: 'Sigue a Angie',
    socialHeading: 'Redes sociales',
    form: {
      submitLabel: 'Enviar Mensaje',
      submittingLabel: 'Enviando…',
      successHeading: 'Mensaje enviado.',
      successBody:
        'Gracias por escribir — Angie te contestará por correo en cuanto pueda.',
      errorBody:
        'Algo salió mal al enviar tu mensaje. Inténtalo de nuevo en un momento o escríbele en redes.',
      fields: {
        name: { label: 'Tu nombre', placeholder: 'Tu nombre', required: true },
        email: { label: 'Correo electrónico', placeholder: 'tu@ejemplo.com', required: true },
        topic: {
          label: '¿De qué se trata?',
          placeholder: 'Elige un tema',
          required: true,
          options: [
            'Pregunta de membresía',
            'Pregunta de coaching online',
            'Pregunta de entrenamiento 1 a 1',
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
    eyebrow: 'Programas',
    heading: 'Elige el nivel de apoyo que encaja.',
    accent: 'nivel de apoyo',
    subhead:
      'Tres servicios activos y uno muy pronto. Precios y características exactos — nada escondido.',
  },

  inPerson: {
    eyebrow: 'Muy pronto',
    title: 'Entrenamiento Personal Presencial',
    price: '$75 / sesión',
    sessionLength: '45–60 minutos por sesión',
    summary:
      'Entrenamiento personal presencial con Angie. Próximamente — todavía no se puede reservar.',
    icon: Building2,
  },

  footer: {
    blurb:
      'Coaching de fitness personalizado y entrenamiento 1 a 1 en vivo con la entrenadora personal certificada Angie.',
    navLabel: 'Pie de página',
    rightsReserved: 'Todos los derechos reservados.',
    socials: [
      { label: 'Instagram', href: 'https://instagram.com/REPLACE_ME', icon: Instagram },
      { label: 'TikTok', href: 'https://tiktok.com/@REPLACE_ME', icon: 'tiktok' },
    ],
    smallPrint:
      'Los resultados varían. DeluxFit by Angie ofrece coaching de fitness con fines educativos y no sustituye el consejo médico. Consulta a tu médico antes de iniciar cualquier programa de ejercicio o nutrición.',
  },

  portal: {
    backToSite: 'Volver al sitio',
    backToHome: 'Volver a DeluxFit',
    comingSoon: 'Muy pronto',
    headingLines: ['Portal', 'Clientes'],
    blurb:
      'Un espacio exclusivo para clientes actuales de DeluxFit llega muy pronto.',
    signInHint: '¿Ya eres clienta? Inicia sesión aquí cuando lancemos.',
  },

  icons: {
    shield: ShieldCheck,
    users: Users,
  },
}

export default es
