package com.example.lab2_uinative.service

import android.content.Intent
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

class EditConcert : AppCompatActivity() {

    lateinit var id: Number;
    private lateinit var initialConcert: Concert;

    private lateinit var cancelButton: Button;
    private lateinit var saveButton: Button;

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.edit_concert)
        supportActionBar?.hide()

        val window: Window = this@EditConcert.window
        window.statusBarColor = ContextCompat.getColor(this@EditConcert, R.color.black)

        val bundle = intent.getBundleExtra("concertBundle")
        if(bundle != null) {
            val concert = bundle.getParcelable<Concert>("concert")
            if (concert != null) {
                initialConcert = concert
                id = concert.id
            }
        }
        initializeInputs()

        saveButton = findViewById(R.id.saveButton)
        cancelButton = findViewById(R.id.cancelButtonEdit)

        saveButton.setOnClickListener(){
            editConcert()
        }
        cancelButton.setOnClickListener(){
            goBack()
        }
    }

    private fun editConcert() {
        if(checkInputs()){
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
            try{
                initialConcert.name = findViewById<EditText>(R.id.editConcertName).text.toString()
                initialConcert.description = findViewById<EditText>(R.id.editConcertDescription).text.toString()
                initialConcert.date = LocalDate.parse(findViewById<EditText>(R.id.editConcertDate).text.toString(), formatter)
                initialConcert.location = findViewById<EditText>(R.id.editConcertLocation).text.toString()
                initialConcert.performers = listOf(findViewById<EditText>(R.id.editConcertPerformers).text.toString())

                val bundle = Bundle()
                bundle.putParcelable("concert", initialConcert)
                intent.putExtra("concertBundle", bundle)
                intent.putExtra("id", id)
                setResult(RESULT_OK, intent)
                finish()
            } catch (e: DateTimeParseException) {
                Toast.makeText(
                    this, "Invalid date format! Please use yyyy-MM-dd.", Toast.LENGTH_LONG
                ).show()
            }
        } else {
            Toast.makeText(this, "All fields must be completed and the date must have the format yyyy-MM-dd!", Toast.LENGTH_LONG).show();
        }
    }

    private fun goBack(){
        intent = Intent()
        finish()
    }

    private fun checkInputs(): Boolean {
        if(findViewById<EditText>(R.id.editConcertName).text.isEmpty() or findViewById<EditText>(R.id.editConcertDescription).text.isEmpty() or findViewById<EditText>(R.id.editConcertLocation).text.isEmpty() or findViewById<EditText>(R.id.editConcertPerformers).text.isEmpty()){
            return false
        }

        val dateChecker = findViewById<EditText>(R.id.editConcertDate).text.toString()
        if(!isValidDate(dateChecker))
            return false

        return true
    }

    fun isValidDate(stringToTest: String): Boolean {
        try {
            LocalDate.parse(stringToTest)
        } catch (pe: DateTimeParseException) {
            return false
        }
        return true
    }

    private fun initializeInputs(){
        findViewById<EditText>(R.id.editConcertID).setText(initialConcert.id.toString())
        findViewById<EditText>(R.id.editConcertID).isEnabled = false
        findViewById<EditText>(R.id.editConcertName).setText(initialConcert.name)
        findViewById<EditText>(R.id.editConcertDescription).setText(initialConcert.description)
        findViewById<EditText>(R.id.editConcertDate).setText(initialConcert.date.toString())
        findViewById<EditText>(R.id.editConcertLocation).setText(initialConcert.location)
        findViewById<EditText>(R.id.editConcertPerformers).setText(initialConcert.formatPerformersEditForm())
    }
}