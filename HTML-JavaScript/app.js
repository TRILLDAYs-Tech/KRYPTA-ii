document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('keyHolder');
    const encryptMessageInput = document.getElementById('encryptMessage');
    const encryptedMessageTextarea = document.getElementById('encryptedMessage');
    
    const copyEButton = document.getElementById('copyEncButton');
    const copyDButton = document.getElementById('copyDecButton');
    const clearEncryptButton = document.getElementById('clearEncrypt');
    const decryptMessageInput = document.getElementById('decryptMessage');
    const decryptedMessageTextarea = document.getElementById('decryptedMessage');
    const clearDecryptButton = document.getElementById('clearDecrypt');
    const setNewKeyButton = document.getElementById('setNewKeyButton');
    const keySwitch = document.getElementById('keySwitch');
    let encryptionKey = "G2;~`4m}8:5=u*xF0-0>/n(,+L3hj&$E";
    let dfKey = "G2;~`4m}8:5=u*xF0-0>/n(,+L3hj&$E";
    const resetB = document.getElementById('resetKrypt');
    const useKey = document.getElementById('useKey');
    const copyGenKey = document.getElementById('copyGenKey');
    const displayArea = document.getElementById('genKeyHolder');
    const rstGenKey = document.getElementById('rstGenKey');

    let genKie = "";

    document.getElementById('genKryptKey').addEventListener('click', function() {
    // Get the selected radio button value
    const selectedLength = document.querySelector('input[name="genLength"]:checked');
    
    displayArea.textContent = ""; // Clearing the display Area

    if (!selectedLength) {
        //Display Error message
        displayArea.textContent = "Error: Please select a key-length to generate";
    }
    
    // Determine key length based on selected value
    let keyLength;
    switch (selectedLength.value) {
        case '16b':
            keyLength = 16;
        break;
        case '24b':
            keyLength = 24;
        break;
        case '32b':
            keyLength = 32;
        break;
    }

    // Generate a random key of the selected length
    const generatedKey = trueGen(keyLength);
    
    let passLength = generatedKey.length
    let genKeyPass = "";
    // Display the key in the textarea
    for (let i = 0; i < passLength; i++) {
        genKeyPass += "•"
    };

    displayArea.value = genKeyPass;
    
    // Enable the "Use this key" button
    useKey.disabled = false;
    //Enable Copy Gen Message:
    copyGenKey.disabled = false;
    //Enable reset Gen key:
    rstGenKey.disabled = false
    });

    document.getElementById('setNewKrypt').addEventListener('click', function() {
        const newKey = document.getElementById('key').value;
        
        if (![16, 24, 32].includes(newKey.length)) {
            alert('ERRoR! The key must have 16, 24, or 32 character for AES encryption.');
        } else {
            if([16].includes(newKey.length)){
                display.textContent = 'Using 16-bit custom key';    
                encryptionKey = newKey;
                alert('Encryption key successfully set');
                useKey.disabled = true;
                copyGenKey.disabled = true;
                //Disable reset Gen key:
                rstGenKey.disabled = true;
            } else {
                if([24].includes(newKey.length)){
                    display.textContent = 'Using 24-bit custom key';    
                    encryptionKey = newKey;
                    alert('Encryption key successfully set');
                    useKey.disabled = true;
                    copyGenKey.disabled = true;
                    //Disable reset Gen key:
                    rstGenKey.disabled = true;
                } else {
                    if([32].includes(newKey.length)){
                        display.textContent = 'Using 32-bit custom key';    
                        encryptionKey = newKey;
                        alert('Encryption key successfully set');
                        useKey.disabled = true;
                        copyGenKey.disabled = true;
                        //Disable reset Gen key:
                        rstGenKey.disabled = true;
                    }
                }
            }
            
        }
    });
    
    document.getElementById('switchKey').addEventListener('change', function () {
        const isChecked = this.checked;
        const setNewKrypt = document.getElementById('setNewKrypt');
        const switchText = document.getElementById('switchText');
        const newKryptText = document.getElementById('key');
        const display = document.getElementById('keyHolder');

        if (isChecked) {
            
            // Switch is ON, enable the button
            setNewKrypt.disabled = false;
            resetKrypt.disabled = false;
            useKey.disabled = true;
            copyGenKey.disabled = true;
            rstGenKey.disabled = true;

            setNewKrypt.classList.add('enabled');
            newKryptText.textContent = '';   // Clear the newKryptText
            switchText.textContent = 'Use default enKryption key';
            
        } else {
            
            // Switch is OFF, disable the button, reset the encryption key to default
            encryptionKey = dfKey;
            display.textContent = 'Using default key';

            // Disabling the buttons
            setNewKrypt.disabled = true;
            resetKrypt.disabled = true;
            setNewKrypt.classList.remove('enabled');
            switchText.textContent = 'Use custom enKryption key';
            newKryptText.textContent = '';  // Clear the newKryptText
        }
    });

    //Reset Custom Key 
    resetB.addEventListener('click', function () { 
        setNewKrypt.disabled = true; 
        useKey.disabled = true;
        copyGenKey.disabled = true;
        resetB.disabled = true;
        encryptionKey = dfKey; //default krptKey
        display.textContent = 'Using default key'; //default key message
        
    });

    //Reset gen Key
    rstGenKey.addEventListener('click', function () {  
        //Resetting the key
        encryptionKey = dfKey;

        //displaying dF key usage
        display.textContent = 'Using default key';

        //Disabling buttons:
        useKey.disabled = true;
        copyGenKey.disabled = true;
        rstGenKey.disabled = true;

    });

    //Generating Algorythm:
    function trueGen(kLength) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`!\\$%^&*()_-+=.,<>{}[]:;'?";
        let randomString = "";

        for (let i = 0; i < kLength; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            randomString += chars.charAt(randomIndex);
        }

        //Using generated Key
        useKey.addEventListener('click', function () { 
            switch (kLength) {
                case 16:
                    display.textContent = 'Using 16-bit generated Key';
                break;
                case 24:
                    display.textContent = 'Using 24-bit generated Key';
                break;
                case 32:
                    display.textContent = 'Using 32-bit generated Key';
                break;
            }
            
            encryptionKey = randomString;   
        });

        genKie = randomString;

        return randomString;
    }

    //copying the generated key:
    copyGenKey.addEventListener('click', function () {  
        toTextBoardSent(genKie);
    });

    //Enkrypt Algorythm
    function encrypt(text, key) {
        const keyHex = CryptoJS.enc.Utf8.parse(key);
        const encrypted = CryptoJS.AES.encrypt(text, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }

    //Dekrypt Algorythm
    function decrypt(text, key) {
        const keyHex = CryptoJS.enc.Utf8.parse(key);
        const decrypted = CryptoJS.AES.decrypt(text, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    //Enkrypt Button Click
    document.getElementById('encryptButton').addEventListener('click', () => {
        const message = encryptMessageInput.value;
        if (message) {
            encryptedMessageTextarea.value = encrypt(message, encryptionKey);
            if (encryptionKey === dfKey){
                display.textContent = 'Using default key';
            }
         } else {
            alert("Please enter something to encrypt")
        }
    });

    //Dekrypt Button Click
    document.getElementById('decryptButton').addEventListener('click', () => {
        const message = decryptMessageInput.value;
        if (message) {
            try {
                decryptedMessageTextarea.value = decrypt(message, encryptionKey);
            } catch (e) {
                decryptedMessageTextarea.value = 'Error: Incorrect decryption key';
            }
        }
    });

    //Clipboard
    function toTextBoard() {
        encryptedMessageTextarea.select();
        document.execCommand('copy');
        alert('Text copied to clipboard');
    }

    //KlipBoard via send:
    function toTextBoardSent(genKey) {
        navigator.clipboard.writeText(genKey).then(function() {
            alert('Generated key copied to clipboard');
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
        });
    }

    //Copy Encrypt Button Click
    copyEButton.addEventListener('click', () => {
        encryptedMessageTextarea.select();
        document.execCommand('copy');
        alert('Text copied to clipboard');
    });

    //Copy Decrypt Button Click
    copyDButton.addEventListener('click', () => {
        decryptedMessageTextarea.select();
        document.execCommand('copy');
        alert('Text copied to clipboard');
    });

    //Clearing encrypts
    clearEncryptButton.addEventListener('click', () => {
        encryptMessageInput.value = '';
        encryptedMessageTextarea.value = '';
    });

    //Clearing decrypts
    clearDecryptButton.addEventListener('click', () => {
        decryptMessageInput.value = '';
        decryptedMessageTextarea.value = '';
    });

    keySwitch.addEventListener('change', () => {
        setNewKeyButton.disabled = !keySwitch.checked;
    });

});
