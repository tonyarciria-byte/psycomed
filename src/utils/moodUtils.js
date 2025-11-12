// moodUtils.js

export const getMoodEmoji = (rating) => {
  const moodEmojis = ['😞', '😔', '😟', '😐', '🙂', '😊', '😄', '😁', '😃', '🤩'];
  return moodEmojis[rating - 1] || '😐';
};

export const getMoodColor = (rating) => {
  if (rating >= 7) return 'text-green-500';
  if (rating >= 4) return 'text-amber-500';
  return 'text-red-500';
};

export const moodAdvice = {
  'Alegría': [
    "Disfrútala, pero no te dejes arrastrar por ella. A veces la emoción hace que prometamos cosas que no podemos cumplir o gastemos plata sin pensar. Respira, saborea el momento y piensa dos veces antes de actuar.",
    "Comparte tu alegría con otros. La alegría se multiplica cuando la compartes. Si te va bien en algo, cuéntaselo a alguien cercano, celebra con tu familia o amigos, pero sin presumir: que sea desde el agradecimiento.",
    "Usa la alegría como combustible. Cuando te sientas feliz, aprovecha ese impulso para hacer cosas productivas: avanzar en un proyecto, escribir, programar, entrenar… es como tener energía extra que puedes canalizar.",
    "Equilibra la emoción con calma. Date un espacio de quietud incluso en medio de la alegría. Escucha música tranquila, escribe en tu diario cómo te sientes o simplemente siéntate en silencio unos minutos.",
    "Sé agradecido. La gratitud convierte la alegría en algo más profundo. Reconoce de dónde viene esa felicidad, qué personas o momentos influyeron, y agradécelo. Eso te ayuda a no darlo por sentado.",
    "Aprende de ella. Pregúntate: ¿qué me está enseñando este momento de alegría? ¿qué hice diferente para llegar aquí? Así puedes repetir y reforzar lo que te llevó a sentirte bien.",
    "Recuerda que es pasajera. La alegría, como la tristeza, no dura para siempre. Y está bien. No te aferres demasiado ni te frustres cuando baje: lo importante es saber que siempre volverá.",
    "Celebra tus pequeños triunfos. Cada paso adelante, por mínimo que sea, merece ser reconocido. ¡Brinda por ti!",
    "Contagia tu buen humor. Una sonrisa, una palabra amable, un gesto de apoyo... tu alegría puede iluminar el día de alguien más.",
    "Crea un 'banco de recuerdos felices'. Anota esos momentos de pura alegría para revisitarlos cuando lo necesites. Son tu tesoro personal.",
    "Baila como si nadie te viera. La música y el movimiento son liberadores. Deja que tu cuerpo exprese la felicidad que sientes.",
    "Haz algo que te apasione. Sumérgete en un hobby, un proyecto creativo o cualquier actividad que te llene de energía y satisfacción.",
    "Conecta con la naturaleza. Un paseo por el parque, un momento bajo el sol o simplemente observar las nubes pueden amplificar tu alegría.",
    "Practica la risoterapia. Busca videos divertidos, chistes o simplemente ríe sin razón. La risa es contagiosa y terapéutica.",
    "Ayuda a alguien más. Extender una mano, ofrecer tu tiempo o compartir tus conocimientos puede generar una profunda sensación de alegría y propósito.",
    "Desconéctate para reconectar. A veces, la mejor manera de disfrutar la alegría es alejarse del ruido digital y conectar con el presente."
  ],
  'Tristeza': [
    "Dale espacio, no la escondas. Guardarse todo es como meter basura debajo de la cama: al final huele peor. Habla con alguien de confianza, escribe, o incluso llora si lo necesitas. Eso ayuda más de lo que parece.",
    "Ponle música a lo que sientes. Escuchar canciones melancólicas (como las de Halo Reach o algo nostálgico) puede ayudarte a soltar lo que tienes dentro. No todo es música feliz; a veces la música triste cura.",
    "Haz algo creativo. La tristeza es como gasolina para el arte. Puedes escribir un poema, dibujar, o incluso programar un mini-juego con un ambiente oscuro. Es una forma de transformar ese dolor en algo que tenga sentido.",
    "Sal a caminar. No es cliché. El movimiento y el aire fresco ayudan a que tu mente respire también. Ver el cielo, los árboles o simplemente a la gente, te da otra perspectiva.",
    "Recuerda que es temporal. Ninguna tristeza es eterna, aunque en el momento parezca. Tal como en Halo, después de una misión dura, siempre viene un respiro.",
    "Haz memoria de lo bueno. A veces, recordar las cosas que ya superaste te da la fuerza para enfrentar lo que vives ahora. Mira hacia atrás y piensa: “ya pasé por cosas peores y aquí estoy”.",
    "No te castigues por sentirte mal. Ser triste no significa ser débil. Significa que eres humano, y eso también es valioso.",
    "Permítete sentir. No luches contra la tristeza. Reconócela, acéptala y permítete experimentarla sin juzgarte.",
    "Escribe en tu diario. Plasmar tus pensamientos y sentimientos en papel puede ser una forma poderosa de procesar la tristeza y ganar perspectiva.",
    "Busca consuelo en lo familiar. Vuelve a tus rutinas, a tus lugares seguros, a las personas que te brindan calma y apoyo.",
    "Mira una película o serie que te permita llorar. A veces, una buena catarsis a través del arte es justo lo que necesitas.",
    "Prepara tu comida favorita. Consiéntete con algo que disfrutes. La comodidad de la comida puede ser un pequeño bálsamo.",
    "Acepta el apoyo. Si alguien te ofrece ayuda o simplemente quiere escucharte, permíteles estar ahí para ti.",
    "Recuerda que está bien no estar bien. No hay una forma 'correcta' de sentir. Date permiso para estar triste.",
    "Pequeños actos de autocuidado. Una ducha caliente, una taza de té, leer un libro. Cosas simples que te recuerden que mereces cuidado.",
    "Visualiza un futuro mejor. Aunque sea difícil, intenta imaginar un momento en el que te sientas mejor. La esperanza es un motor poderoso."
  ],
  'Ansiedad': [
    "Respira profundo. Cuando la ansiedad ataca, tu respiración se acelera. Intenta inhalar lentamente por la nariz contando hasta 4, sostén 4, exhala por la boca contando hasta 6. Repite varias veces.",
    "Identifica tus pensamientos. La ansiedad a menudo viene de pensamientos catastróficos. Escríbelos y pregúntate: ¿es esto real? ¿qué es lo peor que podría pasar? ¿puedo hacer algo al respecto?",
    "Muévete. Una caminata corta, estiramientos o cualquier actividad física puede ayudar a liberar la tensión acumulada en tu cuerpo. No necesitas un gimnasio, solo moverte.",
    "Conéctate con tus sentidos. Enfócate en lo que ves, oyes, hueles, tocas y saboreas en este momento. Esto te ancla al presente y te saca del ciclo de preocupación.",
    "Establece límites. Si hay algo o alguien que te genera ansiedad, aprende a decir 'no' o a limitar tu exposición. Tu paz mental es una prioridad.",
    "Prepara un 'kit de calma'. Ten a mano cosas que te ayuden a relajarte: una manta suave, un té de hierbas, un libro, música tranquila, o un aceite esencial. Úsalo cuando sientas que la ansiedad sube.",
    "Busca ayuda profesional. Si la ansiedad es abrumadora y afecta tu vida diaria, no dudes en hablar con un terapeuta. No tienes que pasar por esto solo.",
    "Escribe tus preocupaciones. Sacar los pensamientos de tu cabeza y ponerlos en papel puede hacer que parezcan menos abrumadores.",
    "Distráete sanamente. Sumérgete en una actividad que requiera tu concentración: un rompecabezas, un juego, un proyecto manual.",
    "Evita la cafeína y el azúcar en exceso. Pueden exacerbar los síntomas de ansiedad. Opta por bebidas y alimentos más equilibrados.",
    "Practica la relajación muscular progresiva. Tensa y relaja diferentes grupos musculares de tu cuerpo para liberar la tensión física.",
    "Habla con alguien de confianza. A veces, solo expresar lo que sientes a un amigo o familiar puede aliviar la carga.",
    "Visualiza un lugar seguro. Cierra los ojos e imagina un lugar donde te sientas completamente tranquilo y seguro. Permanece allí mentalmente por unos minutos.",
    "No te auto-mediques. Evita el alcohol u otras sustancias para manejar la ansiedad, ya que a largo plazo pueden empeorar la situación.",
    "Aprende a delegar. Si te sientes abrumado por responsabilidades, considera pedir ayuda o delegar tareas si es posible.",
    "Recuerda tus fortalezas. Piensa en momentos en los que superaste desafíos. Confía en tu capacidad para manejar esta situación."
  ],
  'Estrés': [
    "Prioriza tus tareas. El estrés a menudo viene de sentir que tienes demasiado que hacer. Haz una lista y decide qué es lo más importante y urgente. Delega si puedes.",
    "Toma descansos cortos. No intentes trabajar sin parar. Cada hora, levántate, estírate, mira por la ventana o toma un vaso de agua. Pequeñas pausas recargan tu mente.",
    "Aprende a decir 'no'. No tienes que aceptar todas las responsabilidades o peticiones. Conoce tus límites y comunícalos de forma amable pero firme.",
    "Desconéctate. Dedica tiempo cada día a actividades que no estén relacionadas con el trabajo o las obligaciones. Lee, escucha música, juega, o simplemente no hagas nada.",
    "Cuida tu cuerpo. El sueño, la alimentación y el ejercicio son tus mejores aliados contra el estrés. No los sacrifiques, son tu base.",
    "Practica la atención plena. Dedica unos minutos a observar tu respiración o tus sensaciones sin juzgar. Esto te ayuda a estar en el presente y reducir la rumiación.",
    "Busca apoyo. Habla con amigos, familiares o un profesional sobre lo que te estresa. Compartir la carga puede aliviarla.",
    "Organiza tu espacio. Un entorno ordenado puede reducir el estrés mental. Dedica unos minutos a limpiar tu escritorio o tu habitación.",
    "Establece una rutina. La predictibilidad puede reducir el estrés. Intenta mantener horarios regulares para dormir, comer y trabajar.",
    "Haz ejercicio regularmente. La actividad física es un gran liberador de estrés. No tiene que ser intenso, una caminata diaria es suficiente.",
    "Limita tu exposición a noticias negativas. Mantente informado, pero no te satures. Demasiada información negativa puede aumentar el estrés.",
    "Aprende técnicas de relajación. Meditación, yoga, tai chi o simplemente escuchar música relajante pueden ayudarte a manejar el estrés.",
    "Ríe más. La risa es una medicina poderosa contra el estrés. Busca momentos para reír a carcajadas.",
    "Revisa tus expectativas. A veces, el estrés viene de expectativas poco realistas sobre ti mismo o sobre los demás. Sé más amable contigo.",
    "Practica la gratitud. Enfocarte en lo que tienes y aprecias puede cambiar tu perspectiva y reducir el estrés.",
    "Considera un hobby. Tener una actividad que disfrutes y que te permita desconectar puede ser muy beneficioso para el estrés."
  ],
  'Calma': [
    "Saborea el momento. La calma es un regalo. Tómate un momento para realmente sentirla, para notar los detalles de tu entorno y cómo se siente tu cuerpo.",
    "Practica la gratitud. Piensa en las cosas que te trajeron a este estado de calma. Agradece por ellas. Esto profundiza la sensación de bienestar.",
    "Mantén tu rutina de bienestar. Si hay algo que haces regularmente (meditar, caminar, leer) que te ayuda a mantener la calma, no lo abandones. Es tu ancla.",
    "Comparte tu energía. Cuando estás en calma, puedes ser una fuente de paz para los demás. Ofrece una palabra amable, escucha a un amigo, o simplemente irradia esa tranquilidad.",
    "Planifica momentos de calma. No esperes a que la calma llegue sola. Agenda pequeños espacios en tu día para la meditación, la lectura o simplemente para no hacer nada.",
    "Reflexiona sobre lo que funciona. ¿Qué hiciste para sentirte así de tranquilo? Identifica esas acciones o situaciones para poder replicarlas en el futuro.",
    "Disfruta del silencio. En un mundo ruidoso, el silencio es un lujo. Permítete momentos de quietud para recargar tu mente y espíritu.",
    "Pasea por la naturaleza. El contacto con árboles, agua o simplemente el aire libre puede potenciar tu sensación de calma.",
    "Escucha música relajante. Crea una playlist de sonidos que te transporten a un estado de paz.",
    "Practica la respiración consciente. Dedica unos minutos a observar tu respiración, sintiendo cómo el aire entra y sale de tu cuerpo.",
    "Desconéctate de las pantallas. Reduce el tiempo frente al móvil o el ordenador para darle un respiro a tu mente.",
    "Toma un baño o ducha relajante. El agua tibia puede ser increíblemente calmante para el cuerpo y la mente.",
    "Lee un libro. Sumérgete en una historia o en un tema que te interese, lejos de las distracciones.",
    "Haz una actividad manual. Tejer, dibujar, pintar, cocinar. Concentrarte en una tarea manual puede ser muy meditativo.",
    "Medita. Incluso 5 minutos de meditación diaria pueden hacer una gran diferencia en tu nivel de calma.",
    "Estira tu cuerpo. Libera la tensión física con estiramientos suaves o yoga."
  ],
  'Cansancio': [
    "Prioriza el descanso. A veces, la única solución es dormir. Si puedes, toma una siesta corta o acuéstate más temprano. No te sientas culpable por ello.",
    "Hidrátate y come bien. La deshidratación y una mala alimentación pueden aumentar la sensación de cansancio. Bebe agua y opta por alimentos nutritivos.",
    "Haz pausas activas. Si estás sentado mucho tiempo, levántate y estírate. Un poco de movimiento puede reactivar tu energía.",
    "Reduce la sobrecarga de información. Demasiadas noticias, redes sociales o estímulos pueden agotar tu mente. Desconéctate por un rato.",
    "Escucha a tu cuerpo. Si te sientes cansado, es una señal. No la ignores. Aprende a reconocer tus límites y a respetarlos.",
    "Organiza tu espacio. Un entorno desordenado puede generar cansancio mental. Dedica unos minutos a organizar tu escritorio o tu habitación.",
    "Busca la causa. Si el cansancio es persistente, podría haber una razón subyacente. Considera hablar con un médico para descartar cualquier problema de salud.",
    "Toma un café o té (con moderación). Una pequeña dosis de cafeína puede darte un empujón temporal, pero no abuses.",
    "Sal a tomar el sol. La luz natural ayuda a regular tu ritmo circadiano y puede mejorar tu energía.",
    "Escucha música energizante. Una playlist con tus canciones favoritas puede ayudarte a superar el cansancio.",
    "Haz una lista de tareas pendientes. A veces, el cansancio viene de la carga mental. Organizar tus pendientes puede aliviarla.",
    "Pide ayuda. Si te sientes abrumado, no dudes en pedir a alguien que te eche una mano.",
    "Evita el 'burnout'. Reconoce las señales de agotamiento y tómate un descanso antes de llegar al límite.",
    "Haz algo divertido. La diversión es un gran revitalizador. Dedica tiempo a actividades que te hagan reír y disfrutar.",
    "Respira aire fresco. Abre una ventana o sal al balcón. Un poco de aire fresco puede despejar tu mente.",
    "Considera suplementos. Si tu cansancio es crónico, consulta a un profesional sobre posibles deficiencias de vitaminas o minerales."
  ],
  'Frustración': [
    "Haz una pausa. Cuando la frustración te invada, detente. Aléjate de la situación por unos minutos. Respira hondo y despeja tu mente.",
    "Identifica la causa. ¿Qué es exactamente lo que te frustra? ¿Es la situación, otra persona, o tus propias expectativas? Entender la raíz te ayuda a manejarla.",
    "Reformula el problema. En lugar de decir 'esto es imposible', pregúntate '¿qué puedo hacer diferente?' o '¿qué puedo aprender de esto?'. Cambia tu perspectiva.",
    "Libera la energía. La frustración genera tensión. Haz algo físico: camina, estira, aprieta una pelota antiestrés. Libera esa energía acumulada.",
    "Comunica tus sentimientos. Si la frustración es con otra persona, exprésala de forma calmada y constructiva. Evita culpar y enfócate en cómo te sientes.",
    "Acepta lo que no puedes controlar. Hay cosas que simplemente están fuera de tu alcance. Aprende a soltar y a enfocarte en lo que sí puedes cambiar.",
    "Busca una solución, no un culpable. En lugar de quedarte en el enojo, dirige tu energía a encontrar una salida o un nuevo enfoque.",
    "Practica la paciencia. Algunas cosas toman tiempo. La frustración a menudo surge de la impaciencia. Date y dale tiempo a la situación.",
    "Divide el problema. Si la tarea es grande y te frustra, divídela en pasos más pequeños y manejables.",
    "Pide feedback. A veces, una perspectiva externa puede ayudarte a ver el problema de otra manera y encontrar una solución.",
    "Aprende a perdonar. Perdonarte a ti mismo o a otros por errores puede liberar la frustración y permitirte avanzar.",
    "Cambia de actividad. Si estás atascado en algo que te frustra, cambia a otra tarea por un rato y luego regresa con una mente fresca.",
    "Visualiza el éxito. Imagina cómo te sentirás una vez que superes este obstáculo. Esto puede renovar tu motivación.",
    "No te tomes las cosas personal. A menudo, la frustración no es sobre ti, sino sobre la situación o la otra persona.",
    "Revisa tus expectativas. ¿Son realistas? A veces, la frustración viene de expectativas demasiado altas.",
    "Celebra los pequeños avances. Reconoce cada paso que das para superar la frustración. Cada intento cuenta."
  ]
  // Aquí podrías añadir miles de consejos más para cada emoción.
  // Por ejemplo:
  // 'Alegría': [..., "Consejo 11", "Consejo 12", ..., "Consejo 3000"]
};

export const moodCategories = {
  'Buen Humor': ['Alegría', 'Calma', 'Motivación'],
  'Mal Humor': ['Tristeza', 'Ansiedad', 'Estrés', 'Cansancio', 'Frustración']
};

export const motivationalMessages = [
  "Cada día es una nueva oportunidad para brillar. ¡Tú puedes!",
  "Recuerda que eres más fuerte de lo que crees. ¡Sigue adelante!",
  "Pequeños pasos cada día te llevan a grandes logros. ¡No te rindas!",
  "Tu bienestar es tu prioridad. Dedica tiempo a cuidarte.",
  "Confía en el proceso. Las cosas buenas toman tiempo.",
  "Eres capaz de cosas increíbles. ¡Cree en ti!",
  "Hoy es un buen día para empezar de nuevo. ¡Aprovecha!",
  "Tu resiliencia es tu superpoder. ¡Úsala!",
  "No hay tormenta que dure para siempre. La calma siempre llega.",
  "Cada emoción es una maestra. Escúchala y aprende.",
  "Sé amable contigo mismo. Te lo mereces.",
  "Tu camino es único y valioso. ¡Disfrútalo!",
  "La gratitud transforma lo que tienes en suficiente.",
  "Respira. Todo estará bien.",
  "Eres suficiente. Tal como eres, eres valioso.",
  "Hoy es el día perfecto para ser feliz. ¡Elige serlo!",
  "Tu mente es un jardín. Cultiva pensamientos positivos.",
  "No te compares con nadie. Tu brillo es solo tuyo.",
  "Acepta tus imperfecciones. Son parte de tu encanto.",
  "La vida es un viaje, no una carrera. Disfruta el paisaje.",
  "Tu voz importa. No tengas miedo de expresarte.",
  "El autocuidado no es egoísmo, es una necesidad.",
  "Cada error es una lección disfrazada. ¡Aprende y crece!",
  "La esperanza es el ancla del alma. Aférrate a ella.",
  "Eres el autor de tu propia historia. ¡Escribe un gran capítulo hoy!",
  "La paz comienza contigo. Encuéntrala dentro de ti.",
  "No dejes que el miedo te detenga. ¡Atrévete a volar!",
  "Tu sonrisa puede cambiar el mundo. ¡Compártela!",
  "La paciencia es una virtud. Las mejores cosas llegan a su tiempo.",
  "Eres un ser de luz. ¡Deja que tu luz brille!"
];