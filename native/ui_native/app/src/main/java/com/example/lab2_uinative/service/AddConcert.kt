package com.example.lab2_uinative.service

import android.os.Bundle
import android.view.Window
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.example.lab2_uinative.R
import com.example.lab2_uinative.model.Concert
import org.threeten.bp.LocalDate
import org.threeten.bp.format.DateTimeFormatter
import org.threeten.bp.format.DateTimeParseException

class AddConcert : AppCompatActivity() {

    private lateinit var cancelButton: Button
    private lateinit var saveButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.add_concert)

        supportActionBar?.hide()

        val window: Window = this@AddConcert.window
        window.statusBarColor = ContextCompat.getColor(this@AddConcert, R.color.black)

        saveButton = findViewById(R.id.createButton)
        cancelButton = findViewById(R.id.cancelButtonAdd)

        saveButton.setOnClickListener { addConcert() }
        cancelButton.setOnClickListener { goBack() }
    }

    private fun addConcert() {
        if (checkInputs()) {
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
            try {
                val concert = Concert(
                    name = findViewById<EditText>(R.id.nameInputCreate).text.toString(),
                    description = findViewById<EditText>(R.id.descriptionInputCreate).text.toString(),
                    date = LocalDate.parse(findViewById<EditText>(R.id.dateInputCreate).text.toString(), formatter),
                    location = findViewById<EditText>(R.id.locationInputCreate).text.toString(),
                    performers = findViewById<EditText>(R.id.performersInputCreate).text.toString().split(", "),
                )

                val bundle = Bundle()
                bundle.putParcelable("concert", concert)
                intent.putExtra("concertBundle", bundle)
                setResult(RESULT_OK, intent)
                finish()
            } catch (e: DateTimeParseException) {
                Toast.makeText(
                    this, "Invalid date format! Please use yyyy-MM-dd.", Toast.LENGTH_LONG
                ).show()
            }
        } else {
            Toast.makeText(
                this, "All fields must be completed! Also, the date format must be yyyy-MM-dd.", Toast.LENGTH_LONG
            ).show()
        }
    }

    private fun checkInputs(): Boolean {
        return findViewById<EditText>(R.id.nameInputCreate).text.isNotEmpty() &&
                findViewById<EditText>(R.id.descriptionInputCreate).text.isNotEmpty() &&
                findViewById<EditText>(R.id.dateInputCreate).text.isNotEmpty() &&
                findViewById<EditText>(R.id.locationInputCreate).text.isNotEmpty() &&
                findViewById<EditText>(R.id.performersInputCreate).text.isNotEmpty()
    }

    private fun goBack() {
        finish()
    }
}
