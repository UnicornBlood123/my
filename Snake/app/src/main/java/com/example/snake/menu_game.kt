package com.example.snake
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.content.Intent
import android.view.View


class menu_game : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_menu_game)
    }
    fun onClickStart(view: View){
        val intent = Intent(this, GameActivity::class.java)
        startActivity(intent)
    }
    fun onClickInfo(view: View){
        val intent = Intent(this, Info::class.java)
        startActivity(intent)
    }
}