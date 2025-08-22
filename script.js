document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const form = document.getElementById('generator-form');
    const downloadBtn = document.getElementById('download-btn');
    const canvas = document.getElementById('result-canvas');
    const ctx = canvas.getContext('2d');

    // --- Input Fields ---
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const dobInput = document.getElementById('dob');
    const docNumberInput = document.getElementById('docNumber');
    const issueDateInput = document.getElementById('issueDate');
    const expiryDateInput = document.getElementById('expiryDate');
    
    // --- Image Assets (Using placeholders for easy setup) ---
    const templateImage = new Image();
    // A generic blank ID card template
    templateImage.src = 'https://i.imgur.com/V2Tq2zN.png'; 
    
    const photoImage = new Image();
    // A placeholder photo
    photoImage.src = 'https://i.imgur.com/r3uGDUj.jpeg'; 
    photoImage.crossOrigin = "anonymous"; // Important for loading external images

    // --- The Main Drawing Function ---
    function generateCard() {
        // Wait for both images to be fully loaded before drawing
        Promise.all([
            new Promise(resolve => { if (templateImage.complete) resolve(); else templateImage.onload = resolve; }),
            new Promise(resolve => { if (photoImage.complete) resolve(); else photoImage.onload = resolve; })
        ]).then(() => {
            // 1. Clear canvas and draw the base template
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);

            // 2. Draw the user's photo
            // Coordinates: (x, y, width, height)
            ctx.drawImage(photoImage, 50, 100, 250, 312);

            // 3. Set text styles
            ctx.fillStyle = '#1a1a1a'; // Dark grey text color
            ctx.font = "bold 28px 'Roboto Mono', monospace";

            // 4. Draw text from input fields onto the canvas
            // Coordinates: (x, y)
            ctx.fillText(lastNameInput.value.toUpperCase(), 350, 140);
            ctx.fillText(firstNameInput.value.toUpperCase(), 350, 185);
            
            ctx.font = "24px 'Roboto Mono', monospace";
            ctx.fillText(dobInput.value, 350, 255);
            ctx.fillText(docNumberInput.value, 350, 325);
            
            ctx.font = "20px 'Roboto Mono', monospace";
            ctx.fillText(issueDateInput.value, 380, 420);
            ctx.fillText(expiryDateInput.value, 590, 420);
            
            // Draw the MRZ (Machine Readable Zone) text
            ctx.font = "bold 30px 'Roboto Mono', monospace";
            ctx.fillStyle = '#333';
            let mrzText1 = `IDARG<<${lastNameInput.value.toUpperCase()}<<${firstNameInput.value.toUpperCase()}`;
            let mrzText2 = `${docNumberInput.value.replace(/\./g, '')}<<<<<<<<<<<<<<<<<<<<<<`;
            mrzText1 = mrzText1.padEnd(30, '<');
            mrzText2 = mrzText2.padEnd(30, '<');
            ctx.fillText(mrzText1.substring(0,30), 50, 480);
            ctx.fillText(mrzText2.substring(0,30), 50, 515);

        }).catch(error => {
            console.error("Error loading images:", error);
        });
    }

    // --- Event Listeners ---

    // Generate the card whenever any input field changes
    const inputs = [firstNameInput, lastNameInput, dobInput, docNumberInput, issueDateInput, expiryDateInput];
    inputs.forEach(input => {
        input.addEventListener('input', generateCard);
    });

    // Handle form submission for the download button
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from trying to submit to a server
        
        // Create a temporary link element
        const link = document.createElement('a');
        
        // Set the link's href to the canvas's data as a PNG image
        link.href = canvas.toDataURL('image/png');
        
        // Set the download attribute with a filename
        link.download = `generated_id_card_${lastNameInput.value}.png`;
        
        // Programmatically click the link to trigger the download
        link.click();
    });

    // --- Initial Call ---
    // Generate the card for the first time on page load with default values
    generateCard();
});