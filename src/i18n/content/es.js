/* =============================================================================
   DELUXFIT BY ANGIE — CONTENIDO EN ESPAÑOL (es)
   -----------------------------------------------------------------------------
   ⚠️  CONTENIDO DE EJEMPLO — PARA QUE ANGIE LO AJUSTE.

   Cada cadena, estadística, testimonio, ruta de imagen y handle social aquí
   abajo es texto provisional escrito en una voz de coaching/ventas en español
   neutro (tú), sostenida y persuasiva. Edita aquí para cambiar el sitio en
   español — las secciones leen este árbol vía el contexto de i18n.

   • Los enlaces de Stripe viven en `src/config/checkout.js`.
   • Cada clave aquí debe existir también en `./en.js`.
   ========================================================================== */

import { CHECKOUT_LINKS } from '../../config/checkout'
import {
  Dumbbell,
  Apple,
  MessageCircleHeart,
  Users,
  CalendarCheck,
  LineChart,
  ShieldCheck,
  Instagram,
} from 'lucide-react'

const es = {
  meta: {
    title: 'DeluxFit by Angie — Transforma tu cuerpo en 12 semanas',
    description:
      'DeluxFit by Angie — coaching online que transforma. Entrenamientos personalizados, coaching de nutrición y acompañamiento semanal con una entrenadora personal certificada.',
  },

  brand: {
    name: 'DELUXFIT',
    fullName: 'DeluxFit by Angie',
    tagline: 'Coaching online que transforma.',
  },

  nav: [
    { label: 'Programa', href: '#program' },
    { label: 'Resultados', href: '#results' },
    { label: 'Precios', href: '#pricing' },
    { label: 'Preguntas', href: '#faq' },
  ],

  header: {
    primaryCta: 'Aplica Ahora',
    primaryCtaHref: '#pricing',
    clientLogin: 'Acceso Clientas',
    clientLoginAria: 'Portal de acceso para clientas',
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

  hero: {
    badge: 'Aceptando nuevas clientas de coaching personalizado 1 a 1',
    headline: ['Construye el cuerpo', 'que dejaste de', 'creer posible.'],
    subhead:
      'DeluxFit es coaching online 1 a 1 para mujeres que están cansadas de empezar de cero. Entrenamientos personalizados, coaching de nutrición real y acompañamiento semanal — diseñado alrededor de tu vida, no del feed perfecto de alguien más.',
    primaryCta: 'Comienza Tu Transformación',
    secondaryCta: 'Ver Resultados',
    trust: {
      pillarValue: '1:1',
      pillarLabel: 'coaching personalizado',
      tagline: 'Coaching · Nutrición · Acompañamiento',
    },
    imageAlt: 'Angie en sentadilla en una máquina Smith, vista desde atrás',
  },

  marqueeItems: [
    'Entrenamiento de Fuerza',
    'Pérdida de Grasa',
    'Coaching de Nutrición',
    'Acompañamiento',
    'Mentalidad',
    'Movilidad',
    'Fuerza Posparto',
  ],

  pain: {
    eyebrow: '¿Te suena familiar?',
    heading: 'No eres floja. Te han dado el plan equivocado.',
    accent: 'el plan equivocado',
    subhead:
      'Lo has intentado con todo — quizás más duro de lo que nadie sabe. El problema nunca fue tu esfuerzo. Fue un programa genérico que ignoró tu cuerpo, tu agenda y tu vida.',
    points: [
      'Cansada de empezar una dieta nueva cada lunes y rendirte el jueves.',
      'Harta de planes de ejercicio genéricos que te dejan adolorida, aburrida y estancada.',
      'Agotada por reglas de todo o nada que hacen que la comida se sienta como el enemigo.',
      'Frustrada porque la báscula no se mueve por más poco que comas.',
      'Cansada de programas “fitspo” diseñados para chicas de 22 años sin hijos ni trabajo.',
      'Sola, sin nadie que te apoye ni te haga seguimiento.',
    ],
  },

  benefits: {
    eyebrow: 'Qué obtienes',
    heading: 'Un sistema completo — no solo otro PDF de entrenamiento.',
    accent: 'sistema completo',
    subhead:
      'Todo está diseñado para ti y se ajusta cada semana según tu progreso. Esto es coaching real, no una plantilla que descargas y nunca vuelves a abrir.',
    items: [
      {
        icon: Dumbbell,
        title: 'Entrenamientos Personalizados',
        description:
          'Programación diseñada alrededor de tus metas, tu equipo y tu experiencia — en casa o en el gimnasio, en 3–5 sesiones por semana.',
      },
      {
        icon: Apple,
        title: 'Coaching de Nutrición',
        description:
          'Un enfoque flexible y sostenible con objetivos que encajan con tu vida real. Sin alimentos prohibidos, sin pasar hambre, sin culpa.',
      },
      {
        icon: CalendarCheck,
        title: 'Acompañamiento Semanal',
        description:
          'Haces tu check-in cada semana con fotos, datos y logros. Yo lo reviso todo y ajusto tu plan para que sigas avanzando.',
      },
      {
        icon: MessageCircleHeart,
        title: 'Acceso Directo a Angie',
        description:
          'Escríbeme entre check-ins desde la app. ¿Atascada, de viaje o tentada a rendirte? Estoy a un mensaje de distancia.',
      },
      {
        icon: Users,
        title: 'Comunidad Privada',
        description:
          'Entrena junto a un grupo de mujeres motivadas que celebran tus logros y te empujan hacia adelante en los días difíciles.',
      },
      {
        icon: LineChart,
        title: 'Seguimiento de Progreso',
        description:
          'Ve tu fuerza, tus medidas y tus hábitos en un solo lugar — la prueba de que estás cambiando, incluso cuando la báscula miente.',
      },
    ],
  },

  program: {
    eyebrow: 'El programa',
    heading: 'El método de transformación DeluxFit de 12 semanas.',
    accent: 'método de transformación',
    subhead:
      'Tres fases enfocadas que se construyen una sobre otra — para que no solo bajes de peso, sino que construyas un cuerpo y una rutina que duren.',
    phases: [
      {
        label: 'Fase 01 · Semanas 1–4',
        title: 'Fundamentos',
        description:
          'Establecemos tu base nutricional, dominamos los movimientos clave con técnica perfecta y construimos los hábitos diarios sobre los que todo lo demás se sostiene.',
      },
      {
        label: 'Fase 02 · Semanas 5–8',
        title: 'Construir & Quemar',
        description:
          'El entrenamiento se intensifica y la nutrición se vuelve estratégica. Aquí es donde el espejo empieza a cambiar y tu confianza se enciende.',
      },
      {
        label: 'Fase 03 · Semanas 9–12',
        title: 'Esculpir & Sostener',
        description:
          'Afinamos tus resultados y dejamos un estilo de vida que puedes mantener — para que la transformación dure más que el programa.',
      },
    ],
    stats: [
      { value: '12', label: 'Semanas de Programa' },
      { value: '3', label: 'Fases Enfocadas' },
      { value: '1:1', label: 'Formato de Coaching' },
      { value: '14', label: 'Días de Garantía' },
    ],
  },

  results: {
    eyebrow: 'Mujeres reales, resultados reales',
    heading: 'Construido sobre lo que las transformaciones reales necesitan.',
    accent: 'las transformaciones reales necesitan',
    subhead:
      'Aquí aparecerán historias reales de clientas y fotos antes y después a medida que las clientas de Angie completen sus programas. Mientras tanto, esto es alrededor de lo que se construye cada transformación DeluxFit.',
    pillars: [
      {
        title: 'Fuerza Real',
        description:
          'Levantamientos que se vuelven más pesados, energía que dura y un cuerpo que puede más que antes.',
      },
      {
        title: 'Hábitos Reales',
        description:
          'Rutinas de comida, entrenamiento y descanso que realmente puedes mantener cuando la vida se complica.',
      },
      {
        title: 'Confianza Real',
        description:
          'Cómo te plantas frente al espejo, en el gimnasio y en cada espacio al que entras.',
      },
    ],
    galleryNote:
      'Fotos antes y después muy pronto — se muestran imágenes provisionales hasta que Angie sume transformaciones reales de clientas.',
    gallery: [
      { label: 'Próximamente', alt: 'Marcador de transformación antes y después' },
      { label: 'Próximamente', alt: 'Marcador de transformación antes y después' },
      { label: 'Próximamente', alt: 'Marcador de transformación antes y después' },
    ],
  },

  pricing: {
    eyebrow: 'Elige tu transformación',
    heading: 'Escoge el plan que se ajusta a tus metas.',
    accent: 'se ajusta a tus metas',
    subhead:
      'Cada plan incluye entrenamiento personalizado, coaching de nutrición y acompañamiento semanal. Cancela cuando quieras — sin contratos, sin trucos.',
    note: 'Precios mostrados en USD. Precios de muestra — Angie define los números finales en Stripe.',
    tiers: [
      {
        id: 'kickstart',
        name: 'Kickstart',
        price: '$149',
        period: '/ 1 mes',
        description: 'Prueba el agua y siente la diferencia en 30 días.',
        features: [
          'Plan de entrenamiento personalizado de 4 semanas',
          'Objetivos de nutrición personalizados',
          'Check-in semanal y ajustes al plan',
          'Soporte por mensajes en la app',
          'Acceso a comunidad privada',
        ],
        ctaLabel: 'Comenzar Kickstart',
        ctaHref: CHECKOUT_LINKS.kickstart,
        highlighted: false,
      },
      {
        id: 'transform',
        name: 'Transform',
        price: '$129',
        period: '/ mes · 3 meses',
        description: 'El método completo de 12 semanas — nuestro camino más popular al cambio real.',
        features: [
          'Todo lo de Kickstart',
          'Método completo de 12 semanas de transformación',
          'Revisiones de técnica en video cada dos semanas',
          'Mensajería prioritaria con Angie',
          'Módulos de hábitos y mentalidad',
          'Tablero de seguimiento de progreso',
        ],
        ctaLabel: 'Comenzar Transform',
        ctaHref: CHECKOUT_LINKS.transform,
        highlighted: true,
        badgeLabel: 'Más Popular',
      },
      {
        id: 'elite',
        name: 'Elite 1:1',
        price: '$199',
        period: '/ mes · 6 meses',
        description: 'Máximo acceso para la mujer que quiere los resultados más rápidos y profundos.',
        features: [
          'Todo lo de Transform',
          'Sesiones 1:1 semanales por video',
          'Entrenamiento y nutrición totalmente a la medida',
          'Check-in diario y mensajería ilimitada',
          'Guía de suplementos y recuperación',
          'Acceso de por vida a la comunidad de alumnas',
        ],
        ctaLabel: 'Únete a Elite',
        ctaHref: CHECKOUT_LINKS.elite,
        highlighted: false,
      },
    ],
  },

  guarantee: {
    icon: ShieldCheck,
    eyebrow: 'Cero riesgo',
    heading: 'La garantía de 14 días “te encanta o te devolvemos el dinero”.',
    accent: 'te encanta o te devolvemos el dinero',
    dayBadge: 'Días de garantía',
    body: 'Aparece, haz el trabajo y usa el coaching durante 14 días. Si no te sientes más segura, más capaz y realmente apoyada, escríbenos y te devolvemos cada centavo. El único riesgo es quedarte exactamente donde estás.',
    cta: 'Reserva Tu Lugar',
  },

  about: {
    eyebrow: 'Conoce a tu coach',
    name: 'Angie',
    heading: 'Hola, soy Angie — y construí DeluxFit para la mujer en la que te estás convirtiendo.',
    accent: 'la mujer en la que te estás convirtiendo',
    bio: [
      'Ayudo a mujeres a cortar el ruido de las dietas extremas y los entrenamientos castigadores para construir cuerpos — y confianza — que duren. He estado donde estás tú: frustrada, abrumada y lista para algo que por fin funcione.',
      'DeluxFit es el coaching que yo hubiera querido tener: comida real, entrenamiento inteligente y una coach que de verdad aparece. Sin vergüenza, sin extremos — solo un sistema claro y alguien en tu esquina cada semana.',
    ],
    credentials: [
      'Entrenadora Personal Certificada (NASM-CPT)',
      'Coach de Nutrición Precision Nutrition Nivel 1',
      'Especialista en Fitness Pre y Posnatal',
      'Coaching 1 a 1 online y presencial',
    ],
    imageAlt: 'Angie acompañando a una clienta en una serie de prensa de piernas',
  },

  faq: {
    eyebrow: 'Preguntas',
    heading: 'Todo lo que necesitas saber.',
    accent: 'necesitas saber',
    items: [
      {
        question: '¿Necesito membresía de gimnasio?',
        answer:
          'Para nada. Dime con qué cuentas — un gimnasio completo, unas mancuernas o solo tu peso corporal en casa — y armaré tu programa alrededor de eso. Puedes lograr resultados increíbles entrenando desde casa.',
      },
      {
        question: 'Soy principiante total. ¿Esto es para mí?',
        answer:
          'Absolutamente. Las principiantes son exactamente para quienes DeluxFit fue creado. Cada entrenamiento incluye videos demostrativos y coaching de técnica, y escalamos todo a tu nivel para que construyas confianza desde el día uno.',
      },
      {
        question: '¿En qué se diferencia esto de una app de ejercicio gratis?',
        answer:
          'Las apps te dan un plan genérico y desaparecen. DeluxFit es coaching real: tu programa está hecho para ti, ajustado cada semana según tu progreso y respaldado por acceso directo a mí siempre que te atasques.',
      },
      {
        question: '¿Tendré que renunciar a las comidas que amo?',
        answer:
          'Nunca. Mi enfoque es flexible y sostenible — sin alimentos prohibidos, sin pasar hambre. Aprenderás a disfrutar las comidas que amas mientras alcanzas tus metas, y por eso dura.',
      },
      {
        question: '¿Cuánto tiempo necesito a la semana?',
        answer:
          'Los programas normalmente son de 3–5 sesiones de entrenamiento por semana de 30–45 minutos cada una, más unos minutos para tu check-in semanal. El plan se acomoda a tu agenda — no al revés.',
      },
      {
        question: '¿Y si no es para mí?',
        answer:
          'Estás cubierta por la garantía de 14 días “te encanta o te devolvemos el dinero”. Prueba el coaching sin riesgo, y si no es para ti, escríbenos dentro de los 14 días para un reembolso completo.',
      },
    ],
  },

  finalCta: {
    eyebrow: 'Tu transformación empieza ahora',
    heading: 'Las próximas 12 semanas van a pasar de todas formas.',
    accent: 'de todas formas',
    subhead:
      'Puedes llegar a ese punto deseando haber empezado hoy — o llegar más fuerte, más definida y más orgullosa que nunca. Los lugares en cada grupo de coaching son limitados para que pueda darle atención real a cada clienta.',
    primaryCta: 'Comienza Tu Transformación',
    secondaryCta: 'Lee las Preguntas',
  },

  footer: {
    blurb:
      'Coaching online de fitness que transforma cuerpos y reconstruye confianza — una mujer a la vez.',
    navLabel: 'Pie de página',
    rightsReserved: 'Todos los derechos reservados.',
    socials: [
      { label: 'Instagram', href: 'https://instagram.com/REPLACE_ME', icon: Instagram },
      { label: 'TikTok', href: 'https://tiktok.com/@REPLACE_ME', icon: 'tiktok' },
    ],
    smallPrint:
      'Los resultados varían. DeluxFit by Angie ofrece coaching de fitness y nutrición con fines educativos y no sustituye el consejo médico. Consulta a tu médico antes de iniciar cualquier programa de ejercicio o nutrición.',
  },

  portal: {
    backToSite: 'Volver al sitio',
    backToHome: 'Volver a DeluxFit',
    comingSoon: 'Próximamente',
    headingLines: ['Portal', 'Clientas'],
    blurb:
      'Un espacio exclusivo para clientas actuales de DeluxFit — tu plan de entrenamiento, check-ins semanales, macros, tendencias de progreso y chat directo con Angie — llega muy pronto.',
    signInHint: '¿Ya eres clienta? Inicia sesión aquí cuando lancemos.',
  },
}

export default es
