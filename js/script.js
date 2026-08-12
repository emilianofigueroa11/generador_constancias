const { jsPDF } = window.jspdf;


// ============================================
// FUNCIÓN PARA CARGAR FIRMA
// ============================================

function cargarFirma(event) {

    const input = event.target;

    if (input.files && input.files[0]) {

        const reader = new FileReader();

        reader.onload = function(e) {

            document.getElementById('displayImgFirma').src = e.target.result;

        }

        reader.readAsDataURL(input.files[0]);

    }

}


// ============================================
// ACTUALIZAR CONSTANCIA
// ============================================

function actualizarConstancia() {

    // Inputs
    const nombre = document.getElementById('inputNombre').value;
    const rol = document.getElementById('inputRol').value;
    const evento = document.getElementById('inputEvento').value;
    const detalles = document.getElementById('inputDetalles').value;
    const fNombre = document.getElementById('inputFirmaNombre').value;
    const fCargo = document.getElementById('inputFirmaCargo').value;


    // Displays
    const displayNombre = document.getElementById('displayNombre');


    // Actualizar textos
    displayNombre.textContent = nombre || "Nombre del Participante";

    document.getElementById('displayRol').textContent = rol;

    document.getElementById('displayEvento').textContent = evento;

    document.getElementById('displayDetalles').textContent = detalles;

    document.getElementById('displayFirmaNombre').textContent = fNombre;

    document.getElementById('displayFirmaCargo').textContent = fCargo;


    // Ajustar tamaño de fuente dinámico
    if (nombre.length > 35) {

        displayNombre.classList.remove('text-4xl');

        displayNombre.classList.add('text-2xl');

    } else {

        displayNombre.classList.remove('text-2xl');

        displayNombre.classList.add('text-4xl');

    }

}


// ============================================
// DESCARGAR PDF
// ============================================

function descargarPDF() {

    const btn = document.getElementById('btnDownload');

    const originalText = btn.innerHTML;


    btn.disabled = true;

    btn.innerHTML = `Generando...`;

    btn.classList.add('opacity-75', 'cursor-not-allowed');


    const elemento = document.getElementById('constancia-container');


    html2canvas(elemento, {

        scale: 2,

        useCORS: true,

        allowTaint: true,

        backgroundColor: '#ffffff',

        logging: false

    })

    .then(canvas => {

        const imgData = canvas.toDataURL('image/png');


        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });


        const pdfWidth = pdf.internal.pageSize.getWidth();

        const pdfHeight = pdf.internal.pageSize.getHeight();


        pdf.addImage(
            imgData,
            'PNG',
            0,
            0,
            pdfWidth,
            pdfHeight
        );


        let nombreArchivo =
            document.getElementById('inputNombre').value ||
            "participante";


        nombreArchivo = nombreArchivo
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase();


        pdf.save(`Constancia_GCTC_${nombreArchivo}.pdf`);


        restaurarBoton(btn, originalText);

    })

    .catch(err => {

        console.error("Error:", err);

        alert(
            "Hubo un error al generar el PDF. Verifica tu conexión de internet para cargar los logos."
        );


        restaurarBoton(btn, originalText);

    });

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

window.onload = actualizarConstancia;