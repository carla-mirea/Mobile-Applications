package com.example.lab2_uinative.adapter

import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.lab2_uinative.R
import com.example.lab2_uinative.data.ConcertList
import com.example.lab2_uinative.model.Concert
import com.example.lab2_uinative.service.EditConcert

class ConcertAdapter(private val context: ConcertList, private val concerts: MutableList<Concert>) :
    RecyclerView.Adapter<ConcertAdapter.ConcertViewHolder>() {

    inner class ConcertViewHolder(view: View) : RecyclerView.ViewHolder(view)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ConcertViewHolder {
        val adapterLayout = LayoutInflater.from(parent.context).inflate(R.layout.concert_card_layout, parent, false)
        return ConcertViewHolder(adapterLayout)
    }

    override fun onBindViewHolder(holder: ConcertViewHolder, position: Int) {
        val concert = concerts[position]
        holder.itemView.apply {
            findViewById<TextView>(R.id.concertTitle).text = concert.name
            findViewById<TextView>(R.id.concertDescription).text = concert.description
            findViewById<TextView>(R.id.concertDate).text = concert.date.toString()
            findViewById<TextView>(R.id.concertLocation).text = concert.location
            findViewById<TextView>(R.id.concertPerformers).text = concert.formatPerformers()
        }

        holder.itemView.findViewById<Button>(R.id.deleteButton).setOnClickListener {
            val dialog = Dialog(context)
            dialog.setCancelable(true)
            dialog.setContentView(R.layout.delete_popup)
            dialog.findViewById<TextView>(R.id.titleLabel).text = "${concert.name}?"

            dialog.findViewById<View>(R.id.yesButton).setOnClickListener {
                concerts.removeAt(position)
                notifyDataSetChanged()
                dialog.dismiss()
            }

            dialog.findViewById<View>(R.id.noButton).setOnClickListener { dialog.dismiss() }
            dialog.show()
        }

        holder.itemView.findViewById<Button>(R.id.editButton).setOnClickListener {
            val bundle = Bundle()
            bundle.putParcelable("concert", concert)
            val intent = Intent(context, EditConcert::class.java).apply {
                putExtra("concertBundle", bundle)
            }
            context.startActivityForResult(intent, 5)
        }
    }

    override fun getItemCount() = concerts.size
}
