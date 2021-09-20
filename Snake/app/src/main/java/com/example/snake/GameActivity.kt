package com.example.snake

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.view.SoundEffectConstants
import android.view.View
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.snake.SnakeCore.gameSpeed
import com.example.snake.SnakeCore.isPlay
import com.example.snake.SnakeCore.starTheGame
import com.example.snake.SoundManager.isPlaySound
import kotlinx.android.synthetic.main.activity_main.*

const val HEAD_SIZE = 45
const val CELLS_ON_FIELD = 24

class GameActivity : AppCompatActivity() {
    private lateinit var prefs: SharedPreferences
    private val FIRST_PLACE = "counter1"
    private val SECOND_PLACE= "counter2"
    private val THIRD_PLACE = "counter3"

    override fun onPause() {
        super.onPause()
        ivPause.setImageResource(R.drawable.ic__play)
        SoundManager.pauseGameMusic()
        SnakeCore.isPlay=false
    }

    override fun onResume() {
        super.onResume()
        SnakeCore.isPlay= isPlay
    }

    private val allTail = mutableListOf<PartOfTail>()
    private val food by lazy {
        ImageView(this)
            .apply {
                this.setImageResource(R.drawable.food)
                this.layoutParams = FrameLayout.LayoutParams(HEAD_SIZE, HEAD_SIZE)
            }
    }
    private val food_speed by lazy {
        ImageView(this)
            .apply {
                this.setImageResource(R.drawable.food_speed)
                this.layoutParams = FrameLayout.LayoutParams(HEAD_SIZE, HEAD_SIZE)
            }
    }
    private val points by lazy {
        ImageView(this)
            .apply {
                this.setImageResource(R.drawable.point1)
                this.layoutParams = FrameLayout.LayoutParams(HEAD_SIZE, HEAD_SIZE)
            }
    }
    private val point by lazy {
        ImageView(this)
            .apply {
                this.setImageResource(R.drawable.point2)
                this.layoutParams = FrameLayout.LayoutParams(HEAD_SIZE, HEAD_SIZE)
            }
    }

    private val head by lazy {
        ImageView(this)
            .apply {
                this.layoutParams = FrameLayout.LayoutParams(HEAD_SIZE,HEAD_SIZE)
                this.setImageResource(R.drawable.snake)
            }
    }
    private var currentDicertion = Direction.Down

    override fun onCreate(savedInstanceState: Bundle?) {
        fun generateFoodCoordinates():ViewCoordinate{
            val viewCoordinate = ViewCoordinate(
                (0 until CELLS_ON_FIELD).random()* HEAD_SIZE,
                (0 until CELLS_ON_FIELD).random()* HEAD_SIZE)
            for(partTeil in allTail) {
                if(partTeil.viewCoordinate == viewCoordinate){
                    return  generateFoodCoordinates()
                }
            }
            if(head.top==viewCoordinate.top && head.left==viewCoordinate.left){
                return generateFoodCoordinates()
            }
            return viewCoordinate
        }

       fun generateNewFood(){
           val viewCoordinate = generateFoodCoordinates()
           if(allTail.size >= 6 && allTail.size%7==6){
               (food_speed.layoutParams as FrameLayout.LayoutParams).topMargin = viewCoordinate.top
               (food_speed.layoutParams as FrameLayout.LayoutParams).leftMargin = viewCoordinate.left
               runOnUiThread {
                   container.removeView(food)
                   container.addView(food_speed)
               }
           }
           else {
               (food.layoutParams as FrameLayout.LayoutParams).topMargin = viewCoordinate.top
               (food.layoutParams as FrameLayout.LayoutParams).leftMargin = viewCoordinate.left
               runOnUiThread {
                   container.removeView(food_speed)
                   container.removeView(food)
                   container.addView(food)
               }
           }
           if(allTail.size==24){
               isPlay=false
               ivPause.setImageResource(R.drawable.ic__play)
               SoundManager.pauseGameMusic()
               AlertDialog.Builder(this)
                   .setTitle("Предупреждение")
                   .setMessage("Запрещено пересекать границы!")
                   .setPositiveButton("Продолжить") {_,_ ->
                   }
                   .setCancelable(true)
                   .create()
                   .show()
           }
       }

        fun drawPartOfTail(top: Int, left: Int): ImageView {
            val tailImage = ImageView(this)
            tailImage.setImageResource(R.drawable.snake_skin)
            tailImage.layoutParams = FrameLayout.LayoutParams(HEAD_SIZE, HEAD_SIZE)
            (tailImage.layoutParams as FrameLayout.LayoutParams).topMargin = top
            (tailImage.layoutParams as FrameLayout.LayoutParams).leftMargin = left
            container.addView(tailImage)
            return  tailImage
        }

        fun addPartOfTail(top:Int, left:Int){
            val tail = drawPartOfTail(top,left)
            allTail.add(PartOfTail(ViewCoordinate(top,left),tail))
        }

        fun increaseDifficult(){
            if(gameSpeed <= MINIMUM_GAME_SPEED){
                return
            }
            if(allTail.size%3==0){
                gameSpeed-=50
            }
        }

        fun checkFood(){
            if(allTail.size >= 7 && allTail.size%7==0 && head.left==food_speed.left && head.top==food_speed.top){
                if(currentDicertion == Direction.UP || currentDicertion == Direction.Down) {
                    (point.layoutParams as FrameLayout.LayoutParams).topMargin = head.top
                    (point.layoutParams as FrameLayout.LayoutParams).leftMargin = head.left+50
                }
                if(currentDicertion == Direction.Right || currentDicertion == Direction.Left) {
                    (point.layoutParams as FrameLayout.LayoutParams).topMargin = head.top - 50
                    (point.layoutParams as FrameLayout.LayoutParams).leftMargin = head.left
                }
                container.removeView(points)
                container.removeView(point)
                container.addView(point)
                SoundManager.playAppleMusic()
                generateNewFood()
                addPartOfTail(head.top, head.left)
                addPartOfTail(head.top, head.left)
                increaseDifficult()
            }
            else if(head.left==food.left && head.top==food.top) {

                if(currentDicertion == Direction.UP || currentDicertion == Direction.Down) {
                    (points.layoutParams as FrameLayout.LayoutParams).topMargin = head.top
                    (points.layoutParams as FrameLayout.LayoutParams).leftMargin = head.left+50
                }
                if(currentDicertion == Direction.Right || currentDicertion == Direction.Left) {
                        (points.layoutParams as FrameLayout.LayoutParams).topMargin = head.top - 50
                        (points.layoutParams as FrameLayout.LayoutParams).leftMargin = head.left
                }
                container.removeView(point)
                container.removeView(points)
                container.addView(points)
               SoundManager.playAppleMusic()
                generateNewFood()
                addPartOfTail(head.top, head.left)
                increaseDifficult()
            }
        }

        fun makeTailMove() {
            editTextNumber.setText("${allTail.size}")
            var tempTailPart:PartOfTail?=null
            for(index in 0 until allTail.size){
                val tailPart = allTail[index]
                container.removeView(tailPart.imageView)
                if(index==0){
                    tempTailPart = tailPart
                    allTail[index] = PartOfTail(ViewCoordinate(head.top,head.left),drawPartOfTail(head.top,head.left))
                }else{
                    val anotherTempPartOfTail = allTail[index]
                    tempTailPart?.let {
                        allTail[index] = PartOfTail(it.viewCoordinate,drawPartOfTail(it.viewCoordinate.top,it.viewCoordinate.left))
                    }
                    tempTailPart = anotherTempPartOfTail
                }
            }
            container.removeView(points)
            container.removeView(point)
        }

        fun moveHeadAndRotate(direction: Direction,angle:Float,coordinates:Int){
            head.rotation = angle
            when(direction){
                Direction.UP,Direction.Down ->{(head.layoutParams as FrameLayout.LayoutParams).topMargin +=coordinates}
                Direction.Left, Direction.Right ->{(head.layoutParams as FrameLayout.LayoutParams).leftMargin +=coordinates}
            }
            currentDicertion = direction
        }

        fun checkSnakeSmash():Boolean{
                 for (tailPart in allTail) {
                     if (tailPart.viewCoordinate.left == head.left && tailPart.viewCoordinate.top == head.top) {
                         SoundManager.pauseGameMusic()
                         SoundManager.playOverMusic()
                         val editor = prefs.edit()
                         if(allTail.size>=prefs.getInt(FIRST_PLACE, 0)) {
                             editor.putInt(FIRST_PLACE, allTail.size).apply()
                         }
                         else if(allTail.size>=prefs.getInt(SECOND_PLACE, 0)) {
                             editor.putInt(SECOND_PLACE, allTail.size).apply()
                         }
                         else if(allTail.size>=prefs.getInt(THIRD_PLACE, 0)) {
                             editor.putInt(THIRD_PLACE, allTail.size).apply()
                         }
                         return true
                     }
                 }
            if(allTail.size<25) {
                if (head.top < 0) {
                    moveHeadAndRotate(Direction.UP, 90f, +HEAD_SIZE * CELLS_ON_FIELD + HEAD_SIZE)
                }
                if (head.top > HEAD_SIZE * CELLS_ON_FIELD) {
                    moveHeadAndRotate(
                        Direction.Down,
                        270f,
                        -HEAD_SIZE * CELLS_ON_FIELD - 2 * HEAD_SIZE
                    )
                }
                if (head.left < 0) {
                    moveHeadAndRotate(Direction.Left, 0f, +HEAD_SIZE * CELLS_ON_FIELD + HEAD_SIZE)
                }
                if (head.left > HEAD_SIZE * CELLS_ON_FIELD) {
                    moveHeadAndRotate(
                        Direction.Right,
                        180f,
                        -HEAD_SIZE * CELLS_ON_FIELD - 2 * HEAD_SIZE
                    )
                }
            }
            else{
                if (head.top < 0
                    || head.left < 0
                    || head.top >= HEAD_SIZE * CELLS_ON_FIELD
                    || head.left >= HEAD_SIZE * CELLS_ON_FIELD
                ) {
                    SoundManager.pauseGameMusic()
                    SoundManager.playOverMusic()
                    val editor = prefs.edit()
                    if(allTail.size>=prefs.getInt(FIRST_PLACE, 0)) {
                        editor.putInt(FIRST_PLACE, allTail.size).apply()
                    }
                    else if(allTail.size>=prefs.getInt(SECOND_PLACE, 0)) {
                        editor.putInt(SECOND_PLACE, allTail.size).apply()
                    }
                    else if(allTail.size>=prefs.getInt(THIRD_PLACE, 0)) {
                        editor.putInt(THIRD_PLACE, allTail.size).apply()
                    }
                    return true
                }
            }
            return false
        }

        fun showScore() {
            AlertDialog.Builder(this)
                .setTitle("Игра окончена")
                .setMessage("Результат: ${allTail.size} очков")
                .setPositiveButton("Начать заново") {_,_ -> this.recreate()}
                .setNeutralButton("Меню"){dialog, which ->
                    val intent = Intent(this, menu_game::class.java)
                    startActivity(intent)
                }
                .setCancelable(false)
                .create()
                .show()
        }

        fun move(direction: Direction){
            when(direction){
                Direction.UP -> moveHeadAndRotate(Direction.UP,90f,-HEAD_SIZE)
                Direction.Left -> moveHeadAndRotate(Direction.Left,0f,-HEAD_SIZE)
                Direction.Right -> moveHeadAndRotate(Direction.Right,180f,HEAD_SIZE)
                Direction.Down -> moveHeadAndRotate(Direction.Down,270f,HEAD_SIZE)
            }
            runOnUiThread{
                if(checkSnakeSmash()){
                    isPlay=false
                    showScore()
                    return@runOnUiThread
                }
                makeTailMove()
                checkFood()
                container.removeView(head)
                container.addView(head)
            }
        }

        fun checkCurrentDirection(properDirection: Direction, oppositeDirection: Direction){
            if(currentDicertion == oppositeDirection){
                move(currentDicertion)
            }else{
                move(properDirection)
            }
        }

        fun showPause() {
            AlertDialog.Builder(this)
                .setTitle("Пауза")
                .setMessage("Ваш результат: ${allTail.size} очков")
                .setPositiveButton("Продолжить"){dialog, which ->}
                .setNegativeButton("Начать заново"){dialog, which ->this.recreate()}
                .setNeutralButton("Меню"){dialog, which ->
                    val intent = Intent(this, menu_game::class.java)
                    startActivity(intent)
                }
                .create()
                .show()
        }

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        prefs = getSharedPreferences("settings", Context.MODE_PRIVATE)
        container.layoutParams = LinearLayout.LayoutParams(HEAD_SIZE* CELLS_ON_FIELD,HEAD_SIZE* CELLS_ON_FIELD)
        SoundManager.context = this
        SoundManager.NVolMusic()
        starTheGame()
        generateNewFood()
        SnakeCore.nextMove= {move(Direction.Down)}
        ivArrowUp.setOnClickListener{SnakeCore.nextMove= {checkCurrentDirection(Direction.UP,Direction.Down)} }
        ivArrowRight.setOnClickListener{SnakeCore.nextMove= {checkCurrentDirection(Direction.Right,Direction.Left)} }
        ivArrowLeft.setOnClickListener{SnakeCore.nextMove= {checkCurrentDirection(Direction.Left,Direction.Right)} }
        ivArrowDown.setOnClickListener{SnakeCore.nextMove= {checkCurrentDirection(Direction.Down,Direction.UP)} }
        isPlay=false
        ivPause.setImageResource(R.drawable.ic__play)
        SoundManager.pauseGameMusic()
        AlertDialog.Builder(this)
            .setTitle("Предупреждение")
            .setMessage("Можно пересекать границы")
            .setPositiveButton("Начать") {_,_ ->  isPlay=true
                ivPause.setImageResource(R.drawable.ic_pause)
                SoundManager.playGameMusic()
            }
            .setCancelable(true)
            .create()
            .show()

        ivPause.setOnClickListener{
            if(isPlay){
                showPause()
                ivPause.setImageResource(R.drawable.ic__play)
                SoundManager.pauseGameMusic()
            }else{
                ivPause.setImageResource(R.drawable.ic_pause)
                SoundManager.playGameMusic()
            }
            SnakeCore.isPlay=!isPlay
        }
    }

    fun onClickLeaderBoard(view: View) {
        val editor = prefs.edit()
        isPlay=false
        ivPause.setImageResource(R.drawable.ic__play)
        SoundManager.pauseGameMusic()
        AlertDialog.Builder(this)
            .setTitle("Рекорды")
            .setMessage("1 место: ${prefs.getInt(FIRST_PLACE, 0)} очков\n"+"2 место: ${prefs.getInt(SECOND_PLACE, 0)} очков\n"+"3 место: ${prefs.getInt(THIRD_PLACE, 0)} очков")
            .setPositiveButton("Продолжить") {_,_ -> 
            }
            .setNegativeButton("Очистить") {_,_ ->
                editor.putInt(FIRST_PLACE,0).apply()
                editor.putInt(SECOND_PLACE, 0).apply()
                editor.putInt(THIRD_PLACE, 0).apply()
            }
            .setCancelable(true)
            .create()
            .show()
    }

    fun onClickSound(view: View) {
        if(isPlaySound){
            SoundManager.NVolMusic()
            button2.setText("Звук вкл")
        }
        if(!isPlaySound){
            SoundManager.VolMusic()
            button2.setText("Звук выкл")
        }
        isPlaySound=!isPlaySound
    }
}

enum class Direction{
    UP,
Right,
Left,
Down
}