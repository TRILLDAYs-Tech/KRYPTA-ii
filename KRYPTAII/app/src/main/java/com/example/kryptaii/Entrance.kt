package com.example.kryptaii

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast

class Entrance : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_entrance)

//      KONSTANCE
        val NO_KEY = "No key entered. Please enter an enKryption key to continue."

//      Button
        var kryptKey = findViewById<Button>(R.id.kryptB)

//      Input
        var key = findViewById<EditText>(R.id.kryptK)

//      FunktCH
        kryptKey.setOnClickListener {
//          First convert key then check if key ia empty
            val doorKey = key.text.toString()
            if (doorKey.isNotEmpty()) {
//              Sending the key to the next page
                startActivity(
                    Intent(this,MainActivity::class.java)
                        .putExtra("Door Key", doorKey)
                            )
            } else {
//              Toasting the no-key message
                Toast.makeText(applicationContext, NO_KEY, Toast.LENGTH_LONG).show() //Toast the no key message
            }
        }

    }
}