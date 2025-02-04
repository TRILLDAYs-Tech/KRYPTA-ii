package com.example.kryptaii

import android.content.ClipboardManager
import android.content.Context
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.TextView
import android.widget.Toast
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        setTitle("KRTPTA II")

        //Setting the UI icons to dark mode so they can be visible.
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR

        // Inputs
        var messageToEncrypt = findViewById<EditText>(R.id.encryptMessage) // User typed message to encrypt
        var messageToDecrypt = findViewById<EditText>(R.id.decryptMessage) // User typed message to decrypt
        var newKryptText = findViewById<EditText>(R.id.newKey) //Custom key field

        // Buttonz

        var encrypt = findViewById<Button>(R.id.encryptButton) //Button to encrypt
        var copy = findViewById<Button>(R.id.copyKryptMessage) //Button to copy krypt message
        var decrypt = findViewById<Button>(R.id.decryptButton) //Button to decrypt
        var clearEn = findViewById<Button>(R.id.clearEncrypt) //Button to clear the entered text
        var clearDe = findViewById<Button>(R.id.clearDecrypt) //Button to clear the displayed && input data
        var clearKryp = findViewById<Button>(R.id.clearCrypt) //Button to clear the displayed && input data
        var saveCrypt = findViewById<Button>(R.id.save) //Save the crypted data
        var setNewKrypt = findViewById<Button>(R.id.newKeyButton) //customKey button

        //Switch Button
        val switchKey = findViewById<Switch>(R.id.kryptSwitch)

        //vIEWs
        var krypt = findViewById<TextView>(R.id.encryptedMessage) //View that displays the krypted message
        var switchText = findViewById<TextView>(R.id.textSwitch)

        //Hidden Buttonz
        clearKryp.visibility = Button.GONE
        saveCrypt.visibility = Button.GONE
        copy.visibility = Button.GONE

        setNewKrypt.setBackgroundColor(Color.parseColor("#FF878787"))

        var encryptionKey = "{8jB*Zk&J6;?D+H9"
        var cipher: Cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
        var secretKeySpec = SecretKeySpec(encryptionKey.toByteArray(), "AES")

        //Set the initial state of the switch button as oFF
        setNewKrypt.isEnabled = false
        //Setting the initial state of the switch text as oFF
        switchText.text = "Custom enKryption key"

        //custom && default key switch handle
        switchKey.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                // Switch is ON, enable the button
                setNewKrypt.isEnabled = true
                setNewKrypt.setBackgroundColor(Color.parseColor("#376317"))
                //Changing the switch text
                switchText.text = "Default enKryption key"

            } else {
                // Switch is OFF, disable the button, reset the encryption key to default
                encryptionKey = "{8jB*Zk&J6;?D+H9"
                secretKeySpec = SecretKeySpec(encryptionKey.toByteArray(), "AES")
                //Disabling the button
                setNewKrypt.setBackgroundColor(Color.parseColor("#FF878787"))
                setNewKrypt.isEnabled = false
                switchText.text = "Custom enKryption key"
                newKryptText.text.clear()
            }
        }

        //Setting new Krypt key
        setNewKrypt.setOnClickListener {
            var text = newKryptText.text.toString()
            if (text.length == 16 || text.length == 24 || text.length == 32) {
                encryptionKey = newKryptText.text.toString()
                secretKeySpec = SecretKeySpec(encryptionKey.toByteArray(), "AES")
                //Toast success message
                Toast.makeText(
                    applicationContext,
                    "enKryption key successfully entered",
                    Toast.LENGTH_LONG
                ).show()
            } else {
                //Toast Error Message
                Toast.makeText(
                    applicationContext,
                    "Please enter an enKryption key of 16, 24 or 32 characters",
                    Toast.LENGTH_LONG
                ).show()
            }
        }

        //CLEARz
        clearEn.setOnClickListener {
            messageToEncrypt.text.clear()
        } //Clears the encrypt message text field

        clearDe.setOnClickListener {
            messageToDecrypt.text.clear()
        } //Clears the decrypt message text field

        //Clearing the
        clearKryp.setOnClickListener {
            clearKryp.visibility = Button.GONE
            copy.visibility = Button.GONE
            saveCrypt.visibility = Button.GONE
            krypt.text = ""
        }

        //Encryption button handle
        encrypt.setOnClickListener {
            //Converting input message
            val inputText = messageToEncrypt.text.toString()
            if (inputText.isNotEmpty()) {
                //encrypting
                val encryptedText = encrypt(inputText, secretKeySpec, cipher)
                krypt.text = encryptedText
                //Showing Buttons
                clearKryp.visibility = Button.VISIBLE
                copy.visibility = Button.VISIBLE
                saveCrypt.visibility = Button.VISIBLE
            } else {
                krypt.text = "Error: Please enter something to encrypt"
                //Hiding Buttons
                clearKryp.visibility = Button.GONE
                copy.visibility = Button.GONE
            }
        }

        //Decryption button handle
        decrypt.setOnClickListener {
            //Converting input message
            val inputText = messageToDecrypt.text.toString()
            if (inputText.isNotEmpty()) {
                try {
                    val decryptedText = decrypt(inputText, secretKeySpec, cipher)
                    krypt.text = decryptedText
                    copy.visibility = Button.VISIBLE
                    clearKryp.visibility = Button.VISIBLE
                    saveCrypt.visibility = Button.VISIBLE
                } catch (e: Exception) {
                    krypt.text = "Error: Incorrect decryption key"
                }
            } else {
                krypt.text = "Error: Please enter something to decrypt"
                copy.visibility = Button.GONE
                clearKryp.visibility = Button.GONE
                saveCrypt.visibility = Button.GONE
            }
        }

        //Copy button to copy text to clipboard
        copy.setOnClickListener {
            val clipboard: ClipboardManager =
                getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = android.content.ClipData.newPlainText("Copied Text", krypt.text)
            clipboard.setPrimaryClip(clip)
            Toast.makeText(applicationContext, "Text copied to clipboard", Toast.LENGTH_SHORT)
                .show()
        }

    }

}

//Encryption Method
private fun encrypt(inputText: String, secretKeySpec: SecretKeySpec, cipher: Cipher): String {
    cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec)
    val encryptedBytes = cipher.doFinal(inputText.toByteArray())
    return android.util.Base64.encodeToString(encryptedBytes, android.util.Base64.DEFAULT)
}

//Decryption Method
private fun decrypt(inputText: String, secretKeySpec: SecretKeySpec, cipher: Cipher): String {
    cipher.init(Cipher.DECRYPT_MODE, secretKeySpec)
    val encryptedBytes = android.util.Base64.decode(inputText, android.util.Base64.DEFAULT)
    val decryptedBytes = cipher.doFinal(encryptedBytes)
    return String(decryptedBytes)
}



