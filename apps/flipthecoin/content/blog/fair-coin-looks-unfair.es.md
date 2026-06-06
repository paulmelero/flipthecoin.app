---
title: 'Por qué una moneda justa pasa casi toda su vida pareciendo injusta?'
slug: moneda-justa-paseo-aleatorio-ley-del-arcoseno
_locale: es
description: 'Una moneda justa tiende a acabar casi en empate, pero pasa casi toda su vida con una cara en cabeza. La historia de los paseos aleatorios, el movimiento browniano y las leyes del arcoseno.'
published: true
date: 2026-06-06T10:00:00Z
---

# Por qué una moneda justa pasa casi toda su vida pareciendo injusta?

Aquí va una pregunta que suena sencilla y no lo es. Imagina que dos amigos, Alicia y Bruno, juegan a un juego. Se lanza una moneda justa una vez por segundo. Si sale cara, Alicia gana un punto; si sale cruz, lo gana Bruno. Siguen jugando durante un año entero — más de treinta millones de lanzamientos. En cada instante, uno de los dos va «en cabeza» (tiene más puntos hasta ese momento). ¿Qué es más probable?

<!--more-->

- **(A)** El liderazgo cambia de manos a menudo, así que cada jugador va en cabeza durante aproximadamente la mitad del año.
- **(B)** Un jugador toma la delantera pronto y la mantiene durante casi todo el año, mientras el otro pasa mes tras mes por detrás.

Casi todo el mundo elige (A). Parece evidente: la moneda es justa, así que el liderazgo debería repartirse de forma justa. Y sin embargo, la verdad sorprendente — demostrada a mediados del siglo XX — es que **(B) es mucho más probable que (A)**. Una moneda perfectamente justa pasa casi toda su vida pareciendo profundamente injusta.

Este artículo trata de esa paradoja, y de la hermosa cadena de ideas que hace falta para explicarla: los caminos aleatorios o "paseos aleatorios", la campana de Gauss, el movimiento _browniano_ y una extraña curva en forma de U llamada **ley del arcoseno**.

## Un paseo construido con lanzamientos de moneda

Convirtamos el juego en una imagen. Empezamos un total acumulado en cero. Cada cara suma $+1$; cada cruz resta $1$.

```text
Tirada:    O   X   O   O   X   X   X   O
Paso:     +1  -1  +1  +1  -1  -1  -1  +1
Total:     1   0   1   2   1   0  -1   0
```

Si el total es positivo, Alicia va en cabeza; si es negativo, va Bruno. Si dibujamos el total frente al tiempo, obtenemos un camino dentado que vaga hacia arriba y hacia abajo. Los matemáticos lo llaman [**camino aleatorio** o **paseo aleatorio**](https://es.wikipedia.org/wiki/Camino_aleatorio).

```text
 +3 |
 +2 |        ___
 +1 |    ___/   \___        ___
  0 |___/           \___   /
 -1 |                   \_/
    +------------------------- tiempo
```

<!-- IMAGE: un único camino de paseo aleatorio a lo largo de unos cientos de pasos, con el eje en cero -->

Un paseo aleatorio es el ejemplo más sencillo de un **proceso estocástico** — un término elegante para _un sistema que cambia paso a paso, con una pizca de azar en cada paso_. Ya conoces muchos. El precio de una acción en bolsa es un proceso estocástico: en cada tic sube o baja un poco, y nadie puede predecir hacia dónde. La posición de un diminuto grano de polen agitándose en el agua también lo es. Y lo mismo ocurre con el camino de una persona que ha bebido un poco de más y decide en cada paso si tambalearse a la izquierda o a la derecha — el clásico «paseo del borracho».

Y ahora viene la idea más importante de todo el artículo, así que guárdala bien:

> Hay una diferencia entre el **destino** y el **viaje**. _Dónde acaba_ el paseo es una pregunta. _Qué ocurren durante el camino_ es una pregunta completamente distinta.

Ten ambas presentes. La paradoja vive en el hueco que las separa.

## Aparece la campana de Gauss

Empecemos por el destino. Después de un millón de lanzamientos, ¿más o menos dónde está el total?

Cada lanzamiento tiene la misma probabilidad de valer $+1$ o $-1$, así que en promedio el total se queda cerca de cero. Pero «en promedio» esconde mucho deambular. Si jugaras a miles de estas partidas de un millón de tiradas e hicieras un histograma de los totales finales, surgiría una forma familiar:

```text
            .:||:.
          .:||||||:.
        .:||||||||||:.
      .:||||||||||||||:.
   ..:||||||||||||||||||:..
 -----------------0----------------
        total final tras n lanzamientos
```

<!-- IMAGE: histograma de las posiciones finales de muchos paseos aleatorios, formando una campana -->

Esta forma de campana es el famoso **Teorema Central del Límite** (TCL) en acción: suma una gran cantidad de pequeños empujones aleatorios e independientes, y el total seguirá una campana (una «distribución normal»), sin importar qué aspecto tuvieran los empujones individuales.

Pero fíjate en lo que el TCL nos ha dicho de verdad — y en lo que **no**:

> El Teorema Central del Límite nos dice dónde _acaban_ la mayoría de los caminantes. No dice nada sobre _cómo llegaron hasta allí_.

Ese es el resquicio por el que se cuela la paradoja.

## Alejándonos: del paseo aleatorio al movimiento browniano

Antes de volver al enigma, alejémonos — literalmente, vamos a hacer un _zoom out_.

Toma un paseo aleatorio y míralo desde lejos. Haz los pasos más pequeños y más frecuentes: en lugar de un gran paso por segundo, da cien pasos minúsculos, y luego diez mil aún más diminutos. A medida que los pasos se encogen hacia la nada, la escalera dentada se suaviza hasta convertirse en una curva continua, infinitamente ondulada.

```text
   paseo basto        paseo más fino       el más fino → mov. browniano
   _                  _                    .·'·.
  | |_      _        | |_   _.            ·    '·._.·'·.
  |   |_   | |       |   '·' |.            ·             '·.
 _|     |__| |     _·'         '·_       ·'                  '·.
```

<!-- IMAGE: un paseo aleatorio refinado en tres etapas hasta convertirse en un camino browniano suave -->

Ese límite tiene nombre: **movimiento browniano**, en honor al botánico Robert Brown, que en 1827 observó cómo unos granos de polen temblaban sin cesar en el agua sin saber por qué. **Einstein** explicó el temblor en 1905 (los granos son golpeados por moléculas de agua invisibles), y el matemático **Norbert Wiener** construyó el modelo matemático exacto en los años veinte. El hecho profundo de que un paseo aleatorio cada vez más fino _se convierta_ en movimiento browniano se conoce, de manera informal, como **teorema de Donsker**. De momento, sólo lo nombraremos.

> El movimiento browniano es el aspecto que tiene un paseo aleatorio cuando te alejas infinitamente.

Pero ¿qué tienen que ver unas motas flotando en el agua con un juego de lanzar monedas? Que la mota está jugando a ese mismo juego. Un grano de polen es demasiado grande para moverse por sí solo — hasta que las moléculas de agua invisibles que lo rodean, agitándose por el calor, lo golpean desde todas las direcciones a la vez. En cada instante unas cuantas más chocan por la izquierda que por la derecha, y el grano se desplaza un poco hacia la derecha; un momento después el desequilibrio se invierte y vuelve hacia atrás. Cada choque es un diminuto empujón al azar — una moneda lanzada millones de veces por segundo. Sigue la posición del grano a lo largo del tiempo y trazará exactamente el mismo camino dentado y errante que dibujamos para Alicia y Bruno. El paseo aleatorio abstracto y la mota de polen temblorosa no solo se parecen; son el _mismo_ objeto matemático — y ese _objeto_ es el movimiento browniano.

¿Alguna vez has lanzado unas monedas en nuestra página de [/es/play](https://flipthecoin.app/es/play/), has visto a una cara adelantarse y _quedarse_ por delante, y te has preguntado si la aleatoriedad estará rota?

Vamos a volver al agua. Con una sola gota de agua de río podemos verlo.

Imagina una molécula de agua a la deriva río abajo por un río ancho y lento. Olvida por un momento la corriente que la arrastra y fíjate solo en cómo deambula _de lado a lado_, de una orilla hacia la otra. Cada choque la empuja un poco a la izquierda o un poco a la derecha — otra vez un paseo aleatorio — así que, si dibujas esa posición lateral a medida que la molécula avanza río abajo (con la distancia recorrida río abajo haciendo el papel del tiempo), estás dibujando de nuevo nuestro gráfico. Y entonces: ¿esperarías alguna vez que la molécula viajara educadamente por el **centro exacto** del río durante todo su trayecto? Por supuesto que no. Se irá hacia una orilla y se quedará allí un buen rato, cruzará al otro lado, se pegará a la otra orilla durante un tiempo. Mantenerse equilibrada en el centro es lo único que casi nunca hace.

```text
 +3 |               __
 +2 |        ___   /  \
 +1 |    ___/   \_/
  0 |___/
 -1 |
    +------------------- tiempo
```

Una moneda justa se comporta igual. Cuando lanzas monedas en el [Juego de la Moneda](https://flipthecoin.app/es/play/) y ves un lado de la moneda ganar tres veces seguidas, o ves que «cara» se mantiene en cabeza durante cien tiradas seguidas, puede parecer que la moneda está rota o que la app está amañada. No lo está. **Las largas rachas de dominio de un solo lado no son un fallo de la equidad — son exactamente el aspecto que tiene la equidad vista de cerca.** La molécula no se queda en mitad del río, y la moneda no se queda cerca del empate.

> Si quieres saber más sobre cómo lanzamos la moneda en FlipTheCoin.app, puedes leer [Cómo lanzamos una moneda en FlipTheCoin.app](https://flipthecoin.app/es/blog/como-lanzamos-una-moneda).

## El descubrimiento de Lévy y la sorpresa de Chung y Feller

Volvamos a Alicia y Bruno. Queremos medir el _viaje_, no el destino. Así que nos preguntamos:

> De todo el año, ¿qué **fracción del tiempo** estuvo Alicia en cabeza?

Llamemos a esa fracción $x$, un número entre $0$ (Alicia nunca fue por delante) y $1$ (Alicia fue por delante todo el tiempo). Como acabamos de aprender lo de la campana, tu instinto probablemente diga: esta fracción debería acumularse alrededor de $x = \tfrac{1}{2}$, con una bonita joroba en el medio. La mitad del tiempo para Alicia, la mitad para Bruno — debería ser justo.

Ese instinto es incorrecto. La distribución real tiene este aspecto:

```text
 probable |\                            /|
          | \                          / |
          |  \                        /  |
          |   \__                  __/   |
 raro     |      \________________/      |
          +------------------------------+
          0     1/4     1/2    3/4       1
       Fracción del tiempo que Alicia lidera
```

<!-- IMAGE: la intuición de la campana a la izquierda, la verdadera curva en U del arcoseno a la derecha -->

Es una **forma de U**. Los resultados más probables son los extremos — Alicia liderando casi todo el tiempo, o casi nada. El resultado _menos_ probable es el «justo», en el que el liderazgo se reparte por igual. La fracción de tiempo en cabeza se comporta justo al revés que el marcador final.

Esto lo fueron armando varios matemáticos:

- A finales de los años treinta, **Paul Lévy** — uno de los fundadores de la probabilidad moderna — estudió cuánto tiempo pasa un movimiento browniano en el lado positivo. Encontró esta extraña ley en forma de U para el caso _contínuo_.
- **William Feller**, en su legendario libro de texto [_An Introduction to Probability Theory and its Applications_](https://bitcoinwords.github.io/assets/papers/an-introduction-to-probability-theory-and-its-applications.pdf), desarrolló la versión _discreta_ del lanzamiento de monedas con un detalle limpio y contable.
- Y el **teorema de Chung–Feller** ([Kai Lai Chung y William Feller, 1949](https://www.pnas.org/doi/pdf/10.1073/pnas.35.10.605)) clavó un hecho combinatorio preciso que está debajo de todo: entre todas las maneras en que un paseo de una longitud dada puede volver a cero, el número de ellas que pasan una cantidad de tiempo dada en positivo es asombrosamente _constante_ — la duración del liderazgo está, en un sentido profundo, repartida en lugar de concentrada.

Aquí va una metáfora para hacer real la forma de U. Dos corredores de maratón cruzan la meta en un empate exacto. Podrías suponer que se han intercambiado el liderazgo una y otra vez durante toda la carrera. Pero es mucho más común que un corredor se adelante en el primer kilómetro y lidere durante _casi todo el recorrido_, solo para ser alcanzado justo en la línea de meta. Un final empatado no significa una carrera compartida.

## Las leyes del arcoseno

La curva en forma de U tiene nombre y fórmula. Se llama **distribución del arcoseno**, y en el intervalo de $0$ a $1$ su densidad es:

$$f(x) = \frac{1}{\pi\sqrt{x(1-x)}}$$

Puedes leer la forma de U directamente de la fórmula: cuando $x$ se acerca a $0$ o a $1$, la parte de abajo de la fracción se encoge hacia cero, así que la curva se dispara hacia arriba. El medio, alrededor de $x=\tfrac12$, es donde más se hunde.

Para las monedas de verdad, antes de cualquier alejamiento, la versión discreta es igual de limpia. Si se lanza una moneda justa $2n$ veces, la probabilidad de que el paseo pase exactamente $2k$ de esos pasos en el lado positivo es:

$$P_{2k,\,2n} = \binom{2k}{k}\binom{2n-2k}{n-k}\,2^{-2n}$$

Aquí $n$ y $k$ son simplemente contadores — números enteros. Escribimos a propósito el número de lanzamientos como un número par $2n$ y el tiempo en cabeza como un número par $2k$, porque en esta clase de paseo el marcador solo puede volver a un empate cara-cruz tras un número par de lanzamientos, y el tiempo que un jugador pasa por delante siempre resulta ser par también. El contador $k$ va desde $0$ (nunca en cabeza) hasta $n$ (en cabeza toda la partida), así que la fracción de tiempo por delante es simplemente $\tfrac{2k}{2n} = \tfrac{k}{n}$.

Comprobémoslo con un juego diminuto de solo $4$ lanzamientos, de modo que $2n = 4$ y $n = 2$. Ahora $k$ solo puede valer $0$, $1$ o $2$, así que la fracción de tiempo en cabeza es $0$, $\tfrac12$ o $1$. Las tres probabilidades salen $\tfrac{6}{16}$ para «nunca por delante», $\tfrac{4}{16}$ para «por delante exactamente la mitad del tiempo» y $\tfrac{6}{16}$ para «por delante toda la partida». Incluso en este ejemplo de juguete la U ya está ahí: los dos extremos son cada uno _más_ probables que el centro de apariencia justa. Alarga el juego y la U solo se hace más profunda.

Y aquí viene la parte que siempre nos saca una sonrisa — literalmente. Dibuja estas probabilidades para un juego pequeño y obtendrás solo un puñado de puntos que trazan la U. Como los valores de los dos extremos se alzan muy por encima del centro hundido, esos puntos de los extremos parecen un par de ojos bien abiertos sobre una boca baja y curvada: la distribución del arcoseno parece estar _sonriéndonos_. Es una broma de lo más apropiada — la curva cuyo mensaje es que una moneda justa casi siempre parecerá injusta luce una cara que parece bastante satisfecha de ello.

![Probabilidades discretas del arcoseno p(2k,2n) frente a la fracción k/n para un número pequeño de lanzamientos; los pocos puntos forman una U que recuerda a una cara sonriente (los extremos altos son los ojos)](/img/uploads/Plot-of-the-probabilities-p-2k-2n-that-a-particle-spends-a-fraction-k-n-of-its-time-on.png)

<!-- IMAGE: probabilidades discretas del arcoseno p(2k,2n) frente a la fracción k/n para un número pequeño de lanzamientos; los pocos puntos forman una U que recuerda a una cara sonriente (los extremos altos son los ojos). Source: https://www.researchgate.net/figure/Plot-of-the-probabilities-p-2k-2n-that-a-particle-spends-a-fraction-k-n-of-its-time-on_fig2_378350410 -->

La parte verdaderamente mágica es que la **misma** ley del arcoseno aparece en tres preguntas distintas sobre el mismísimo paseo:

1. **Primera ley del arcoseno** — la _fracción de tiempo pasada en cabeza_ (por encima de cero). Ganan los extremos.
2. **Segunda ley del arcoseno** — el _momento en que el paseo alcanza su máximo_. Es más probable que la cima ocurra cerca del principio o del final, y menos probable en el medio.
3. **Tercera ley del arcoseno** — la _última vez que el paseo toca el cero_ (el empate final). De nuevo: un empate final temprano o tardío es mucho más probable que uno a mitad de camino.

Tres preguntas distintas, una curva rara. Esa repetición es lo que hace que las leyes del arcoseno parezcan una pieza de maquinaria oculta dentro de la propia aleatoriedad.

Una curiosidad sobre el **arcoseno**. Ya nos hemos cruzado con la palabra «arcoseno» en este blog, en [el artículo sobre lanzar una moneda hasta llegar a π](https://flipthecoin.app/es/blog/lanzando-una-moneda-hasta-obtener-pi/). Aquel hablaba de la _función_ arcoseno de la trigonometría; este habla de la _distribución_ del arcoseno. Son objetos distintos — pero no desconocidos. La distribución se gana su nombre porque la probabilidad de liderar menos de una fracción $x$ del tiempo es exactamente $\tfrac{2}{\pi}\arcsin\!\left(\sqrt{x}\right)$, la función arcoseno disfrazada. Y ambas historias están secretamente impulsadas por el mismo número, el coeficiente binomial central $\binom{2n}{n}$. La aleatoriedad no deja de reutilizar sus piezas favoritas.

## Lo que el Teorema Central del Límite no nos cuenta

Llegados a este punto, un/a lector/a atento/a siente venir una contradicción. Dijimos que el marcador final sigue una campana ordenada, centrada en el empate. Ahora decimos que el liderazgo casi nunca se reparte por igual. **¿Está mal el Teorema Central del Límite?**

No. Las dos leyes responden a dos preguntas completamente distintas sobre la misma moneda. Esta es la separación entre viaje y destino que comentábamos al principio, hecha precisa:

| Lo que medimos                        | Qué ley lo gobierna                  |
| :------------------------------------ | :----------------------------------- |
| Marcador final (dónde acaba el paseo) | Teorema Central del Límite — campana |
| Fracción del tiempo en cabeza         | Ley del arcoseno — forma de U        |
| Momento del liderazgo máximo          | Ley del arcoseno — forma de U        |
| Instante del último empate            | Ley del arcoseno — forma de U        |

El mismo proceso. Observables distintos. Respuestas distintas. La moneda puede acabar casi nivelada (la campana, sobre el destino) _y_ pasar casi todo el juego desequilibrada (la ley del arcoseno, sobre el viaje). No hay contradicción — solo dos verdades que viven en el hueco que marcamos al principio.

## Una reflexión final sobre el azar

¿Por qué la forma de U nos resulta tan contraintuitiva? Porque somos contadores de historias. No vivimos un año, ni un juego, ni una vida como un único marcador final. Lo vivimos momento a momento, como un _camino_. Y un camino que se queda en un lado durante una eternidad nos suena a impulso, a racha, a mano caliente, a destino — incluso cuando no es más que una moneda justa haciendo exactamente lo que hacen las monedas justas.

Nuestra intuición falla en _ambos_ extremos. Subestimamos gravemente cuánto tiempo se mantendrá de un solo lado una moneda justa corriente — y sobrestimamos igual de mal las rachas verdaderamente espectaculares. Como explica Evelyn Lamb en [un artículo genial sobre si alguien ha sacado alguna vez 76 caras seguidas](https://www.scientificamerican.com/blog/roots-of-unity/has-anyone-ever-flipped-heads-76-times-in-a-row/), las rachas que _parecen_ que deberían aparecer de vez en cuando son tan astronómicamente improbables que, entre todas las monedas jamás lanzadas, podemos presumir que nunca han ocurrido.

El Teorema Central del Límite promete que la aleatoriedad se equilibra a largo plazo. Las leyes del arcoseno añaden un aviso más silencioso y más extraño: **ese equilibrio puede permanecer completamente invisible mientras está ocurriendo.** Las cuentas solo se igualan cuando te alejas lo suficiente para ver el conjunto entero de una sola vez.

Así que la próxima vez que un proceso justo parezca injusto — una moneda en racha, una temporada en la que nada te sale bien — acuérdate de la molécula en el río. No está atascada. No está rota. Simplemente nunca prometió quedarse en el centro. La vida son rachas y como decía Einstein, La vida es como una bicicleta; para mantener el equilibrio tienes que seguir adelante».

Pon la teoría en práctica: [lanza una moneda online](https://flipthecoin.app/es/play/) y observa cómo una moneda justa parece injusta y cómo rachas de resultados repetidos son mucho más probables de lo que cabría esperar.
