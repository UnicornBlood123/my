package com.example.snake

import android.annotation.SuppressLint
import android.content.Context
import android.media.MediaPlayer

@SuppressLint("StaticFieldLeak")
object SoundManager {
    private lateinit var  musicGame1: MediaPlayer
    private lateinit var  musicGame2: MediaPlayer
    private lateinit var  musicApple: MediaPlayer
    private lateinit var  musicOver: MediaPlayer
    var isPlaySound = false
    var context:Context? = null
        set(value){
            musicApple=MediaPlayer.create(value, R.raw.apple)
            musicOver=MediaPlayer.create(value, R.raw.over)
            prepareGapLessTankMoveSound(value!!)
        }

    private fun prepareGapLessTankMoveSound(context: Context) {
        musicGame2=MediaPlayer.create(context, R.raw.game)
        musicGame1=MediaPlayer.create(context, R.raw.game)
        musicGame1.isLooping = true
        musicGame2.isLooping = true
        musicGame1.setNextMediaPlayer(musicGame2)
        musicGame2.setNextMediaPlayer(musicGame1)
    }
    fun NVolMusic(){
        musicGame1.setVolume(0.0f,0.0f);
        musicGame2.setVolume(0.0f,0.0f);
        musicApple.setVolume(0.0f,0.0f);
        musicOver.setVolume(0.0f,0.0f);
    }
    fun VolMusic(){
        musicGame1.setVolume(0.5f,0.5f);
        musicGame2.setVolume(0.5f,0.5f);
        musicApple.setVolume(0.5f,0.5f);
        musicOver.setVolume(0.5f,0.5f);
    }
    fun playGameMusic(){
        musicGame1.start()
    }
    fun pauseGameMusic(){
        musicGame1.pause()
        musicGame2.pause()
    }

    fun playAppleMusic(){
        musicApple.start()
    }
    fun pauseAppleMusic(){
        musicApple.pause()
    }

    fun playOverMusic(){
        musicOver.start()
    }
    fun pauseOverMusic(){
        musicOver.pause()
    }



}
