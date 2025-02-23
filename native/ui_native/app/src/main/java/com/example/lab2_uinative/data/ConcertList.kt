package com.example.lab2_uinative.data

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.Window
import android.widget.Button
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.lab2_uinative.R
import com.example.lab2_uinative.adapter.ConcertAdapter
import com.example.lab2_uinative.model.Concert
import com.example.lab2_uinative.service.AddConcert
import org.threeten.bp.LocalDate
import org.threeten.bp.format.DateTimeFormatter


class ConcertList : AppCompatActivity() {
    private lateinit var recyclerView: RecyclerView
    private val concerts = mutableListOf<Concert>()
    lateinit var addButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        this.recyclerView = findViewById(R.id.concertRecyclerView)

        supportActionBar?.hide()

        val window: Window = this@ConcertList.window
        window.statusBarColor = ContextCompat.getColor(this@ConcertList, R.color.black)

        initConcerts()

        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = ConcertAdapter(this, concerts)

        addButton = findViewById(R.id.addButton)
        addButton.setOnClickListener {
            val intent = Intent(applicationContext, AddConcert::class.java)
            startActivityForResult(intent, 3)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 3 && resultCode == Activity.RESULT_OK) {
            data?.let {
                val bundle = it.getBundleExtra("concertBundle")
                val concert = bundle?.getParcelable<Concert>("concert")
                concert?.let { addConcertToList(concert) }
                Toast.makeText(this, "Concert Added!", Toast.LENGTH_SHORT).show()
                recyclerView.adapter?.notifyItemInserted(concerts.size - 1)
            }
        } else if (requestCode == 5 && resultCode == Activity.RESULT_OK) {
            data?.let {
                val bundle = it.getBundleExtra("concertBundle")
                val concert = bundle?.getParcelable<Concert>("concert")
                val id = it.getIntExtra("id", -1)
                if (concert != null && id != -1) updateConcert(concert, id)
            }
        }
    }

    private fun updateConcert(concert: Concert, id: Number) {
        for (i in concerts.indices) {
            if (concerts[i].id == id) {
                concerts[i] = concert
                Toast.makeText(this, "Concert Updated!", Toast.LENGTH_SHORT).show()
                recyclerView.adapter?.notifyItemChanged(i)
            }
        }
    }

    private fun addConcertToList(concert: Concert) {
        concerts.add(concert)
    }

    private fun initConcerts() {
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
        val samplePerformers = listOf("Performer1", "Performer2")

        concerts.add(
            Concert(
                "Fun Lovin' Criminals", "An amazing concert", LocalDate.parse("2024-10-20", formatter),
                "FORM Space, Cluj-Napoca", samplePerformers
            )
        )
        concerts.add(
            Concert(
                "Jacob Lee", "A wonderful evening", LocalDate.parse("2024-11-08", formatter),
                "Urban, Cluj-Napoca", samplePerformers
            )
        )
        concerts.add(
            Concert(
                "JP Cooper", "A wonderful evening", LocalDate.parse("2024-11-11", formatter),
                "FORM Space, Cluj-Napoca", samplePerformers
            )
        )
        concerts.add(
            Concert(
                "Andra", "A wonderful evening", LocalDate.parse("2024-12-14", formatter),
                "BT Arena, Cluj-Napoca", samplePerformers
            )
        )
    }
}
