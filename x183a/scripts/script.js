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
    return (String(fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + "/" + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds()));
}






//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++
//
//      VARIABLES GLOBALES
//
//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++



var Fecha = stringDate();         //fecha y hora...
var personId = Math.floor((Math.random() * 1000000) + 1); //ID aleatorio
var data = "";                //aquí guardaremos los datos
var experimentCode = "x183a";
var Gender = "";
var Age = "";
var Group = 99;
var GroupName = "";         //guarda el nombre del grupo (más cómodo)

var state = 99;               //contador ensayo
var disparosLeft = 99;        //contador de disparos disponibles
var PrecioDisparo = 1;      //por defecto, cada disparo vale un disparo. (puede aumentar si pides un crédito)
var ronda = 0;              //contador de ronda
var PuntosRonda = 0;
var PuntosTotal = 0;

var DisparosRico = 15;      //número de disparos de cada grupo
var DisparosPobre = 3;

var button1 = document.getElementById("botonDispara");
var button2 = document.getElementById("botonOmitir");

var allowCredit = 0;        //Permite el endeudamiento? (Depende del grupo)

var arrayTrials = [];   //array con los ensayos de CADA ronda
var numFijos = 7;       //número de objetivos fijos por ronda
var numMoviles = 14;    //número de objetivos móviles por ronda

var seqTrials = [];
var seqResps = [];
var seqExplos = [];

var imagenFijo = "";
var imagenMovil = "";

// variables para la valoración.
var slider;
var sliderValue = 0;


//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++
//
//      INSTRUCCIONES
//
//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++


var Instrucciones = {
    Compatibilidad: "<h2><p align=\"center\">ATTENTION</h2><p><p align=\"center\">This experiment is designed to function on a <b>personal computer</b>, not on a mobile device (tablet, smartphone), and it is <b>only compatible with an updated version of Google Chrome or Mozilla Firefox browsers</b>. If you have tried to access with another browser, please try again using Google Chrome or Mozilla Firefox.<p align=\"center\"><img src=\"img/Chrome.png\" style=\"padding:3%\"width=\"93\"><img src=\"img/Firefox.png\" width=\"100\" style=\"padding:3%\"><p align=\"center\"> When you are ready, click on the arrow to begin the experiment",

    Incompatible: "<p align=\"center\">Sorry but this study is designed to run on a desktop computer, not on a mobile device (tablet, smartphone), and it is only compatible with an updated version of Google Chrome or Mozilla Firefox.<p align=\"center\"> <b> Please, try again using an updated version of Google Chrome or Mozilla Firefox on a desktop computer.",

    Notas: "<h2>Instructions</h2>Remember that in this study you are not allowed to jot down notes: rather, you should rely on your memory and intuition abilities to find out whether the treatment works. <p><br><p align=\"center\"><img src=\"img/Notes.png\" width=\"180\"><br><br><p><p align=\"center\"><b>Good luck!",

    PantallaInicial: '<h2>AngryBlueBerries</h2><p align="center">(Software para psicologia Experimental)<br> Versión 1.0, Español, 2020 <br> <a href="#">http://www.labpsico.com</a><br><span title="&copy; Helena Matute, Arantza Aranzazu y Tomás de la Vega 2020 . Estás autorizado a utilizar este programa con fines de investigación o docencia, con o sin modificaciones, con la única condición de que cites a los autores, el nombre del programa y la página web donde puede descargarse. Se prohibe expresamente la publicación de este programa en otros sitios o medios, así como cualquier utilización comercial del mismo sin el permiso explícito de los autores.">Créditos, Copyright y Artículos en los que se describe este programa</span></p>',

    Consentimiento: "<h2>Tu participación es voluntaria y anónima</h2><p>Antes de nada queremos agradecer tu participación en este experimento, ya que sin la colaboración de personas como tú no sería posible esta investigación.<br>Debes saber que en esta tarea no hay respuestas buenas ni malas. Lo que queremos estudiar son los mecanismos psicológicos básicos que se dan en todas las personas. Para ello, necesitamos que, si deseas participar, lo hagas con el mayor interés. No tienes que identificarte, y los datos que nos aportes se unirán a los del total del grupo y serán analizados estadísticamente. Tu participación es voluntaria y anónima.<br>Si tras haber leído el mensaje deseas continuar, por favor pulsa en el botón Continuar.</p>",

    SociodemografProlific:"<h2>Datos demográficos</h2><form name='input'><strong>SEXO</strong>:<select name='sexo'><option value='masculino'>Hombre</option><option value='femenino'>Mujer</option><option value='otro'>Otro</option></select><br><strong>EDAD</strong>: <input type='text' name='edad' maxlength='2'>",

    Pantalla1: "<h2>¿Qué es “Tiro al blanco”?</h2><p> Tiro al blanco es un sencillo  juego de estrategia en el que la suerte también cuenta.</p> <p>El objetivo es conseguir el mayor número posible de puntos: Cada blanco alcanzado proporciona un punto.</p>",

    Pantalla2: "<h2>¿Cómo se juega?</h2><p> A lo largo de 10 rondas irán apareciendo de uno en uno, dos tipos de blancos distintos: Blancos fijos y blancos móviles. </p> <p>Deberás decidir si disparas o si no disparas. Además, mientras tu prepuesto de disparos no se haya terminado, podrás disparar a un mismo blanco cuantas veces quieras. Ten en cuenta que los blancos fijos son mucho más fáciles de acertar que los blancos móviles.</p><p>Si en una ronda consigues alcanzar 7 blancos, automáticamente se te sumarán 3 puntos adicionales y finalizarás esa ronda con la puntuación máxima: 10 puntos.<br><br>A veces es posible pedir prestados disparos de rondas posteriores: Solo podrás pedir préstamos una vez has agotado tu presupuesto: En ese momento, se activará la función “Pedir préstamos” y tú decidirás si continúas jugando o si pasas a la siguiente ronda. Ten en cuenta que por cada disparo pedido en préstamo, se te descontarán 2 disparos de tu presupuesto total.<br><br><strong>Tu presupuesto es de " + disparosLeft + " disparos por ronda.</strong><br><br>Recuerda que tu objetivo es conseguir el mayor número posible de puntos.<br>Para ello, en primer lugar deberás consultar si en tu caso se ha autorizado o se ha denegado la capacidad de solicitar préstamos y a partir de ese momento podrás empezar a jugar.<br>¡Prueba tu suerte y mide tus habilidades!</p>",

    PantallaCredito: "",    //se asigna más tarde en la función asignaGroup

    Final: "", //se asigna más tarde

    PantallaValoracion: "<h2>Valoración</h2><p>¿En qué medida de 0 a 100 consideras que haber tenido más disparos disponibles te habría ayudado a obtener una mayor puntuación?.<br>0: No me habría ayudado nada.<br>50: Me habría ayudado algo.<br>100: Me habría ayudado muchísimo.<br><br><div class='slidecontainer'><input type='range' min='0' max='100' value='0' class='slider' id='myRange'><p>Valor: <span id='value'></span></p></div></p>",

    PantallaEnviarDatos: "<h2>Enviar datos</h2><p>A continuación podrás enviar los resultados para que se incluyan en nuestro estudio, los datos que nos aportes se unirán a los del grupo y serán analizados estadísticamente. Para hacerlo haz click en el botón \"Enviar\". Si por alguna razón no deseas enviarnóslos haz click en el botón \"Cancelar\".</p>",

    PantallaFinal: "<h2>Explicación</h2><p>Antes de nada queremos darte las gracias por tu colaboración en este experimento. Nuestra labor de investigación sería imposible si no fuera por la participación voluntaria de personas como tú que deciden dedicarnos parte de su tiempo. Suponemos que ahora que has terminado el experimento te gustaria recibir una explicación sobre lo que tratabamos de estudiar.<br>Nuestra intención es estudiar cómo afecta la escasez en la toma de decisiones de las personas y cuáles pueden ser sus consecuencias. Queríamos comprobar si el hecho de tener más o menos presupuesto disponible influye sobre las decisiones de endeudamiento y de ahorro; sobre la estrategia de juego, sobre los resultados obtenidos y sobre la valoración de los recursos.<br>Muchas gracias por tu participación.<br>Para saber más...<br>Si quieres saber más acerca de la Psicología de la Escasez te recomendamos que leas: Mullainathan, S. y Shafir, E. (2016). Escasez: ¿Por qué tener muy poco significa tanto?.México D.F.: Fondo de Cultura Económica.</p>"
};

//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++
//
//      INICIO:
//
//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++




function arranca() {

    TimeInicioTarea = Date.now();

    preloadIMG();

    Group = Math.floor((Math.random() * 4) + 1);    //Elige grupo al azar: de 1 a 4.
    asignaGroup();                                  //hace los cambios según el grupo.
    asignaEstimulo();               //siempre hay que asignar estímulo antes de generar los ensayos!

    //antes de cambiaRonda(), hay que mostrar instrucciones:
    showInstruc();
    //cambiaRonda();
}

function asignaGroup() {
    switch (Group) {
        case 1: //RICO-Sin deudas
            disparosLeft = DisparosRico;
            allowCredit = 0;
            GroupName = "Rico-SinDeuda";
            break;
        case 2: //POBRE-Sin deudas
            disparosLeft = DisparosPobre;
            allowCredit = 0;
            GroupName = "Pobre-SinDeuda";
            break;
        case 3: //RICO-Con deudas
            disparosLeft = DisparosRico;
            allowCredit = 1;
            GroupName = "Rico-Deuda";
            break;
        case 4: //POBRE-Con deudas
            disparosLeft = DisparosPobre;
            allowCredit = 1;
            GroupName = "Pobre-Deuda";
    }

    if (allowCredit == 1) {
        Instrucciones.PantallaCredito = "¡¡Has tenido suerte!! El banco sí te permite endeudarte. Podrás pedir préstamos mientras juegas. Aunque termines tu presupuesto de disparos, podrás seguir jugando.";
    }
    else {
        Instrucciones.PantallaCredito = "¡¡Qué pena!! El banco no te permite endeudarte. No podrás pedir préstamos mientras juegas. Cuando termines tu presupuesto de disparos, se terminará también la ronda.";
    }


}

//asigna las imágenes a los estímulos aleatoriamente:
function asignaEstimulo() {
    var estimulos = ["candy01.png", "candy02.png"]; //< -- si queremos que sean el mismo estímulo para todos los ensayos, modificarlo aquí!

    estimulos = shuffle(estimulos);

    trialFijo.imagen = "<img src=\"img/" + estimulos[0] + "\" width=\"400px\" class= \"fijo_idle\">";
    trialMovil.imagen = "<img src=\"img/" + estimulos[1] + "\" width=\"400px\" class= \"movil_idle\">";
}


function CheckBrowser() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        ocultar(Next);
        htmlContenido = Instrucciones.Incompatible;
        pintarHTML("divTextos", htmlContenido);
        mostrar(divTextos);
    }
    else if (navigator.userAgent.indexOf('Chrome') !== -1 || navigator.userAgent.indexOf('Firefox') !== -1) {
        InicioExperimento();
    }
    else {
        ocultar(Next);
        htmlContenido = Instrucciones.Incompatible;
        pintarHTML("divTextos", htmlContenido);
        mostrar(divTextos);
    }
}
/**
 * 
 * @param {Edad seleccionada en el formulario.} age 
 */
function checkForm(age) {
    if(age === null || age === "")
        alert("Introduzca la edad por favor.");
    else if(age < 18 )
        alert("Debe tener al menos 18 años para participar en el experimento.")
    else {
        Age = age;
        pantalla1();
    }
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

function showInstruc() {
    ocultar(divContenidoJuego);
    pantallaInicial();
}

function closeWindow() {
    if(confirm("Close Window?")) {
        close();
    }
}

function pantallaInicial() {
    pintarHTML("divTextos", Instrucciones.PantallaInicial);
    pintarHTML("divBoton","<button class='btnScreens' onclick='consentimiento()'>Siguiente</button>");
    mostrar(divTextos);
}

function consentimiento() {
    pintarHTML("divTextos", Instrucciones.Consentimiento);
    pintarHTML("divBoton", "<button class='btnScreens' onclick='closeWindow();return false;'>Salir</button><button class='btnScreens' onclick='sociodemografProlific()'>Siguiente</button>");
    mostrar(divTextos);
}

function sociodemografProlific() {
    pintarHTML("divTextos", Instrucciones.SociodemografProlific);
    pintarHTML("divBoton","<button class='btnScreens' onclick='checkForm(document.forms[\"input\"][\"edad\"].value);'>Siguiente</button>")
    mostrar(divTextos);
}

function pantalla1() {
    ocultar(divTextos);
    pintarHTML("divTextos", Instrucciones.Pantalla1);
    pintarHTML("divBoton", "<button class='btnScreens' onclick='sociodemografProlific();'>Atras</button><button class='btnScreens' onclick='pantalla2();'>Siguiente</button>");
    mostrar(divTextos);
}

function pantalla2() {
    ocultar(divTextos);
    pintarHTML("divTextos", Instrucciones.Pantalla2);
    pintarHTML("divBoton", "<button class='btnScreens' onclick='pantalla1();'>Atras</button><button class='btnScreens' onclick='pantallaCredito();'>Siguiente</button>");
    mostrar(divTextos);
}

function pantallaCredito() {
    ocultar(divTextos);
    pintarHTML("divTextos", Instrucciones.PantallaCredito);
    //pintarHTML("divBoton", "<button class='btnScreens' onclick='cambiaRonda()'>Empezar</button>");
    pintarHTML("divBoton", "<button class='btnScreens' onclick='pantallaValoracion();'>Empezar</button>");
    mostrar(divTextos);
}

function pantallaValoracion() {
    ocultar(divTextos);
    pintarHTML("divTextos", Instrucciones.PantallaValoracion);
    pintarHTML("divBoton", "<button class='btnScreens' onclick='checkSliderValue(output.innerHTML);'>Continuar</button>");
    mostrar(divTextos);
    initSlider();
}

function pantallaEnviarDatos() {
    ocultar(divTextos);
    pintarHTML("divTextos", Instrucciones.PantallaEnviarDatos);
    pintarHTML("divBoton","<button class='btnScreens' onclick='pantallaFinal(0)'>Cancelar</button><button class='btnScreens' onclick='pantallaFinal(1);'>Enviar</button>");
    mostrar(divTextos);
}

function pantallaFinal(save) {
    if(save === 1)
        saveData();
    ocultar(divTextos);
    pintarHTML("divTextos", Instrucciones.PantallaFinal);
    pintarHTML("divBoton","<button class='btnScreens' onclick='closeWindow();'>Salir</button>");
    mostrar(divTextos);
}

/**
 * Función que inicializa la slider
 */
function initSlider() {
    slider = document.getElementById("myRange");
    output = document.getElementById("value");
    //output.innerHTML = slider.value;
    
    slider.oninput = function() {
      output.innerHTML = this.value;
    }
}

//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++
//
//      TAREA DE DISPAROS
//
//++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++



//====================================
//VARIABLES PARA LA RECOGIDA DE DATOS
//====================================




//=========================================
//        Preparo info del entrenamiento
//=========================================

//PENSAR OTRA OPCIÓN: EN VEZ DEL ARRAY DE JSONS, TENER ARRAYS SEPARADOS PARA CADA PROPIEDAD, LUEGO GENERAR EL JSON EN CADA ENSAYO

//esta declaración solo inicializa el objeto ensayo. Hay que indicarle los valores al arrancar el programa!

var trialFijo = {
    name: "Fijo",   //tipo de ensayo, fijo o móvil
    imagen: "",     //a rellenar en la función asignaEstimulo()
    chancesHit: 10, //probabilidad de acierto (sobre 10)
    responses: 0, //número de respuestas (funciona como un contador). Si fue omitido, queda a 0.
    exploded: 0 //(cambia a 1 si explotó)
};

var trialMovil = {
    name: "Movil",   //tipo de ensayo, fijo o móvil
    imagen: "",     //a rellenar en la función asignaEstimulo()
    chancesHit: 1, //probabilidad de acierto (sobre 10)
    responses: 0, //número de respuestas (funciona como un contador). Si fue omitido, queda a 0.
    exploded: 0 //(cambia a 1 si explotó)
};






//=========================================
//     mecánica del juego
//=========================================

//función para inciar una ronda:
function cambiaRonda() {
    ocultar(divTextos);
    ocultar(divBoton);
    ocultar(divContenidoJuego);

    if (ronda == 3) {
        finJuego();
    }

    else {
        //genera los ensayos:
        arrayTrials = Array(numFijos).fill(trialFijo);
        arrayTrials = arrayTrials.concat(Array(numMoviles).fill(trialMovil));
        arrayTrials = shuffle(arrayTrials);

        state = 0; //resetea el contador de ensayos
        PrecioDisparo = 1; //al iniciar la ronda, el precio es el normal.
        ronda++; //suma una ronda: si es la primera, pasa de 0 a 1.
        switch (Group) {
            case 1: //RICO-Sin deudas
                disparosLeft = DisparosRico;
                break;
            case 2: //POBRE-Sin deudas
                disparosLeft = DisparosPobre;
                break;
            case 3: //RICO-Con deudas
                disparosLeft = DisparosRico;
                break;
            case 4: //POBRE-Con deudas
                disparosLeft = DisparosPobre;
        }

        pintarHTML("divDisparos", disparosLeft + "x <img src=\"img/Disparo.png\" width=\"30px\">");

        pintarHTML("divRondaScreen", "RONDA " + ronda);
        mostrar(divRondaScreen);

        setTimeout("ocultar(divRondaScreen)", 3000);
        setTimeout("startTrial()", 3100);
    }
}

//Esta función me devuelve la lista de tipos de ensayo, los números de respuesta de cada ensayo... para guardarlos

function contarTrials() {

    for (var i = 0; i < arrayTrials.length; i++) {
        seqTrials.push(arrayTrials[i].name);
        seqExplos.push(arrayTrials[i].exploded);
        seqResps.push(arrayTrials[i].responses);

        //seqTrials=seqTrials.concat(arrayTrials[[i]].name);    
        //seqExplos=seqExplos.concat(arrayTrials[[i]].exploded);
        //seqResps=seqResps.concat(arrayTrials[[i]].responses);
    }


    //ME HACE FALTA ACTUALIZARLA Y QUE HAGA TODO LO QUE NECESITO
    //Y luego llamrla al final de cada ronda!
    //return seqTipos;


    //POR ALGUN MOTIVO, LA SEQRESPS SOLO CONTIENE CEROS!!!!
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

//comienza los ensayos:
function startTrial() {
    ocultar(targetCandy);
    ocultar(explosionHit);
    ocultar(pointsHit);
    ocultar(textoFallo);
    mostrar(divContenidoJuego);


    pintarHTML("divRonda", "RONDA: " + ronda);
    pintarHTML("divPuntos", "Puntos total: " + PuntosRonda);
    pintarHTML("divDisparos", disparosLeft + "x <img src=\"img/Disparo.png\" width=\"30px\">");

    button1 = document.getElementById("botonDispara");
    button2 = document.getElementById("botonOmitir");


    var htmlcode = arrayTrials[state].imagen;
    pintarHTML("targetCandy", htmlcode);
    var target = document.getElementById("targetCandy");
    if (arrayTrials[state].name == "Fijo") {
        target.classList.add("fijo_idle");
    }
    else if (arrayTrials[state].name == "Movil") {
        target.classList.add("movil_idle");
    }


    button1.disabled = false;
    button2.disabled = false;

    mostrar(targetCandy);

    arrayTrials[state].responses = 0;
    responses = 0;
}


var responses = 0; //nº de resps en cada ensayo
var seqResps2 = []; //vector con nº d eesp en cada ensayo

//función que describe qué pasa cuando disparas. 
function shotTrial() {

    //Guardo la respuesta:
    responses++;

    //arrayTrials[state]= {responses : responses}; 

    arrayTrials[state] = {
        name: arrayTrials[state].name,   //tipo de ensayo, fijo o móvil
        imagen: arrayTrials[state].imagen,     //a rellenar en la función asignaEstimulo()
        chancesHit: arrayTrials[state].chancesHit, //probabilidad de acierto (sobre 10)
        responses: arrayTrials[state].responses++, //número de respuestas (funciona como un contador). Si fue omitido, queda a 0.
        exploded: 0 //(cambia a 1 si explotó)
    }

    //POR HACER: RESULTA QUE NO ME ESTÁ GUARDANDO NI LAS RESPUESTAS NI LAS EXPLOSIONES... PORQUE CUANDO MODIFICA UNA INSTANCIA DEL ARRAY DE JSON, MODIFICA TODOS!!!!!



    //decide si explota o no: el primer elemento de este array (1 o 0) 
    var arrayChances = Array(arrayTrials[state].chancesHit).fill(1); //pone un uno por cada prob de acierto.
    arrayChances = arrayChances.concat(Array(10 - arrayTrials[state].chancesHit).fill(0));//(y el resto de elementos son ceros)
    arrayChances = shuffle(arrayChances); //lo desordena...

    disparosLeft = disparosLeft - PrecioDisparo; //te descuento un disparo.

    var target = document.getElementById("targetCandy");

    //tengo que programarlo para que no les deje pulsar el botón mientras. De momento, anulo el botón mientras explota o no...
    button1.disabled = true;
    button2.disabled = true;

    if (arrayChances[0] == 1) {               //si le has acertado...
        target.classList.add("hit");        //animaciones y señales extra en la explosion...
        mostrar(explosionHit);
        mostrar(pointsHit);

        arrayTrials[state].exploded++; //guarda que en este ensayo ha habido explosion.

        PuntosRonda++;          //sumamos los puntos y avanzamos el ensayo
        PuntosTotal++;
        state++;
        seqResps2.push(responses);

        var puntos = document.getElementById("divPuntos");
        puntos.classList.add("UpdateStats");
        //setTimeout("puntos.classList.add('UpdateStats')", 500);

        pintarHTML("divRonda", "RONDA: " + ronda);
        pintarHTML("divPuntos", "Puntos total: " + PuntosRonda);
        pintarHTML("divDisparos", disparosLeft + "x <img src=\"img/Disparo.png\" width=\"30px\">");



        setTimeout('CheckParams()', 2000);
    }
    else if (arrayChances[0] == 0) {         //si le has fallado...
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

    pintarHTML("divRonda", "RONDA: " + ronda);
    pintarHTML("divPuntos", "Puntos total: " + PuntosRonda);
    pintarHTML("divDisparos", disparosLeft + "x <img src=\"img/Disparo.png\" width=\"30px\">");


    state++;
    seqResps2.push(responses);

    setTimeout('CheckParams()', 1000);

}


function CheckParams() {

    //actualizamos marcadores:

    var puntos = document.getElementById("divPuntos");
    puntos.classList.remove('UpdateStats');
    //    pintarHTML("divRonda", "RONDA: "+ronda);
    //    pintarHTML("divPuntos", "Puntos total: "+PuntosRonda);
    //    pintarHTML("divDisparos", disparosLeft+"x <img src=\"img/Disparo.png\" width=\"30px\">");

    //reinicia el caramelo... (le quita las clases de hit y de ITI...)
    var target = document.getElementById("targetCandy");
    target.classList.remove("hit");
    target.classList.remove("classITI");
    //target.classList.remove(".fijo_idle");
    //target.classList.remove(".movil_idle");

    //reinicia botones...
    button1.disabled = false;
    button2.disabled = false;



    if (state == arrayTrials.length) {  //si se acaban los ensayos...
        //manda a la funcion de cambiar ronda: primero va a comprobar en qué ronda estamos, y luego la actualiza en consecuencia

        contarTrials();
        cambiaRonda();
    }

    else { //si aun quedan ensayos...
        if (disparosLeft <= 0) {               //si no te quedan más disparos...
            //saca la pantalla de endeudamiento.

            if (PrecioDisparo == 2) //si estamos endeudados:
            {
                contarTrials();
                cambiaRonda();
            }
            else decideTexto();

            // esto está MAL: DEBERÍA COMPROBAR SI ESTAMOS ENDEUSADOS. SI YA ESTÁBAMOS ENDEUDADOS, AL ACABARSE LOS DISPAROS SE ACABA LA RONDA!



        }
        else { startTrial(); }
    }




}


function finJuego() {
    ocultar(divContenidoJuego);
    Instrucciones.Final = "<h2>Puntuaciones finales</h2><p>Enhorabuena, tu puntuación final es de " + PuntosTotal + " puntos.</p><p>Para enviar los datos, haz clic en Enviar, bla bla bla...</p>";
    var htmlcontenido = "<button class = 'column2' onclick='saveData()'>Enviar datos</button><button class = 'column2' onclick='pantallaFinal()'>Cancelar</button>";

    pintarHTML("divTextos", Instrucciones.Final);

    mostrar(divTextos);
    mostrar(divBoton);

}



function decideTexto() {
    if (allowCredit == 0) //si son los grupos sin deuda:
    {
        var htmltexto = "<h2>ATENCIÓN</h2><p>No te quedan más disparos.</p><img src=\"img/noShotsLeft.png\" width=\"120px\"><p>Tu puntuación en esta ronda es de: <b>" + PuntosRonda + "</b> puntos.</p><p>Tu puntuación total es de: <b>" + PuntosTotal + "</b> puntos.</p> <button id=\"botonSiguienteRonda\" class=\"buttonDeudas\" onclick=\"siguienteRonda()\"  disabled=\"false\">Continuar</button>";

        pintarHTML("divNoDisparos", htmltexto);
        document.getElementById("botonSiguienteRonda").disabled = false;


    }
    else { //en los grupos Con posibilidad de deuda:
        var htmltexto = "<h2>ATENCIÓN</h2><p>No te quedan más disparos.</p><img src=\"img/noShotsLeft.png\" width=\"120px\"><p>Tu puntuación en esta ronda es de: <b>" + PuntosRonda + "</b> puntos.</p><p>Tu puntuación total es de: <b>" + PuntosTotal + "</b> puntos.</p> <p>Tienes la posibilidad de <b>pedir un crédito</b> para seguir jugando esta ronda. Si pides el crédito, tendrás más posibilidades de disparar, pero cada disparo que hagas te descontará dos balas.</p><div class = \"column2\"><button id=\"botonEndeudarse\" class=\"buttonDeudas\" onclick=\"deuda()\"  disabled=false>Endeudarme</button></div><div class = \"column2\"><button id=\"botonSiguienteRonda\" class=\"buttonDeudas\" onclick=\"siguienteRonda()\"  disabled=false>No endeudarme</button></div>";

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

    PrecioDisparo = 2;

    htmlContenido = "<h2>CRÉDITO ADJUDICADO</h2><p>A partir de este momento, cada disparo te cuesta DOS unidades de munición.</p><img src=\"img/deudaPrecio.png\" height=\"120px\"> <p>Puedes continuar la ronda.</p><button id=\"botonContinua\" class=\"buttonDeudas\" onclick=\'sigueRonda()'>Continuar</button>";

    setTimeout("pintarHTML('divNoDisparos', '')", 500);
    setTimeout("pintarHTML('divNoDisparos', htmlContenido)", 1000);

}


function sigueRonda() {

    ocultar(divNoDisparos);


    startTrial();

}

function siguienteRonda() {
    ocultar(divNoDisparos);
    cambiaRonda();

}

//====================================
//          FINAL DEL ESTUDIO
//====================================


function saveData() {

    data =
        experimentCode + "," +
        personId + "," +
        Fecha + "," +
        Age + "," +
        Gender + "," +
        GroupName + ",";
}