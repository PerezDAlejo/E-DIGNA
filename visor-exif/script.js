document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileElem = document.getElementById('fileElem');
    const resultsContainer = document.getElementById('results-container');
    const imgPreview = document.getElementById('img-preview');
    const metadataList = document.getElementById('metadata-list');
    const noExifMsg = document.getElementById('no-exif-msg');

    // Drag & Drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
    });

    dropArea.addEventListener('drop', handleDrop, false);
    dropArea.addEventListener('click', () => fileElem.click());
    fileElem.addEventListener('change', function() { handleFiles(this.files) });

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (!file.type.match('image.*')) {
                alert('Por favor, selecciona un archivo de imagen válido.');
                return;
            }

            // Preview
            const reader = new FileReader();
            reader.onload = function(e) {
                imgPreview.src = e.target.result;
            }
            reader.readAsDataURL(file);

            // Extract EXIF
            extractExif(file);
        }
    }

    async function extractExif(file) {
        // Reset UI
        resultsContainer.classList.remove('hidden');
        metadataList.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Analizando datos invisibles...</p>';
        noExifMsg.classList.add('hidden');

        try {
            // Using exifr library
            const data = await exifr.parse(file, true); // true = all possible data including GPS
            
            metadataList.innerHTML = '';
            
            if (data && Object.keys(data).length > 0) {
                // Key metadata we want to highlight for educational purposes
                const highlights = {
                    'Make': 'Dispositivo (Marca)',
                    'Model': 'Modelo del Teléfono/Cámara',
                    'DateTimeOriginal': 'Fecha y Hora exacta de la foto',
                    'Software': 'Software edición',
                    'latitude': 'GPS: Latitud',
                    'longitude': 'GPS: Longitud',
                    'Flash': 'El flash se usó'
                };

                let foundCritical = false;

                for (const [key, label] of Object.entries(highlights)) {
                    if (data[key] !== undefined) {
                        foundCritical = true;
                        let val = data[key];
                        // format dates
                        if (val instanceof Date) {
                            val = val.toLocaleString();
                        }
                        
                        const item = document.createElement('div');
                        item.className = 'meta-item';
                        if (key === 'latitude' || key === 'longitude') item.classList.add('critical');
                        
                        item.innerHTML = `<strong>${label}:</strong> <span>${val}</span>`;
                        metadataList.appendChild(item);
                    }
                }

                if (!foundCritical) {
                     metadataList.innerHTML = '<p>Se encontraron metadatos técnicos, pero ninguno clasificado como altamente sensible (como GPS o modelo exacto).</p>';
                } else {
                     const warning = document.createElement('p');
                     warning.className = 'alert-warning';
                     warning.style.marginTop = '15px';
                     warning.innerHTML = '<strong>¡Cuidado!</strong> Estos datos viajan ocultos en tu foto si se la envías a alguien por correo original o subes a ciertas plataformas poco seguras.';
                     metadataList.appendChild(warning);
                }
            } else {
                metadataList.innerHTML = '';
                noExifMsg.classList.remove('hidden');
            }
        } catch (error) {
            console.error(error);
            metadataList.innerHTML = '';
            noExifMsg.classList.remove('hidden');
        }
    }
});
