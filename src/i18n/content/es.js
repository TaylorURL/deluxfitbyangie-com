/* =============================================================================
   DELUXFIT BY ANGIE — CONTENIDO EN ESPAÑOL (es)
   -----------------------------------------------------------------------------
   Equivalente en español del árbol en `./en.js`. Precios, características y
   lenguaje de servicio respetan EXACTAMENTE el modelo de negocio finalizado:

     1. Membresía Delux Fit              — $14.99 / mes  (general, NO personalizado)
     2. Coaching Online Personalizado    — $150 / mes
     3. Sesión de Entrenamiento en Vivo   — $75 / sesión (45–60 min, prueba única)
     4. Programa de Entrenamiento en Vivo — $50 / sesión (continuo, Zoom)
     5. Entrenamiento Presencial Futuro   — Desde $75 / sesión — MUY PRONTO

   Los servicios 3 y 4 son DOS productos distintos: el #3 es una sesión de
   prueba única de $75, el #4 es el programa continuo de $50/sesión. Cada clave
   aquí debe existir en `./en.js`.
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
    eyebrow: 'Servicio 01',
    name: 'Membresía Delux Fit',
    tagline: 'Contenido general de fitness para todos — a tu ritmo.',
    price: '$14.99',
    period: '/ mes',
    summary:
      'Membresía de nivel inicial con acceso a contenido general (no personalizado) de fitness y recursos educativos pensados para el público.',
    notPersonalizedNote: 'Este contenido es general y NO está personalizado.',
    bestFor:
      'Ideal para personas que quieren acceso económico a programas de entrenamiento y educación fitness — sin coaching personalizado.',
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
    eyebrow: 'Servicio 02',
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
      'Toda la comunicación ocurre dentro de la plataforma Delux Fit — no hay acceso telefónico personal. El tiempo de respuesta es de hasta 72 horas hábiles.',
    responseTime: 'Tiempo de respuesta: hasta 72 horas hábiles',
    ctaLabel: 'Aplicar Ahora',
    ctaHref: '/online-coaching#apply',
    cardCta: 'Aplicar Ahora',
  },
  singleSession: {
    id: 'single-session',
    slug: 'single-session',
    href: '/single-session',
    eyebrow: 'Servicio 03',
    name: 'Sesión de Entrenamiento en Vivo',
    tagline: 'Una sesión privada en vivo, una sola vez, con Angie.',
    price: '$75',
    period: '/ sesión',
    sessionLength: '45–60 minutos',
    summary:
      'Una sesión privada virtual en vivo, una sola vez, con Angie — perfecta para probar Delux Fit antes de comprometerte.',
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
    eyebrow: 'Servicio 04',
    name: 'Programa de Entrenamiento Personal en Vivo',
    tagline: 'Entrenamiento en vivo continuo — lo más cercano a lo presencial.',
    price: '$50',
    period: '/ sesión',
    summary:
      'Entrenamiento personal en vivo y continuo por Zoom con Angie presente durante toda la sesión — la experiencia más cercana al entrenamiento presencial.',
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
  inPerson: {
    id: 'in-person',
    name: 'Entrenamiento Presencial Futuro',
    price: 'Desde $75',
    period: '/ sesión',
    summary:
      'Sesiones privadas presenciales con Angie. No disponible en el lanzamiento — se podrá sumar a medida que Delux Fit crezca.',
    status: 'Muy Pronto',
  },
}

const es = {
  meta: {
    title: 'DeluxFit by Angie — Coaching Online, Membresías y Entrenamiento en Vivo',
    description:
      'DeluxFit by Angie ofrece una membresía de fitness por $14.99/mes, coaching online personalizado por $150/mes, sesiones de entrenamiento en vivo por $75 y un programa de entrenamiento personal en vivo por $50/sesión con la entrenadora personal certificada Angie.',
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
      slogan: 'DISCIPLINA SOBRE EXCUSAS',
      headline: ['Disciplina', 'sobre', 'excusas.'],
      subhead:
        'Delux Fit ayuda a sus clientes a alcanzar sus metas de fitness a través de disciplina, acompañamiento, educación y coaching personalizado — desde membresías hasta entrenamiento 1 a 1 en vivo con la entrenadora personal certificada Angie.',
      primaryCta: 'Ver los programas',
      primaryCtaHref: '#programs',
      secondaryCta: 'Aplicar a Coaching',
      secondaryCtaHref: '/online-coaching#apply',
      trust: {
        pillarValue: '1:1',
        pillarLabel: 'coaching personalizado',
        tagline: 'Membresía · Coaching · Entrenamiento en vivo',
      },
      imageAlt: 'Angie en sentadilla en una máquina Smith, vista desde atrás',
    },

    intro: {
      eyebrow: 'Conoce a Angie',
      heading: 'Una coach que construye el programa alrededor de la persona — no al revés.',
      accent: 'alrededor de la persona',
      body: [
        'Soy Angie — entrenadora personal certificada. Ayudo a personas a volverse más fuertes, más constantes y más seguras con disciplina, acompañamiento, educación y un coaching que se adapta a su vida real.',
        'Ya sea que quieras contenido de membresía general, un programa totalmente personalizado o sesiones en vivo por video conmigo, todo lo que ofrezco lo entrego directamente yo — sin plantillas, sin programas reciclados, sin adivinanzas.',
      ],
      ctaLabel: 'Lee mi historia',
      ctaHref: '/about',
      imageAlt: 'Angie acompañando a una clienta en una serie de prensa de piernas',
    },

    servicesSection: {
      eyebrow: 'Elige cómo trabajamos juntos',
      heading: 'Cuatro formas de entrenar con DeluxFit by Angie.',
      accent: 'Cuatro formas',
      subhead:
        'Una membresía general, coaching online personalizado, una sesión en vivo única o un programa de entrenamiento en vivo continuo — elige el nivel de apoyo que se ajusta a donde estás hoy.',
    },

    transformationCallout: {
      eyebrow: 'Sobre qué se construye',
      heading: 'Disciplina, acompañamiento, educación — hecho para la vida real.',
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
            'Guía básica de nutrición, educación fitness y coaching enfocado en técnica para que el esfuerzo que pones realmente te haga avanzar.',
        },
        {
          icon: HandHeart,
          title: 'Acompañamiento real',
          description:
            'Acceso directo a mí dentro de la plataforma — check-ins mensuales en coaching, coaching en vivo en las sesiones, sin excusas.',
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
        'Suscríbete a la membresía, aplica al coaching personalizado o reserva una sesión de entrenamiento en vivo — y arrancamos desde ahí.',
      primaryCta: 'Aplicar a Coaching',
      primaryCtaHref: '/online-coaching#apply',
      secondaryCta: 'Reservar Sesión',
      secondaryCtaHref: '/single-session#book',
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
    mission: {
      eyebrow: 'La misión',
      heading: 'Disciplina sobre excusas.',
      accent: 'sobre excusas',
      body: 'Delux Fit ayuda a sus clientes a alcanzar sus metas de fitness a través de disciplina, acompañamiento, educación y coaching personalizado.',
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
            'Cada programa personalizado se forma alrededor de tus metas, tu nivel, tu estilo de vida y tu experiencia — nunca un plan genérico sacado de una plantilla.',
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
        'Explora la membresía, aplica al coaching personalizado o reserva una sesión en vivo online.',
      primary: { label: 'Ver los programas', href: '/#programs' },
      secondary: { label: 'Contactar a Angie', href: '/contact' },
    },
  },

  membership: {
    hero: {
      eyebrow: 'Servicio 01 · Membresía Delux Fit',
      heading: 'Contenido general de fitness, hecho para el entrenamiento auto-guiado.',
      accent: 'entrenamiento auto-guiado',
      subhead:
        'Por $14.99 al mes tienes acceso a contenido general (no personalizado) de fitness y recursos educativos pensados para el público — programas de entrenamiento, biblioteca de ejercicios, videos de entrenamiento y más.',
      primaryCta: 'Suscribirme — $14.99 / mes',
      primaryCtaHref: '#sign-up',
      secondaryCta: 'Comparar programas',
      secondaryCtaHref: '/#programs',
    },
    notPersonalizedCallout:
      'Esta es una membresía de nivel inicial. El contenido es GENERAL y NO está personalizado. Para un programa hecho a tu medida, mira el Coaching Online Personalizado.',
    includesEyebrow: 'Qué incluye',
    includesHeading: 'Todo lo que necesitas para entrenar con constancia.',
    includesAccent: 'entrenar con constancia',
    includes: [
      {
        icon: Library,
        title: 'Programas de entrenamiento',
        description: 'Un catálogo creciente de programas generales que puedes seguir a tu propio ritmo.',
      },
      {
        icon: Dumbbell,
        title: 'Biblioteca de ejercicios',
        description: 'Una biblioteca de referencia de movimientos para que siempre sepas qué haces y por qué.',
      },
      {
        icon: PlayCircle,
        title: 'Videos de entrenamiento',
        description: 'Demostraciones en video de cada movimiento para que la técnica quede clara antes de empezar.',
      },
      {
        icon: GraduationCap,
        title: 'Educación fitness',
        description: 'Lecciones cortas y prácticas que explican el porqué del entrenamiento, no solo el qué.',
      },
      {
        icon: Apple,
        title: 'Guía general de nutrición',
        description: 'Una guía general de nutrición para construir hábitos sostenibles junto a tu entrenamiento.',
      },
      {
        icon: Zap,
        title: 'Programas de pérdida de grasa',
        description: 'Entrenamiento estructurado de pérdida de grasa que puedes empezar de inmediato.',
      },
      {
        icon: HeartPulse,
        title: 'Programas de ganancia muscular',
        description: 'Programas enfocados en hipertrofia para construir tamaño y fuerza con el tiempo.',
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
      eyebrow: 'Para quién es',
      heading: 'Ideal para personas que quieren acceso económico a programas y educación fitness — sin coaching personalizado.',
      accent: 'sin coaching personalizado',
      body: 'Si eres auto-motivada y quieres una biblioteca estructurada para entrenar, la membresía es la forma más económica de entrenar con DeluxFit. Para un programa personalizado, mira Coaching Online. Para sesiones en vivo en tiempo real con Angie, mira la Sesión en Vivo o el Programa de Entrenamiento Personal en Vivo.',
    },
    signupSection: {
      id: 'sign-up',
      eyebrow: 'Suscríbete',
      heading: 'Comienza la membresía — $14.99 / mes.',
      accent: '$14.99 / mes',
      body: 'Suscríbete abajo para iniciar tu membresía de $14.99/mes y desbloquear la biblioteca de contenido general. Cancela cuando quieras.',
    },
  },

  coaching: {
    hero: {
      eyebrow: 'Servicio 02 · Coaching Online Personalizado',
      heading: 'Coaching online personalizado, diseñado alrededor de ti.',
      accent: 'diseñado alrededor de ti',
      subhead:
        'Por $150 al mes recibes coaching personalizado construido alrededor de tus metas y tu nivel — un plan personalizado, revisiones mensuales, seguimiento de progreso y mensajería directa con Angie dentro de la plataforma.',
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
        title: 'Consulta inicial',
        description: 'Empezamos con una consulta para entender tus metas, tu historial, tu agenda y tus limitaciones.',
      },
      {
        icon: Dumbbell,
        title: 'Plan de entrenamiento personalizado',
        description: 'Un programa diseñado específicamente para ti — no una plantilla — construido alrededor de tus metas y tu nivel.',
      },
      {
        icon: CalendarCheck,
        title: 'Calendario de entrenamiento personalizado',
        description: 'Un calendario de entrenamiento estructurado alrededor de tu semana y tu disponibilidad.',
      },
      {
        icon: LineChart,
        title: 'Revisión de progreso mensual',
        description: 'Cada mes revisamos juntas tu progreso para ver qué funciona y qué ajustar.',
      },
      {
        icon: Video,
        title: 'Check-in mensual',
        description: 'Un check-in agendado al mes para revisar el entrenamiento, resolver dudas y afinar el plan.',
      },
      {
        icon: Target,
        title: 'Seguimiento de progreso',
        description: 'Lleva el registro de tu progreso dentro de la plataforma para que cada ajuste se base en datos reales.',
      },
      {
        icon: MessageSquare,
        title: 'Mensajería directa dentro de la plataforma',
        description: 'Escríbele a Angie directamente dentro de Delux Fit — el único canal de comunicación del coaching.',
      },
      {
        icon: Apple,
        title: 'Guía básica de nutrición',
        description: 'Orientación nutricional general y sostenible para apoyar tu entrenamiento — sin planes de comida.',
      },
      {
        icon: Sparkles,
        title: 'Recomendaciones personalizadas',
        description: 'Recomendaciones según tus metas, tu progreso y el momento en el que estás del programa.',
      },
    ],
    communication: {
      eyebrow: 'Cómo nos comunicamos',
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
      eyebrow: 'Para quién es',
      heading: 'Ideal para clientes que quieren un plan estructurado y guía profesional — sin sesiones en vivo.',
      accent: 'sin sesiones en vivo',
      body: 'Si quieres un programa hecho específicamente para ti que puedas seguir por tu cuenta, con coaching mensual de Angie, Coaching Online es la opción. Si además quieres coaching en vivo, suma una Sesión en Vivo o el Programa de Entrenamiento Personal en Vivo.',
    },
    applicationSection: {
      id: 'apply',
      eyebrow: 'Aplica al coaching',
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
        name: { label: 'Nombre completo', placeholder: 'Tu nombre', required: true },
        email: { label: 'Correo electrónico', placeholder: 'tu@ejemplo.com', required: true },
        phone: { label: 'Teléfono (opcional)', placeholder: '(555) 555-5555' },
        age: { label: 'Edad', placeholder: '30', required: true },
        location: { label: 'Ciudad / ubicación', placeholder: 'Ciudad, Estado' },
        goal: {
          label: 'Meta principal',
          placeholder: 'Selecciona tu meta principal',
          required: true,
          options: ['Pérdida de grasa', 'Ganancia muscular', 'Desarrollo de fuerza', 'Fitness general', 'Otra'],
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
          placeholder: 'Gimnasio completo, mancuernas en casa, solo peso corporal, etc.',
          required: true,
        },
        availability: {
          label: '¿Cuántos días por semana puedes entrenar?',
          placeholder: 'ej. 3–4 días',
          required: true,
        },
        notes: {
          label: '¿Algo más que Angie deba saber?',
          placeholder: 'Lesiones, condiciones médicas, restricciones de horario, metas específicas…',
        },
        consent: {
          label:
            'Entiendo que esto es una aplicación — Angie la revisará y me escribirá antes de cobrar.',
          required: true,
        },
      },
    },
  },

  session: {
    hero: {
      eyebrow: 'Servicio 03 · Sesión de Entrenamiento en Vivo',
      heading: 'Una sesión en vivo única — prueba Delux Fit antes de comprometerte.',
      accent: 'antes de comprometerte',
      subhead:
        '$75 por sesión, 45–60 minutos. Una sesión privada virtual en vivo, una sola vez, con Angie — perfecta para probar Delux Fit, aprender la técnica correcta, corrección de técnica, motivación, preguntas y respuestas, y una experiencia de entrenamiento personalizada.',
      primaryCta: 'Reservar Sesión',
      primaryCtaHref: '#book',
      secondaryCta: 'Comparar programas',
      secondaryCtaHref: '/#programs',
    },
    perfectForEyebrow: 'Perfecta para',
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
    sessionDetails: {
      eyebrow: 'Detalles de la sesión',
      length: '45–60 minutos',
      price: '$75 por sesión',
      bestFor:
        'Una sesión privada virtual en vivo, una sola vez, con Angie. Sin compromiso — reserva una sola sesión y vive Delux Fit de primera mano.',
    },
    bookSection: {
      id: 'book',
      eyebrow: 'Reservar sesión',
      heading: 'Elige una fecha y un horario y entrena con Angie en vivo.',
      accent: 'entrena con Angie en vivo',
      body: 'Selecciona abajo una fecha, un horario, tu enfoque de entrenamiento y tu meta. Tu cita se reserva por el calendario y se confirma automáticamente.',
    },
  },

  training: {
    hero: {
      eyebrow: 'Servicio 04 · Programa de Entrenamiento Personal en Vivo',
      heading: 'Entrenamiento en vivo continuo — lo más cercano a lo presencial.',
      accent: 'lo más cercano a lo presencial',
      subhead:
        '$50 por sesión. Entrenamiento personal en vivo y continuo por Zoom con Angie presente durante toda la sesión — coaching en vivo, correcciones en tiempo real, acompañamiento y una estructura de entrenamiento personalizada cada vez.',
      primaryCta: 'Empezar',
      primaryCtaHref: '#book',
      secondaryCta: 'Comparar programas',
      secondaryCtaHref: '/#programs',
    },
    includesEyebrow: 'Qué incluye',
    includesHeading: 'Coaching en vivo, por Zoom, en tiempo real.',
    includesAccent: 'en tiempo real',
    includes: [
      {
        icon: Video,
        title: 'Coaching en vivo',
        description: 'Una sesión en tiempo real por Zoom — Angie está presente durante todo el entrenamiento.',
      },
      {
        icon: ClipboardCheck,
        title: 'Correcciones en tiempo real',
        description: 'Angie observa tu técnica y la corrige sobre la marcha para que cada repetición cuente.',
      },
      {
        icon: HandHeart,
        title: 'Acompañamiento',
        description: 'Sin saltarte repeticiones ni series a medias — el acompañamiento está en cada sesión.',
      },
      {
        icon: GraduationCap,
        title: 'Guía de ejercicios',
        description: 'Guía de tempo, señales, intensidad y descansos — todo en vivo mientras entrenas.',
      },
      {
        icon: Dumbbell,
        title: 'Estructura de entrenamiento personalizada',
        description: 'Cada sesión se estructura alrededor de tus metas y del equipo que tienes.',
      },
    ],
    recommendation: {
      eyebrow: 'Con qué frecuencia',
      heading: 'Recomendado un mínimo de 3 sesiones por semana.',
      accent: '3 sesiones por semana',
      body: 'Para los mejores resultados recomendamos un mínimo de 3 sesiones por semana. Ejemplo: 3 sesiones/semana = $150/semana. Es continuo — la experiencia más cercana al entrenamiento presencial, desde donde estés.',
    },
    sessionDetails: {
      eyebrow: 'Detalles del programa',
      length: 'Continuo — reserva tantas sesiones como necesites',
      price: '$50 por sesión',
      bestFor:
        'Ideal para clientes que quieren coaching en vivo directo e interacción real durante cada entrenamiento, de forma continua.',
    },
    bookSection: {
      id: 'book',
      eyebrow: 'Reservar sesiones',
      heading: 'Elige tus horarios y entrena con Angie en vivo.',
      accent: 'entrena con Angie en vivo',
      body: 'Selecciona abajo una fecha, un horario, tu enfoque de entrenamiento y tu meta. Reserva una sesión o varias en la semana — recomendamos un mínimo de 3 por semana.',
    },
  },

  booking: {
    selectDateLabel: 'Selecciona una fecha',
    selectTimeLabel: 'Selecciona un horario',
    trainingFocusLabel: 'Enfoque de entrenamiento',
    trainingFocusPlaceholder: 'Selecciona un enfoque',
    fitnessGoalLabel: 'Meta de fitness',
    fitnessGoalPlaceholder: 'Selecciona tu meta',
    nameLabel: 'Nombre completo',
    namePlaceholder: 'Tu nombre',
    emailLabel: 'Correo electrónico',
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
      'La reserva en vivo se activa cuando el calendario quede conectado. Tu selección quedó registrada y Angie confirmará por correo.',
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
    fitnessGoalOptions: ['Pérdida de grasa', 'Ganancia muscular', 'Desarrollo de fuerza', 'Fitness general', 'Otra'],
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
      secondary: { label: 'Reservar Sesión', href: '/single-session#book' },
    },
  },

  contact: {
    hero: {
      eyebrow: 'Contacto',
      heading: 'Ponte en contacto con Angie.',
      accent: 'con Angie',
      subhead:
        '¿Dudas sobre la membresía, el coaching online o el entrenamiento en vivo? Envía un mensaje abajo — Angie lee y responde cada uno personalmente. (Los clientes activos de coaching se comunican dentro de la plataforma Delux Fit.)',
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
    eyebrow: 'Programas',
    heading: 'Elige el nivel de apoyo que encaja.',
    accent: 'nivel de apoyo',
    subhead:
      'Cuatro formas de entrenar y una muy pronto. Precios y características exactos — nada escondido.',
  },

  inPerson: {
    eyebrow: 'Muy pronto',
    title: 'Entrenamiento Presencial Futuro',
    price: 'Desde $75 / sesión',
    summary:
      'Entrenamiento personal presencial con Angie. No disponible en el lanzamiento — se podrá sumar a medida que Delux Fit crezca.',
    icon: Building2,
  },

  footer: {
    blurb:
      'Disciplina sobre excusas. Membresías de fitness, coaching online personalizado y entrenamiento en vivo con la entrenadora personal certificada Angie.',
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
    brandLockup: 'Portal de Clientes',
    auth: {
      signInTitle: 'Acceso Clientes',
      signUpTitle: 'Crea tu cuenta',
      signInSubtitle: 'Inicia sesión en tu portal de cliente Delux Fit.',
      signUpSubtitle: 'Únete a Delux Fit para acceder a tu plan, tu progreso y tu coach.',
      nameLabel: 'Nombre completo',
      namePlaceholder: 'Tu nombre',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'tu@ejemplo.com',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Al menos 8 caracteres',
      signInCta: 'Iniciar Sesión',
      signUpCta: 'Crear Cuenta',
      signingIn: 'Iniciando sesión…',
      signingUp: 'Creando cuenta…',
      toSignUp: '¿Nueva en Delux Fit? Crea una cuenta',
      toSignIn: '¿Ya tienes cuenta? Inicia sesión',
      signOut: 'Cerrar sesión',
      checkEmail: 'Revisa tu correo para confirmar tu cuenta y luego inicia sesión.',
      genericError: 'Algo salió mal. Revisa tus datos e inténtalo de nuevo.',
    },
    nav: {
      overview: 'Resumen',
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
      explorePrograms: 'Explorar programas',
      active: 'Activo',
      inactive: 'Inactivo',
    },
    plan: {
      title: 'Mi plan personalizado',
      empty:
        'Todavía no se ha asignado un plan personalizado. Los planes personalizados están disponibles con el Coaching Online Personalizado.',
      emptyCta: 'Aplicar a coaching',
      gatedTitle: 'Los planes personalizados son parte del coaching',
      gatedBody:
        'Tus planes de entrenamiento asignados aparecen aquí cuando eres clienta activa de coaching.',
    },
    progress: {
      title: 'Seguimiento de progreso',
      addEntry: 'Registrar una entrada',
      dateLabel: 'Fecha',
      weightLabel: 'Peso (lb)',
      bodyFatLabel: 'Grasa corporal (%)',
      notesLabel: 'Notas',
      notesPlaceholder: '¿Cómo se sintió el entrenamiento? Energía, sueño, logros…',
      measurementsLabel: 'Medidas (pulg)',
      waistLabel: 'Cintura',
      hipsLabel: 'Cadera',
      chestLabel: 'Pecho',
      armsLabel: 'Brazos',
      thighsLabel: 'Muslos',
      photoLabel: 'Foto de progreso',
      photoHelper: 'Opcional — solo tú y Angie pueden verla.',
      saveEntry: 'Guardar entrada',
      saving: 'Guardando…',
      empty: 'Aún no hay entradas. Registra la primera para empezar a llevar el seguimiento.',
      trendTitle: 'Tendencia de peso',
      photo: 'Foto',
      viewPhoto: 'Ver foto',
      colDate: 'Fecha',
      colWeight: 'Peso',
      colBodyFat: 'Grasa corporal',
      colNotes: 'Notas',
    },
    bookings: {
      title: 'Tus sesiones',
      empty: 'No hay sesiones próximas. Reserva una sesión en vivo para empezar.',
      bookCta: 'Reservar una sesión',
      upcoming: 'Próximas',
      past: 'Pasadas',
    },
    messages: {
      title: 'Mensajes con Angie',
      intro:
        'Este es el único canal de comunicación del coaching. El tiempo de respuesta es de hasta 72 horas hábiles.',
      placeholder: 'Escríbele un mensaje a Angie…',
      send: 'Enviar',
      sending: 'Enviando…',
      empty: 'Aún no hay mensajes. Saluda para empezar la conversación.',
      attach: 'Adjuntar archivo',
      viewAttachment: 'Ver adjunto',
      coachName: 'Angie',
      youName: 'Tú',
      gatedBody: 'La mensajería directa está disponible para clientes activos de coaching.',
    },
    library: {
      title: 'Biblioteca de contenido',
      intro: 'Videos de entrenamiento, recursos de nutrición y educación fitness.',
      empty: 'Aún no hay contenido disponible. Vuelve pronto — se añade contenido nuevo regularmente.',
      gatedTitle: 'Desbloquea la biblioteca de contenido',
      gatedBody:
        'La biblioteca de contenido está disponible con una membresía o un plan de coaching activo.',
      gatedCta: 'Ver membresía',
      categoryAll: 'Todo',
      categoryWorkout: 'Entrenamientos',
      categoryNutrition: 'Nutrición',
      categoryEducation: 'Educación',
      locked: 'Bloqueado',
      open: 'Abrir',
      opening: 'Abriendo…',
    },
    nutrition: {
      title: 'Nutrición',
      intro: 'Tus objetivos de calorías, estructura de comidas y recursos personalizados de Angie.',
      empty:
        'Aún no se ha escrito una guía de nutrición. Angie la construye en torno a tus objetivos cuando empiezas el coaching.',
      gatedTitle: 'La guía de nutrición es parte del coaching',
      gatedBody:
        'Tu plan de nutrición personalizado aparece aquí cuando eres clienta activa de coaching.',
      gatedCta: 'Aplicar a coaching',
      caloriesLabel: 'Calorías diarias',
      proteinLabel: 'Proteína',
      carbsLabel: 'Carbohidratos',
      fatLabel: 'Grasa',
      mealsTitle: 'Estructura de comidas',
      resourcesTitle: 'Recursos',
      notesTitle: 'Notas de Angie',
      grams: 'g',
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
