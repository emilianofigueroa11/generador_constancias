const { jsPDF } = window.jspdf;


// ============================================
// FUNCIÓN PARA CARGAR FIRMA
// ============================================

function cargarFirma(event) {

    const input = event.target;

    if (input.files && input.files[0]) {

        const reader = new FileReader();

        reader.onload = function (e) {

            document.getElementById('displayImgFirma').src = e.target.result;

        };

        reader.readAsDataURL(input.files[0]);
    }
}


// ============================================
// ACTUALIZAR CONSTANCIA
// ============================================

function actualizarConstancia() {

    // ========================================
    // INPUTS
    // ========================================

    const nombre = document.getElementById('inputNombre').value;
    const rol = document.getElementById('inputRol').value;
    const evento = document.getElementById('inputEvento').value;
    const detalles = document.getElementById('inputDetalles').value;
    const fNombre = document.getElementById('inputFirmaNombre').value;
    const fCargo = document.getElementById('inputFirmaCargo').value;


    // ========================================
    // ELEMENTOS DE LA CONSTANCIA
    // ========================================

    const displayNombre = document.getElementById('displayNombre');


    // ========================================
    // ACTUALIZAR TEXTOS
    // ========================================

    displayNombre.textContent =
        nombre || "Nombre del Participante";

    document.getElementById('displayRol').textContent = rol;

    document.getElementById('displayEvento').textContent = evento;

    document.getElementById('displayDetalles').textContent = detalles;

    document.getElementById('displayFirmaNombre').textContent = fNombre;

    document.getElementById('displayFirmaCargo').textContent = fCargo;


    // ========================================
    // AJUSTE DEL NOMBRE
    // ========================================

    /*
       Primero eliminamos cualquier clase
       anterior.
    */

    displayNombre.classList.remove(
        'nombre-largo',
        'nombre-muy-largo',
        'nombre-extremo'
    );


    /*
       Ahora hacemos ajustes graduales.

       Ya no tenemos el salto brusco:

       35 caracteres
       4xl -> 2xl

       Ahora existen varios niveles.
    */

    if (nombre.length > 50) {

        displayNombre.classList.add('nombre-extremo');

    }

    else if (nombre.length > 40) {

        displayNombre.classList.add('nombre-muy-largo');

    }

    else if (nombre.length > 30) {

        displayNombre.classList.add('nombre-largo');

    }

}


// ============================================
// ESPERAR A QUE EL NAVEGADOR TERMINE DE
// RENDERIZAR
// ============================================

function esperarRenderizado() {

    return new Promise(resolve => {

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                resolve();

            });

        });

    });

}


// ============================================
// DESCARGAR PDF
// ============================================

async function descargarPDF() {

    const btn = document.getElementById('btnDownload');

    const originalText = btn.innerHTML;


    // ========================================
    // DESACTIVAR BOTÓN
    // ========================================

    btn.disabled = true;

    btn.innerHTML = `Generando...`;

    btn.classList.add(
        'opacity-75',
        'cursor-not-allowed'
    );


    try {

        const elemento =
            document.getElementById('constancia-container');


        // ====================================
        // ESPERAR A QUE LAS FUENTES TERMINEN
        // ====================================

        if (document.fonts && document.fonts.ready) {

            await document.fonts.ready;

        }


        // ====================================
        // ESPERAR RENDERIZADO
        // ====================================

        await esperarRenderizado();


        // ====================================
        // GENERAR CANVAS
        // ====================================

        const canvas = await html2canvas(elemento, {

            scale: 2,

            useCORS: true,

            allowTaint: true,

            backgroundColor: '#ffffff',

            logging: false,

            /*
               Mantener exactamente las dimensiones
               de la constancia.
            */

            width: 1123,

            height: 794,

            windowWidth: 1123,

            windowHeight: 794

        });


        // ====================================
        // CONVERTIR A IMAGEN
        // ====================================

        const imgData =
            canvas.toDataURL('image/png');


        // ====================================
        // CREAR PDF A4 HORIZONTAL
        // ====================================

        const pdf = new jsPDF({

            orientation: 'landscape',

            unit: 'mm',

            format: 'a4'

        });


        const pdfWidth =
            pdf.internal.pageSize.getWidth();

        const pdfHeight =
            pdf.internal.pageSize.getHeight();


        // ====================================
        // INSERTAR IMAGEN
        // ====================================

        pdf.addImage(

            imgData,

            'PNG',

            0,

            0,

            pdfWidth,

            pdfHeight

        );


        // ====================================
        // NOMBRE DEL ARCHIVO
        // ====================================

        let nombreArchivo =
            document.getElementById('inputNombre').value ||
            "participante";


        nombreArchivo = nombreArchivo

            .normalize("NFD")

            .replace(/[\u0300-\u036f]/g, "")

            .replace(/[^a-z0-9]/gi, '_')

            .replace(/_+/g, '_')

            .toLowerCase();


        // ====================================
        // GUARDAR PDF
        // ====================================

        pdf.save(
            `Constancia_GCTC_${nombreArchivo}.pdf`
        );


    }

    catch (err) {

        console.error("Error:", err);

        alert(
            "Hubo un error al generar el PDF. Verifica tu conexión a internet para cargar los logos."
        );

    }


    // ========================================
    // RESTAURAR BOTÓN
    // ========================================

    restaurarBoton(
        btn,
        originalText
    );

}


// ============================================
// RESTAURAR BOTÓN
// ============================================

function restaurarBoton(btn, textoOriginal) {

    btn.disabled = false;

    btn.innerHTML = textoOriginal;

    btn.classList.remove(
        'opacity-75',
        'cursor-not-allowed'
    );

}


// ============================================
// AL CARGAR LA PÁGINA
// ============================================

window.onload = function () {

    actualizarConstancia();

};