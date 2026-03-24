let galleryData = [];

// Cargar datos al iniciar
async function loadGallery() {
    try {
        const response = await fetch('./data.json');
        galleryData = await response.json();
        renderGallery();
    } catch (error) {
        console.error('Error al cargar la galería:', error);
    }
}

// Renderizar galería
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    galleryData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.innerHTML = `
            <img src="${item.src}" alt="${item.alt}">
            <div class="card-content">
                <input type="text" 
                       value="${item.titulo}" 
                       placeholder="Título del proyecto"
                       data-index="${index}"
                       data-field="titulo">
                <textarea placeholder="Descripción breve (opcional)"
                          data-index="${index}"
                          data-field="descripcion">${item.descripcion || ''}</textarea>
                <div class="card-actions">
                    <button class="btn btn-save" onclick="saveItem(${index})">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                    <button class="btn btn-delete" onclick="deleteItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Guardar cambios de un item
function saveItem(index) {
    const titleInput = document.querySelector(`input[data-index="${index}"][data-field="titulo"]`);
    const descInput = document.querySelector(`textarea[data-index="${index}"][data-field="descripcion"]`);
    
    galleryData[index].titulo = titleInput.value;
    galleryData[index].alt = titleInput.value;
    galleryData[index].descripcion = descInput.value;
    
    saveToFile();
}

// Eliminar item
function deleteItem(index) {
    if (confirm('¿Estás seguro de eliminar esta imagen?')) {
        galleryData.splice(index, 1);
        saveToFile();
        renderGallery();
    }
}

// Guardar en archivo JSON
function saveToFile() {
    // Crear el contenido del archivo
    const jsonContent = JSON.stringify(galleryData, null, 2);
    
    // Crear un blob y descargarlo
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Mostrar mensaje de éxito
    const successMsg = document.getElementById('successMsg');
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
    
    alert('Archivo data.json descargado. Reemplaza el archivo en tu proyecto para aplicar los cambios.');
}

// Inicializar
loadGallery();
