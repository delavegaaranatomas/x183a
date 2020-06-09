//====================================
//FUNCIONES GENERALES
//====================================

function pintarHTML(targetDiv, htmlContenido) {
    document.getElementById(targetDiv).innerHTML = htmlContenido;
}

function mostrar(panel) {
    panel.style.display = "block";
}

function ocultar(panel) {
    panel.style.display = "none";
}

var preloadImages = "img/candy01.png,img/candy02.png,img/Disparo.png,img/explosion.png".split(",");



var tempIMG = [];

function preloadIMG() {
    for (var i = 0; i < preloadImages.length; i++) {
        tempIMG[i] = new Image();
        tempIMG[i].src = preloadImages[i];
    }
}


function shuffle(array) {
    var rand, index = -1,
        length = array.length,
        result = Array(length);
    while (++index < length) {
        rand = Math.floor(Math.random() * (index + 1));
        result[index] = result[rand];
        result[rand] = array[index];
    }
    return result;
}


function stringDate() {
    var fecha = new (Date);
    return (String(fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()));
    //return (String(fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + "/" + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds()));
}

function stringTime() {
    var fecha = new (Date);
    return (String( fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds()));
}
//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++
//
//      VARIABLES GLOBALES
//
//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++



var fecha = stringDate();         //fecha y hora...
var horaInicio = stringTime();
var personId = Math.floor((Math.random() * 1000000) + 1); //ID aleatorio
var data = "";                //aquí guardaremos los datos
var experimentCode = "x183a";
var gender = "";
var age = "";
var group = 99;
var groupName = "";         //guarda el nombre del grupo (más cómodo)

var state = 0;               //contador ensayo
var disparosLeft = 0;        //contador de disparos disponibles por ronda
var precioDisparo = 1;      //por defecto, cada disparo vale un disparo. (puede aumentar si pides un crédito)
var ronda = 0;              //contador de ronda
var rondas = 10;             // Número de rondas totales. Recordar ponerlo a 10.
var puntosRonda = 0;
var puntosTotal = 0;
var prestamosTotales = 0;   // Número de prestamos totales disponibles.

var disparosRico = 15;      //número de disparos de cada grupo
var disparosPobre = 3;
var disparosDisponibles = 0;    // Número de disparos disponibles para el juego. 
var disparosTotales = 0;
var prestamosMaximos = 0;

var button1 = document.getElementById("botonDispara");
var button2 = document.getElementById("botonOmitir");

var allowCredit = 0;        //Permite el endeudamiento? (Depende del grupo)

var roundTrialsData = [] //Array.from(Array(10), () => new Array());//array con los datos de las rondas.
var arrayTrials = [];   //array con los ensayos de CADA ronda
var numFijos = 7;       //número de objetivos fijos por ronda
var numMoviles = 14;    //número de objetivos móviles por ronda
var prestamosPobres = 12;
var prestamosRicos = 21;

var seqTrials = [];
var seqResps = [];
var seqExplos = [];
var seqResps2 = []; //vector con nº d eesp en cada ensayo

var disparosBlancosSeguros = 0;
var disparosBlancosArriesgados = 0;
var prestamosSolicitados = 0;
var rondasSinDisparos = 0;


// variables para la valoración.
var slider;
var sliderValue = 0;

var instrucciones;

class Trial {
    constructor(name) {
        this.name = name;
        this.imagen = name === "Fijo" ? "<img src=\"img/candy01.png\" width=\"400px\" class= \"fijo_idle\">": "<img src=\"img/candy02.png\" width=\"400px\" class= \"movil_idle\">";
        this.chancesHit = name === "Fijo" ? [1] : this.getChances();
        this.responses = 0;
        this.exploded = 0;
    }
    getChances() {
        var chances = new Array(10);
        for(var i=0;i<chances.length;i++){
            chances[i] = i=== 0 ? 1 : 0;
        }
        return shuffle(chances);
    }
  }

//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++
//
//      instrucciones
//
//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++

function cargarinstrucciones() {
    instrucciones = {
        Compatibilidad: "<h2><p align=\"center\">ATTENTION</h2><p><p align=\"center\">This experiment is designed to function on a <b>personal computer</b>, not on a mobile device (tablet, smartphone), and it is <b>only compatible with an updated version of Google Chrome or Mozilla Firefox browsers</b>. If you have tried to access with another browser, please try again using Google Chrome or Mozilla Firefox.<p align=\"center\"><img src=\"img/Chrome.png\" style=\"padding:3%\"width=\"93\"><img src=\"img/Firefox.png\" width=\"100\" style=\"padding:3%\"><p align=\"center\"> When you are ready, click on the arrow to begin the experiment",
    
        Incompatible: "<p align=\"center\">Sorry but this study is designed to run on a desktop computer, not on a mobile device (tablet, smartphone), and it is only compatible with an updated version of Google Chrome or Mozilla Firefox.<p align=\"center\"> <b> Please, try again using an updated version of Google Chrome or Mozilla Firefox on a desktop computer.",
    
        Notas: "<h2>Instructions</h2>Remember that in this study you are not allowed to jot down notes: rather, you should rely on your memory and intuition abilities to find out whether the treatment works. <p><br><p align=\"center\"><img src=\"img/Notes.png\" width=\"180\"><br><br><p><p align=\"center\"><b>Good luck!",
    
        Consentimiento: "<h2>Tu participación es voluntaria y anónima</h2><p>Antes de nada queremos agradecer tu participación en este experimento, ya que sin la colaboración de personas como tú no sería posible esta investigación.<br>Debes saber que en esta tarea no hay respuestas buenas ni malas. Lo que queremos estudiar son los mecanismos psicológicos básicos que se dan en todas las personas. Para ello, necesitamos que, si deseas participar, lo hagas con el mayor interés. No tienes que identificarte, y los datos que nos aportes se unirán a los del total del grupo y serán analizados estadísticamente. Tu participación es voluntaria y anónima.<br>Si tras haber leído el mensaje deseas continuar, por favor pulsa en el botón Continuar.</p>",
    
        SociodemografProlific:"<p>Por favor, responde las siguientes preguntas:</p><form name='input><label for='age'>Edad:</label><input type='number' id='age' name='age' min='18' max='100' step='1' value=''><br>  <label for='gender'>Género: </label><input type='radio' id='male' name='gender' value='hombre'><label for='male'>Hombre</label><input type='radio' id='female' name='gender' value='mujer'><label for='female'>Mujer</label><input type='radio' id='other' name='gender' value='otro'><label for='other'>Otro/Prefiero no decirlo</label></form>",
    
        Pantalla1: "<h2>Bienvenido/a.</h2><p>Por favor no tomes notas ni realices ninguna otra actividad como usar el móvil mientras realizas este estudio.</p>",
    
        Pantalla2: "<h2>¿Qué es “Tiro al blanco”?</h2><p>Tiro al blanco es un sencillo juego de estrategia en el que la suerte también cuenta. El objetivo es conseguir el mayor número posible de puntos: Cada blanco alcanzado proporciona un punto.</p>",
    
        Pantalla3: "<h2>¿Cómo se juega?</h2><p>A lo largo de 10 rondas irán apareciendo de uno en uno, dos tipos de blancos distintos: Blancos fijos y blancos móviles.<br>Deberás decidir si disparas o si no disparas. Además, mientras tu prepuesto de disparos no se haya terminado, podrás disparar a un mismo blanco cuantas veces quieras. Ten en cuenta que los blancos fijos son mucho más fáciles de acertar que los blancos móviles.<br>Si en una ronda consigues alcanzar 7 blancos, automáticamente se te sumarán 3 puntos adicionales y finalizarás esa ronda con la puntuación máxima: 10 puntos.<br>A veces es posible pedir prestados disparos de rondas posteriores: Solo podrás pedir préstamos una vez has agotado tu presupuesto: En ese momento, se activará la función \“Pedir préstamos\” y tú decidirás si continúas jugando o si pasas a la siguiente ronda. Ten en cuenta que por cada disparo pedido en préstamo, se te descontarán 2 disparos de tu presupuesto total.</p>",
        
        Pantalla4: "<h2>¿Cómo se juega?</h2><p>Tu presupuesto es de " + disparosLeft + " disparos por ronda.<br>Recuerda que tu objetivo es conseguir el mayor número posible de puntos.<br>Para ello, en primer lugar deberás consultar si en tu caso se ha autorizado o se ha denegado la capacidad de solicitar préstamos y a partir de ese momento podrás empezar a jugar.<br>¡Prueba tu suerte y mide tus habilidades!<p>",
    
        Pantalla5: "",
        
        PantallaCredito: "",    //se asigna más tarde en la función asignagroup
    
        Final: "", //se asigna más tarde
    
        PantallaValoracion: "<h2>¿En qué medida -de 0 a 100- consideras que haber tenido más disparos disponibles te habría ayudado a obtener una mayor puntuación?</h2><p>Responde usando la siguiente escala, donde los números se interpretan así:<br>0: No me habría ayudado nada.<br>50: Me habría ayudado algo.<br>100: Me habría ayudado muchísimo.<br>Puedes hacer click dentro de la escala tantas veces como desees hasta marcar el valor que consideres más adecuado. Cualquier valor entre 0 y 100 es válido.<br><br><div class='valores'><table class='tabla'><tr><td class='cell_value_left'><strong>0</strong></td><td class='cell_value_center'><strong>50</strong></td><td class='cell_value_right'><strong>100</strong></td></tr></table></div><div class='slidecontainer' id='testSlider'><input type='range' min='0' max='100' value='0' class='sliderTest' id='myRangeTest'></div><div class='slidecontainer' id='slider'><input type='range' min='0' max='100' value='0' class='slider' id='myRange'><p>Tu respuesta: <span id='value'></span></p></div></p>",
    
        PantallaEnviarDatos: "<h2>Envío de datos</h2><p>A continuación podrás enviar los resultados para que se incluyan en nuestro estudio, los datos que nos aportes se unirán a los del grupo y serán analizados estadísticamente. Para hacerlo haz click en el botón \"Enviar\". Si por alguna razón no deseas enviarnóslos haz click en el botón \"Cancelar\".</p>",
    
        PantallaFinal: "<h2>Muchas gracias</h2><p>Antes de nada queremos darte las gracias por tu colaboración en este experimento.<br>Nuestra labor de investigación sería imposible si no fuera por la participación voluntaria de personas como tú que deciden dedicarnos parte de su tiempo. Suponemos que ahora que has terminado el experimento te gustaria recibir una explicación sobre lo que tratabamos de estudiar.<br>Nuestra intención es estudiar cómo afecta la escasez en la toma de decisiones de las personas y cuales pueden ser sus consecuencias. Queríamos comprobar si el hecho de tener más o menos presupuesto disponible influye sobre las decisiones de endeudamiento y de ahorro; sobre la estrategia de juego, sobre los resultados obtenidos y sobre la valoración de los recursos.<br>Muchas gracias por tu participación.<br>Para saber más...<br>Si quieres saber más acerca de la Psicología de la Escasez te recomendamos que leas:<br>Mullainathan, S. y Shafir, E. (2016). Escasez: ¿Por qué tener muy poco significa tanto?.<br>México D.F.: Fondo de Cultura Económica.</p>"
    };
}


//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++
//
//      INICIO:
//
//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++

function arranca() {
    alert("Pulsa F11 para verme a pantalla completa");
    TimeInicioTarea = Date.now();
    preloadIMG();
    //group = Math.floor((Math.random() * 4) + 1);    // Elige grupo al azar: de 1 a 4.
    var option = shuffle([1,2,3,4]);
    group = option.shift();
    asignagroup();                                  // Función que aplica cambios según el grupo.
    showInstruc();                                  // Mostrar instrucciones.

}

function asignagroup() {
    switch (group) {
        case 1: //RICOS SIN PRÉSTAMOS
            disparosLeft = disparosRico;
            allowCredit = 0;
            groupName = "Ricos sin préstamos";
            disparosDisponibles = disparosRico * rondas;
            break;
        case 2: //POBRES SIN PRESTAMOS
            disparosLeft = disparosPobre;
            allowCredit = 0;
            groupName = "Pobres sin préstamos";
            disparosDisponibles = disparosPobre * rondas;
            break;
        case 3: //RICOS CON PRÉSTAMOS
            disparosLeft = disparosRico;
            allowCredit = 1;
            groupName = "Ricos con préstamos";
            disparosDisponibles = disparosRico * rondas;
            prestamosTotales = roundDown(disparosDisponibles);
            prestamosMaximos = 67;
            break;
        case 4: //POBRES CON PRÉSTAMOS
            disparosLeft = disparosPobre;
            allowCredit = 1;
            groupName = "Pobres con préstamos";
            disparosDisponibles = disparosPobre * rondas;
            prestamosTotales = roundDown(disparosDisponibles);
            prestamosMaximos = 13;
    }
    disparosTotales = (group === 1 || group === 3) ? disparosRico * rondas : disparosPobre * rondas;
    // cargarinstrucciones
    cargarinstrucciones(); 

    if (allowCredit == 1) {
        instrucciones.PantallaCredito = "¡¡Has tenido suerte!! El banco sí te permite endeudarte. Podrás pedir préstamos mientras juegas. Aunque termines tu presupuesto de disparos, podrás seguir jugando.";
    }
    else {
        instrucciones.PantallaCredito = "¡¡Qué pena!! El banco no te permite endeudarte. No podrás pedir préstamos mientras juegas. Cuando termines tu presupuesto de disparos, se terminará también la ronda.";
    }


}

function CheckBrowser() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        ocultar(Next);
        htmlContenido = instrucciones.Incompatible;
        pintarHTML("divTextos", htmlContenido);
        mostrar(divTextos);
    }
    else if (navigator.userAgent.indexOf('Chrome') !== -1 || navigator.userAgent.indexOf('Firefox') !== -1) {
        InicioExperimento();
    }
    else {
        ocultar(Next);
        htmlContenido = instrucciones.Incompatible;
        pintarHTML("divTextos", htmlContenido);
        mostrar(divTextos);
    }
}
/**
 * 
 * Función que válida los datos del formulario.
 */
function checkForm() {
    age = document.getElementById('age').value;;
    gender = getCheckedValue(document.getElementsByName('gender'));
    pantalla1();
}
/**
 * Función que devuelve el valor seleccionado de los radio buttons.
 * @param {NodeList} radio 
 */
function getCheckedValue(radio) {
    for(var i=0; i < radio.length;i++){
        if(radio[i].checked)
            return radio[i].value;
    }
    return "";
}

/**
 * 
 * @param {Valor seleccionado en la slider por el usuario.} value 
 */
function checkSliderValue(value){
    if(value === "")
        alert("Debe seleccionar un valor para poder continuar.");
    else {
        sliderValue = value;
        pantallaEnviarDatos();
    }
}

function closeWindow() {
    if(confirm("Close Window?")) {
        close();
    }
}

function showInstruc() {
    ocultar(divContenidoJuego);
    consentimiento();
}

function consentimiento() {
    pintarHTML("divTextos", instrucciones.Consentimiento);
    pintarHTML("divBoton", "<button class='btnScreens' onclick='sociodemografProlific()'>Empezar</button>");
    mostrar(divTextos);
}

function sociodemografProlific() {
    pintarHTML("divTextos", instrucciones.SociodemografProlific);
    pintarHTML("divBoton","<button class='btnScreens' onclick='checkForm();'>Continuar</button>")
    mostrar(divTextos);
}

function pantalla1() {
    ocultar(divTextos);
    pintarHTML("divTextos", instrucciones.Pantalla1);
    pintarHTML("divBoton", "<button class='btnScreens' onclick='pantalla2();'>Continuar</button>");
    mostrar(divTextos);
}

function pantalla2() {
    ocultar(divTextos);
    pintarHTML("divTextos", instrucciones.Pantalla2);
    pintarHTML("divBoton", "<button class='btnScreens' onclick='pantalla1();'>Atrás</button><button class='btnScreens' onclick='pantalla3();'>Continuar</button>");
    mostrar(divTextos);
}

function pantalla3() {
    ocultar(divTextos);
    pintarHTML("divTextos", instrucciones.Pantalla3);
    pintarHTML("divBoton","<button class='btnScreens' onclick='pantalla2();'>Atrás</button><button class='btnScreens' onclick='pantalla4();'>Continuar</button>");
    mostrar(divTextos);
}

function pantalla4() {
    ocultar(divTextos);
    pintarHTML("divTextos", instrucciones.Pantalla4);
    pintarHTML("divBoton","<button class='btnScreens' onclick='pantalla3();'>Atrás</button><button class='btnScreens' onclick='pantallaCredito();'>Continuar</button>");
    mostrar(divTextos);
}

function pantallaCredito() {
    ocultar(divTextos);
    pintarHTML("divTextos", instrucciones.PantallaCredito);
    pintarHTML("divBoton", "<button class='btnScreens' onclick='cambiaRonda()'>Empezar</button>");
    //pintarHTML("divBoton", "<button class='btnScreens' onclick='pantallaValoracion();'>Empezar</button>");
    mostrar(divTextos);
}

function pantallaValoracion() {
    ocultar(divTextos);
    pintarHTML("divTextos", instrucciones.PantallaValoracion);
    pintarHTML("divBoton", "<button class='btnScreens' onclick='checkSliderValue(output.innerHTML);'>Continuar</button>");
    mostrar(divTextos);
    document.getElementById("myRangeTest").addEventListener("click", changeDisplay);
}

function pantallaEnviarDatos() {
    ocultar(divTextos);
    pintarHTML("divTextos", instrucciones.PantallaEnviarDatos);
    pintarHTML("divBoton","<button class='btnScreens' onclick='pantallaFinal(0)'>Cancelar</button><button class='btnScreens' onclick='pantallaFinal(1);'>Enviar</button>");
    mostrar(divTextos);
}

function pantallaFinal(save) {
    if(save === 1)
        saveData();
    ocultar(divTextos);
    pintarHTML("divTextos", instrucciones.PantallaFinal);
    ocultar(divBoton);
    pintarHTML("divBoton","<button class='btnScreens' onclick='closeWindow();'>Salir</button>");
    mostrar(divTextos);
    mostrar(divBoton);
}

/**
 * Función que inicializa la slider
 */
function initSlider(value) {
    slider = document.getElementById("myRange");
    output = document.getElementById("value");
    slider.value = value;
    output.innerHTML = slider.value;
    
    slider.oninput = function() {
      output.innerHTML = this.value;
    }
}

function changeDisplay() {
    var clickValue = document.getElementById("myRangeTest").value;
    var sliderTest = document.getElementById("testSlider");
    sliderTest.style.display = "none";
    var div = document.getElementById("slider");
    div.style.display = "block"

    initSlider(clickValue);
}


//=========================================
//     mecánica del juego
//=========================================

function cambiaRonda() {
    ocultar(divTextos);
    ocultar(divBoton);
    ocultar(divContenidoJuego);
    ocultar(divDisparosEndeudamiento);

    if (ronda == rondas || disparosDisponibles === 0) {
        finJuego();
    } else {
        roundTrialsData.push(new Array());
        //genera los ensayos:
        arrayTrials = new Array(21); //inicializar el array
        for(var i=0;i<arrayTrials.length;i++){
            arrayTrials[i] = i < numFijos ? new Trial("Fijo") : new Trial("Movil");
        }
        arrayTrials = shuffle(arrayTrials);

        state = 0;                  //resetea el contador de ensayos
        puntosRonda = 0;            // resetea los puntos de la ronda.
        precioDisparo = 1;          //al iniciar la ronda, el precio es el normal.
        ronda++;                    //suma una ronda: si es la primera, pasa de 0 a 1.
        switch (group) {
            case 1: //RICO-Sin deudas
                disparosLeft = ronda === 1 ? disparosRico : calcularDisparos(disparosRico +  disparosLeft);
                break;
            case 2: //POBRE-Sin deudas
                disparosLeft = ronda === 1 ? disparosPobre : calcularDisparos(disparosPobre + disparosLeft);
                break;
            case 3: //RICO-Con deudas
                disparosLeft = ronda === 1 ? disparosRico : calcularDisparos(disparosRico +  disparosLeft);
                break;
            case 4: //POBRE-Con deudas
                disparosLeft = ronda === 1 ? disparosPobre : calcularDisparos(disparosPobre + disparosLeft);
        }
        pintarHTML("divDisparosEndeudamiento","x <img src=\"img/deudaPrecio.png\" width=\"60px\">");
        pintarHTML("divDisparos", disparosLeft + "x <img src=\"img/Disparo.png\" width=\"20px\">");

        pintarHTML("divRondaScreen", "RONDA " + ronda);
        mostrar(divRondaScreen);

        setTimeout("ocultar(divRondaScreen)", 3000);
        setTimeout("startTrial()", 3100);
    }
}

function calcularDisparos(disparos) {
    return disparosDisponibles <= disparos ? disparosDisponibles : disparos;
}

//Esta función me devuelve la lista de tipos de ensayo, los números de respuesta de cada ensayo... para guardarlos

function contarTrials() {
    for (var i = 0; i < arrayTrials.length; i++) {
        seqTrials.push(arrayTrials[i].name);
        seqExplos.push(arrayTrials[i].exploded);
        seqResps.push(arrayTrials[i].responses);
    }
}
//función para activar/desactivar los botones:
function toggleButtons() {
    var button1 = document.getElementById("botonDispara");
    var button2 = document.getElementById("botonOmitir");

    if (button1.disabled == true) button1.disabled == false;
    else if (button1.disabled == false) button1.disabled == true;
    if (button2.disabled == true) button2.disabled == false;
    else if (button2.disabled == false) button2.disabled == true;

}

//comienza el ensayo:
function startTrial() {
    ocultar(targetCandy);
    ocultar(explosionHit);
    ocultar(pointsHit);
    ocultar(textoFallo);
    mostrar(divContenidoJuego);


    pintarHTML("divRonda", "RONDA: " + ronda);
    pintarHTML("divPuntos", "Puntos total: " + puntosRonda);
    if(precioDisparo == 2) {
        pintarHTML("divDisparos", disparosDisponibles + "x <img src=\"img/Disparo.png\" width=\"20px\">");
        pintarHTML("divDisparosEndeudamiento", "<img src=\"img/deudaPrecio.png\" width=\"60px\">");
    } else {
        pintarHTML("divDisparos", disparosLeft + "x <img src=\"img/Disparo.png\" width=\"20px\">");
    }

    button1 = document.getElementById("botonDispara");
    button2 = document.getElementById("botonOmitir");


    var htmlcode = arrayTrials[state].imagen;
    pintarHTML("targetCandy", htmlcode);
    var target = document.getElementById("targetCandy");
    if (arrayTrials[state].name == "Fijo") {
        target.classList.add("fijo_idle");
    } else if (arrayTrials[state].name == "Movil") {
        target.classList.add("movil_idle");
    }

    button1.disabled = false;
    button2.disabled = false;

    mostrar(targetCandy);

}

//función que describe qué pasa cuando disparas. 
function shotTrial() {

    if(arrayTrials[state].name === "Fijo")
        disparosBlancosSeguros++;
    else
        disparosBlancosArriesgados++;
    
    // Actualizar contadores de disparos y prestamos disponibles;
    disparosLeft = precioDisparo === 1 ? disparosLeft -= 1 : disparosLeft;
    disparosDisponibles -= precioDisparo;
    prestamosTotales = allowCredit === 1 ? roundDown(disparosDisponibles) : prestamosTotales;
    prestamosSolicitados = precioDisparo === 1 ? prestamosSolicitados : prestamosSolicitados += 1;

    var target = document.getElementById("targetCandy");

    // Anular el botón mientras explota o no...
    button1.disabled = true;
    button2.disabled = true;

    arrayTrials[state].responses++;                                 // se incrementa en uno el número de respuestas.

    if (arrayTrials[state].chancesHit.pop() == 1) {                 //Acierto
        arrayTrials[state].exploded = 1;                            //guarda que en este ensayo ha habido explosión.
        roundTrialsData[ronda-1].push(arrayTrials[state]);          //añadir ensayo al array de datos.
        seqResps2.push(arrayTrials[state].responses);

        target.classList.add("hit");                                //animaciones y señales extra en la explosion...
        mostrar(explosionHit);
        mostrar(pointsHit);

        puntosRonda++;          //sumamos los puntos y avanzamos el ensayo
        puntosTotal++;
        state++;                //se incrementa el índice

        var puntos = document.getElementById("divPuntos");
        puntos.classList.add("UpdateStats");
        //setTimeout("puntos.classList.add('UpdateStats')", 500);

        setTimeout('CheckParams()', 2000);
    } else { // Fallo
        mostrar(textoFallo);
        setTimeout('CheckParams()', 1000);
    }
}

function skipTrial() {

    //tengo que programarlo para que no les deje pulsar el botón mientras,
    button1.disabled = true;
    button2.disabled = true;

    var target = document.getElementById("targetCandy");
    target.classList.add("classITI");
    ocultar(targetCandy);

    seqResps2.push(arrayTrials[state].responses); // guardar el valor en el array
    roundTrialsData[ronda-1].push(arrayTrials[state]);
    state++; // incrementar el contador

    setTimeout('CheckParams()', 1000);
}

function CheckParams() {

    pintarHTML("divRonda", "RONDA: " + ronda);
    pintarHTML("divPuntos", "Puntos total: " + puntosRonda);
    pintarHTML("divDisparos", disparosLeft + "x <img src=\"img/Disparo.png\" width=\"20px\">");

    if(precioDisparo === 2) {
        pintarHTML("divDisparosEndeudamiento", "x <img src=\"img/deudaPrecio.png\" width=\"60px\">")
    }

    // Actualizar marcadores.
    var puntos = document.getElementById("divPuntos");
    puntos.classList.remove('UpdateStats');

    //reinicia el caramelo... (le quita las clases de hit y de ITI...)
    var target = document.getElementById("targetCandy");
    target.classList.remove("hit");
    target.classList.remove("classITI");

    // Reiniciar botones...
    button1.disabled = false;
    button2.disabled = false;

    if(disparosDisponibles <= 0 || (prestamosSolicitados == prestamosMaximos && allowCredit == 1)) { // Fin del juego. Mostrar pantalla fin ronda y fin juego.
        disparosDisponibles = 0;
        checkPoints();
        contarTrials();
        decideTexto(0);
        //finJuego();
    } else if(state == arrayTrials.length) { // Se han acabado los ensayos. Mostrar pantalla fin ronda y fin juego si se se está en la última ronda.
        checkPoints();
        contarTrials();
        decideTexto(0);
    } else if(puntosRonda === 7) { // Se han acertado con los siete objetivos. Mostrar pantalla fin ronda y fin juego si se se está en la última ronda. 
        // Se dan 3 puntos extra.
        puntosRonda += 3;
        puntosTotal += 3;
        contarTrials();
        decideTexto(0);
    } else if (disparosLeft == 0 && precioDisparo === 1) { // No nos quedan más disparos.
        if(allowCredit == 0) { // No permite endeudamiento.  Mostrar pantalla fin ronda y fin juego si se se está en la última ronda.
            contarTrials();
            decideTexto(0);
        } else if(allowCredit == 1) { // Permite endeudamiento. El usuario decide si quiere endeudarse.
            contarTrials();
            decideTexto(1);
        }
    } else { // Siguiente ensayo.
        startTrial();
    }
}

function checkPoints() {
    if(puntosRonda === 7) {
        puntosRonda += 3;
        puntosTotal += 3;
    }
}

function finJuego() {
    ocultar(divContenidoJuego);
    instrucciones.Final = "<h2>Puntuaciones finales</h2><p>Has llegado al final del juego.</p><p>Puntuación total juego: " + puntosTotal + " puntos.</p><p>Ratio de acierto: " + Math.round(((puntosTotal/(disparosBlancosArriesgados + disparosBlancosSeguros)) + Number.EPSILON) * 100) / 100 + "</p><p>Disparos sobrantes: " + disparosDisponibles + "</p>";

    pintarHTML("divTextos", instrucciones.Final);
    pintarHTML("divBoton", "<button class='btnScreens' onclick='pantallaValoracion();'>Continuar</button>");

    mostrar(divTextos);
    mostrar(divBoton);
}

function decideTexto(value) {
    if(value === 0) { // caso en el que has conseguido los 7 objetivos o se han acabado los ensayos de la ronda o se te han agotado los disparos totales.
        var htmltexto = "<h2>Tus resultados en la ronda " + ronda +"</h2><p>Tu puntuación en esta ronda es de: <b>" + puntosRonda + "</b> puntos.</p><p>Tu puntuación total es de: <b>" + puntosTotal + "</b> puntos.</p><p>Número de disparos acumulados para la siguiente ronda: " + disparosLeft + "</p> <button id=\"botonSiguienteRonda\" class=\"buttonDeudas\" onclick=\"siguienteRonda()\"  disabled=\"false\">Continuar</button>";
        pintarHTML("divNoDisparos", htmltexto);
        document.getElementById("botonSiguienteRonda").disabled = false;
    } else { // caso en el que se te han acabado los disparos de la ronda y puedes endeudarte.
        var htmltexto = "<h2>ATENCIÓN</h2><p>No te quedan más disparos.</p><img src=\"img/noShotsLeft.png\" width=\"120px\"><p>Tu puntuación en esta ronda es de: <b>" + puntosRonda + "</b> puntos.</p><p>Tu puntuación total es de: <b>" + puntosTotal + "</b> puntos.</p> <p>Tienes la posibilidad de <b>pedir un crédito</b> para seguir jugando esta ronda. Si pides el crédito, tendrás más posibilidades de disparar, pero cada disparo que hagas te descontará dos balas.</p><div class = \"column2\"><button id=\"botonEndeudarse\" class=\"buttonDeudas\" onclick=\"deuda()\"  disabled=false>Endeudarme</button></div><div class = \"column2\"><button id=\"botonSiguienteRonda\" class=\"buttonDeudas\" onclick=\"siguienteRonda()\"  disabled=false>No endeudarme</button></div>";
        pintarHTML("divNoDisparos", htmltexto);
        document.getElementById("botonEndeudarse").disabled = false;
        document.getElementById("botonSiguienteRonda").disabled = false;
    }
    mostrar(divNoDisparos);
}


function deuda() {
    document.getElementById("botonEndeudarse").classList.add("buttonDeudasclicked"); //pone el botón en rojo.
    document.getElementById("botonEndeudarse").disabled = true;//desactiva los botones
    document.getElementById("botonSiguienteRonda").disabled = true;

    precioDisparo = 2;

    htmlContenido = "<h2>CRÉDITO ADJUDICADO</h2><p>A partir de este momento, cada disparo te cuesta DOS unidades de munición.<br>Actualmente dispones de " + disparosDisponibles + "</p><img src=\"img/deudaPrecio.png\" height=\"120px\"> <p>Puedes continuar la ronda.</p><button id=\"botonContinua\" class=\"buttonDeudas\" onclick=\'sigueRonda()'>Continuar</button>";

    //setTimeout("pintarHTML('divNoDisparos', '')", 500);
    setTimeout("pintarHTML('divNoDisparos', htmlContenido)", 1000);

}


function sigueRonda() {
    if(allowCredit === 1)
        mostrar(divDisparosEndeudamiento);
    ocultar(divNoDisparos);
    startTrial();
}

function siguienteRonda() {
    if(allowCredit === 1)
        ocultar(divDisparosEndeudamiento);
    ocultar(divNoDisparos);
    cambiaRonda();
}

//====================================
//          FINAL DEL ESTUDIO
//====================================


function saveData() {
    data = {
        "Grupo" : group,
        "Escasez" : (group == 1 || group == 3) ? "No" : "Sí",
        "Prestamos" : (allowCredit == 0) ? "No" : "Sí",
        "NumDisparosDisponible" : disparosTotales,
        "Fecha" : fecha,
        "HoraInicio" : horaInicio,
        "HoraFin" : stringTime(),
        "Genero" : gender,
        "Edad" : age,
        "IdParticipante" : personId,
        "NumTotalPuntos" : puntosTotal,
        "NumTotalDisparosBlancosSeguros" : disparosBlancosSeguros,
        "NumTotalDisparosBlancosArriesgados" : disparosBlancosArriesgados,
        "NumTotalPrestamosSolicitados" : prestamosSolicitados,
        "EstrategiaAhorro" : roundWithoutShots(),
        "ValoracionRecurso" : sliderValue,
        "NumTotalDisparosRealizados" : disparosBlancosArriesgados + disparosBlancosSeguros,
        "RatioPuntuación" : (group == 1 || group == 3) ? Math.round(((puntosTotal/100) + Number.EPSILON) * 1000) / 1000 : Math.round(((puntosTotal/42) + Number.EPSILON) * 1000) / 1000,
        "RatioAcierto" : Math.round(((puntosTotal/(disparosBlancosArriesgados + disparosBlancosSeguros)) + Number.EPSILON) * 1000) / 1000,
        "EstrategiaRatioSeguridad" : Math.round(((disparosBlancosSeguros/(disparosBlancosArriesgados+disparosBlancosSeguros)) + Number.EPSILON) * 1000) /1000,
        "RatioEndeudamiento" : (group == 1 || group == 2) ? 0 : Number.isNaN(Math.round(((prestamosSolicitados / prestamosMaximos) + Number.EPSILON) * 1000) /1000) ? 0 : Math.round(((prestamosSolicitados / prestamosMaximos) + Number.EPSILON) * 1000) /1000
    };
    dataToSend = experimentCode + "," + data.Grupo + "," + data.Escasez + "," + data.Prestamos + "," + data.NumDisparosDisponible + "," + data.Fecha + "," + data.HoraInicio + "," + data.HoraFin + "," + data.Genero + "," + data.Edad +
                "," + data.IdParticipante + "," + data.NumTotalPuntos + "," + data.NumTotalDisparosBlancosSeguros + "," + data.NumTotalDisparosBlancosArriesgados + "," + data.NumTotalPrestamosSolicitados +
                "," + data.EstrategiaAhorro + "," + data.ValoracionRecurso + "," + data.NumTotalDisparosRealizados + "," + data.RatioPuntuación + "," + data.RatioAcierto + "," + data.EstrategiaRatioSeguridad +
                "," + data.RatioEndeudamiento;
    //alert(JSON.stringify(data)); // Comentar la siguiente línea, ahora es para mostrar los datos de las pruebas.
    //alert(dataToSend);
    sendFirebase(dataToSend);
}

/*Guardar en Firebase*/
function sendFirebase(data) {
    // Initialize Firebase, 
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDCb4NJ_FMkmCe_xtLj7X5r8YzZgmT58FE",
        authDomain: "radiant-inferno-4675.firebaseapp.com",
        databaseURL: "https://radiant-inferno-4675.firebaseio.com",
        projectId: "radiant-inferno-4675",
        storageBucket: "radiant-inferno-4675.appspot.com",
        messagingSenderId: "1043729749642"
    };
    firebase.initializeApp(config);
  
    // Get a reference to the database service
    var database = firebase.database();
    var referencia=database.ref(experimentCode);
  
    referencia.push(
    {
       data: data
    });
  }

function roundWithoutShots() {
    var roundWithoutShots = 0;
    var shots;
    for(var i=0;i<roundTrialsData.length;i++){
        shots = 0;
        for(var j=0;j<roundTrialsData[i].length && shots === 0;j++){
            if(roundTrialsData[i][j].responses === 1)
                shots++;
        }
        if(shots === 0) roundWithoutShots++;
    }
    return roundWithoutShots;
}

// Función que redondea a la baja el 0.5.
function roundDown(value) {
    return (value / 2) % 1 === 0.5 ? value / 2 - 0.5 : Math.round(value / 2);
}
