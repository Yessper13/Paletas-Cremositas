window.onload = function() {
    mostrarVentasGuardadas();
};

function mostrarVentasGuardadas() {
    let ventasGuardadas = JSON.parse(localStorage.getItem('ventasGuardadas')) || [];
    const ventasGuardadasDiv = document.getElementById('ventasGuardadas');

    if (ventasGuardadas.length === 0) {
        ventasGuardadasDiv.innerHTML = "<p>No hay ventas guardadas.</p>";
    } else {
        // Limpiar el contenido actual
        ventasGuardadasDiv.innerHTML = "";

        // Ordenar las ventas por fecha de forma descendente (más nuevas primero)
        ventasGuardadas.sort((a, b) => {
            let fechaA = new Date(a[0]?.fechaCompra || 0);
            let fechaB = new Date(b[0]?.fechaCompra || 0);
            return fechaB - fechaA;
        });

        ventasGuardadas.forEach((venta, index) => {
            let totalCompra = 0; // Variable para el total de la compra
            let fechaCompra = new Date(venta[0]?.fechaCompra || ""); // Tomar la fecha del primer producto
            let fechaHora;

            if (isNaN(fechaCompra.getTime())) {
                fechaHora = "Fecha no válida";
            } else {
                fechaHora = `${fechaCompra.toLocaleDateString()} ${fechaCompra.toLocaleTimeString()}`;
            }

            // Obtener el comprobante si está disponible
            const comprobanteUrl = venta[0]?.comprobanteUrl || null;

            let tablaHTML = ` 
                <div class="venta-seccion">
                    <button class="botonDespble" onclick="this.nextElementSibling.classList.toggle('verCompra')">Compra del ${fechaHora}</button>
                    <div class="hidden">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha y Hora</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            // Aquí puedes agregar más detalles de la venta si tienes otros productos.
            // Ejemplo:
            let producto = {
                nombre: "Producto de prueba",
                cantidad: 1,
                precio: 100.0
            };
            
            let totalProducto = producto.cantidad * producto.precio;
            totalCompra += totalProducto; // Sumar al total de la compra

            tablaHTML += `
                <tr>
                    <td>${fechaHora}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>$${totalProducto.toFixed(2)}</td>
                </tr>
            `;

            // Footer con el total y el ícono para ver el comprobante
            tablaHTML += `
                <tr>
                    <td colspan="3"></td>
                    <td style="text-align: right;"><strong>Total de la compra:</strong></td>
                    <td><strong>$${totalCompra.toFixed(2)}</strong></td>
                </tr>
                <tr>
                    <td colspan="5" style="text-align: left;">
                        ${comprobanteUrl ? `<a href="${comprobanteUrl}" target="_blank" class="ver-comprobante">
                            <img src="/Cremositos/imagen/iconos/pago1.ico" alt="Ver comprobante" style="width: 20px; vertical-align: middle;" />
                            Ver comprobante
                        </a>` : "<span style='color: gray;'>Comprobante no disponible</span>"}
                    </td>
                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <br>
            `;

            ventasGuardadasDiv.innerHTML += tablaHTML;
        });
    }
}

function generarPDF() {
    const ventasGuardadasDiv = document.getElementById('ventasGuardadas');

    if (ventasGuardadasDiv.children.length > 0) {
        const primeraVenta = JSON.parse(localStorage.getItem('ventasGuardadas'))[0];
        let fechaCompra = new Date(primeraVenta[0]?.fechaCompra || ""); // Tomar la fecha del primer producto

        let nombreArchivo = "ventas_" + fechaCompra.toLocaleDateString('es-CO').replace(/\//g, '-');

        const opt = {
            margin:       1,
            filename:     `${nombreArchivo}.pdf`,
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(ventasGuardadasDiv).set(opt).save();
    } else {
        alert("No hay ventas guardadas para generar el PDF.");
    }
}

window.onload = function() {
    mostrarVentasGuardadas();
};

document.addEventListener("DOMContentLoaded", function() {
    mostrarVentasGuardadas();
});