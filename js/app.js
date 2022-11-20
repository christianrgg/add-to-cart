// Variables

const carrito           = document.querySelector(`#carrito`); 
const contenedorCarrito = document.querySelector(`#lista-carrito tbody`);
const vaciarCarritoBtn  =document.querySelector(`#vaciar-carrito`);
const listaCursos       = document.querySelector(`#lista-cursos`);
let articulosCarrito    = [];


 
cargarEventListeners();
function cargarEventListeners() {
    //Cuando agregas un curso presionando "agregar al carrito"
    listaCursos.addEventListener(`click`, agregarCurso);

    // Eliminar elementos del carrito
    carrito.addEventListener(`click`, eliminarCurso);

    //Extraer cursos de local storage
    document.addEventListener(`DOMContentLoaded`, () =>{
        articulosCarrito = JSON.parse(localStorage.getItem(`carrito`)) || [];
        carritoHTML();
    })

    //Vaciar carrito
    vaciarCarritoBtn.addEventListener(`click`, () =>{
        articulosCarrito = [];
        limpiarHTML();
        localStorage.clear();
    })
}

//Funciones
function agregarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains(`agregar-carrito`)){
        const cursoSeleccionado =  e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

// Eliminar curso del carrito
function eliminarCurso(e){
    if(e.target.classList.contains(`borrar-curso`)) {
        const cursoId = e.target.getAttribute(`data-id`);

        //Elimina del arreglo articulosCarrito por el id
        articulosCarrito = articulosCarrito.filter(curso =>{
            if(curso.id == cursoId) {
                if(curso.cantidad>1) {
                    curso.cantidad--;
                    return curso;
                } else {
                    delete curso
                }
            }else {
                return curso
            }
        } );
        carritoHTML();
    }
}

//Lectura del contenido del HTML al que le dimos click y extraer la información
function leerDatosCurso(curso){
//  console.log(curso);

 //Objeto con el contenido del curso actual
 const infoCurso = {
    imagen: curso.querySelector(`img`).src,
    titulo: curso.querySelector(`h4`).textContent,
    precio: curso.querySelector(`.precio span`).textContent,
    id: curso.querySelector(`a`).getAttribute(`data-id`),
    cantidad: 1
 }
 
 //Revisar si un elemento ya esta en el carrito
 const existe = articulosCarrito.some(curso => curso.id === infoCurso. id);
 if (existe) {
    //Actualizar cantidad
    const curso = articulosCarrito.map(curso =>{
        if(curso.id===infoCurso.id) {
            curso.cantidad++;
            return curso;
        } else {
            return curso;
        }
    });
    articulosCarrito=[...curso];
 } else {
    // Agregar el curso al arreglo de carrito
    articulosCarrito=[...articulosCarrito, infoCurso];
    console.log(articulosCarrito);
 }

 carritoHTML();
}

//Muestra el carrito de compras en el html
function carritoHTML(){
    //Limpiar el HTML de duplicados
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach(curso=>{
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement(`tr`);
        row.innerHTML = `
        <td><img src="${imagen}"></td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td><a href="#" class="borrar-curso" data-id="${id}"> X </a></td>
        `;
        
        //Agregar el HTML de carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    //Agregar el carrito de compras al storage
    sincronizarStorage();
} 

// Elimina los cursos del tbody
function limpiarHTML() {
    //Forma ineficiente
    // contenedorCarrito.innerHTML = ``;

    //Forma eficiente
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

function sincronizarStorage(){
    localStorage.setItem(`carrito`, JSON.stringify(articulosCarrito));
}