package com.example.lab2_uinative.model

import android.os.Parcelable
import android.util.Log
import kotlinx.parcelize.Parcelize

@Parcelize
data class Concert(
    var name: String,
    var description: String,
    var date: org.threeten.bp.LocalDate,
    var location: String,
    var performers: List<String>,
    var id: Int
): Parcelable {

    companion object {
        var currentId = 0
    }

    constructor(name: String, description: String, date: org.threeten.bp.LocalDate,
                location: String, performers: List<String>) : this(name, description, date, location, performers, currentId++){
        Log.i("Concert Model: ", "CurrentId is $currentId")
    }

    fun formatPerformers(): String {
        return "Performers: ${performers.joinToString(", ")}"
    }

    fun formatPerformersEditForm(): String {
        return performers.joinToString(", ")
    }

    override fun toString(): String {
        return "$name - $description - ${date.toString()} - $location - ${formatPerformers()}"
    }
}