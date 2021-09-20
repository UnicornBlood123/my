var isDragging = false, isDraggingCircle = false, isDraggingSharnir = false, isDraggingYzlNagr = false, isDraggingRaspNagr = false, isDraggingConsol = false;
var isLine = false, isLine2 = false;
var isCircle = false, isCircle2 = false;
var isSharnir = false, isSharnir2 = false;
var isYzlNagr = false, isYzlNagr2 = false;
var isRaspNagr = false, isRaspNagr2 = false;
var isConsol = false, isConsol2 = false;
var lX, lY, rX, rY, zoom = 1;
var x1, y1;
var proverkaSharnir = 0;
var proverkaYzlNagr = 0;
var proverkaRaspNagr = 0;
var proverkaConsol = 0;
var proverkaLine = 0;
var previousSelected;
var lines = [];
var circles = [];
var sharnirs = [];
var yzlNagrs = [];
var raspNagrs = [];
var consols = [];

function Line(x1, y1, x2, y2, l, h) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y1;
  this.l = l;
  this.h = h;
  this.isSelected = false;
}

function Circle(x, y) {
  this.x = x;
  this.y = y;
  this.isSelected = false;
}

function Sharnir(x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x1;
  this.y2 = y2;
  this.isSelected = false;
}

function YzlNagr(x1, y1, x2, y2, nagr) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x1;
  this.y2 = y2;
  this.nagr = nagr;
  this.isSelected = false;
}

function RaspNagr(x1, y1, x2, y2, nagr) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y1;
  this.nagr = nagr;
  this.isSelected = false;
}

function Consol(x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x1;
  this.y2 = y2;
  this.isSelected = false;
}

class canvasView {
  constructor(canvas, source) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.image = source;
    this.canvas.oncontextmenu = function (e) { e.preventDefault(); e.stopPropagation(); return false; }
    this.isMove = false;
    this.x1 = 0;
    this.y1 = 0;
    this.w1 = this.image.width;
    this.h1 = this.image.height;
    this.mouseX;
    this.mouseY;
    this.canvas.addEventListener('mouseover', this.mouseuplistener.bind(this));
    this.canvas.addEventListener('mousedown', this.mousedownlistener.bind(this));
    this.canvas.addEventListener('mousemove', this.mousemovelistener.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseuplistener.bind(this));
    this.canvas.addEventListener('wheel', this.wheellistener.bind(this), { passive: true });
    this.x1 = -(this.image.width - this.canvas.width) / 2;
    this.y1 = -(this.image.height - this.canvas.height) / 2;
    this.draw();
  }

  mousedownlistener(event) {
    if (event.which != 3) {
      proverkaLine = 0;
      proverkaConsol = 0;
      proverkaSharnir = 0;
      proverkaYzlNagr = 0;
      proverkaRaspNagr = 0;
      this.mouse(event);
      this.oldx = this.mouseX;
      this.oldy = this.mouseY;
      this.isMove = true;
      var xLeft = (this.oldx - lX) / zoom;
      var yLeft = (this.oldy - lY) / zoom;
      x1 = xLeft;
      y1 = yLeft;
      if (isLine2 == true) {
        this.isMove = false;
        isLine = true;
        for (var i = lines.length - 1; i >= 0; i--) {
          var line = lines[i];
          if (((xLeft >= line.x1 && xLeft <= line.x2) && (yLeft >= line.y1 - line.h * 100 / 2 && yLeft <= line.y2 + line.h * 100 / 2)) || ((xLeft <= line.x1 && xLeft >= line.x2) && (yLeft <= line.y1 + line.h * 100 / 2 && yLeft >= line.y2 - line.h * 100 / 2))) {
            if (previousSelected != null) previousSelected.isSelected = false;
            previousSelected = line;
            line.isSelected = true;
            document.getElementById("inLine").value = previousSelected.h.toFixed(2);
            document.getElementById("inLineL").value = previousSelected.l.toFixed(2);
            this.draw();
            isDragging = true;
            return;
          }
          else {
            if (previousSelected != null) previousSelected.isSelected = false;
            line.isSelected = false;
            previousSelected = null;
            this.draw();
            isDragging = false;
          }
        }
      }
      if (isConsol2 == true) {
        this.isMove = false;
        isConsol = true;
        if (lines.length < 1) alert("Добавьте стержень.");
        for (var i = consols.length - 1; i >= 0; i--) {
          var consol = consols[i];
          var h = document.getElementById("inConsol").value * 50;
          var halfLen;
          if ((consol.y1 > consol.y2) || (k == 0 && consol.x2 > consol.x1)) {
            halfLen = Math.sqrt(Math.pow(consol.y2 - consol.y1, 2)) / 2;
          }
          else {
            halfLen = -Math.sqrt(Math.pow(consol.y2 - consol.y1, 2)) / 2;
          }
          if (((xLeft >= consol.x1 - h && xLeft <= consol.x2 + h) && (yLeft >= consol.y1 + halfLen && yLeft <= consol.y2 + halfLen)) || ((xLeft <= consol.x1 + h && xLeft >= consol.x2 - h) && (yLeft <= consol.y1 + halfLen && yLeft >= consol.y2 + halfLen))) {
            if (previousSelected != null) previousSelected.isSelected = false;
            previousSelected = consol;
            consol.isSelected = true;
            this.draw();
            isDraggingConsol = true;
            return;
          }
          else {
            if (previousSelected != null) previousSelected.isSelected = false;
            consol.isSelected = false;
            previousSelected = null;
            this.draw();
            isDraggingConsol = false;
          }
        }
      }
      if (isYzlNagr2 == true) {
        this.isMove = false;
        isYzlNagr = true;
        if (lines.length < 1) alert("Добавьте стержень.");
        for (var i = yzlNagrs.length - 1; i >= 0; i--) {
          var yzlNagr = yzlNagrs[i];
          var h = document.getElementById("inHYzlNagr").value * 50;
          var k = Math.atan((yzlNagr.y2 - yzlNagr.y1) / (yzlNagr.x2 - yzlNagr.x1));
          var up;
          if (k > 0) {
            up = -(document.getElementById("inHYzlNagr").value * 100 + document.getElementById("inLine").value * 50);
          }
          else {
            up = (document.getElementById("inHYzlNagr").value * 100 + document.getElementById("inLine").value * 50);
          }
          if (((xLeft >= yzlNagr.x1 - h && xLeft <= yzlNagr.x2 + h) && (yLeft >= yzlNagr.y1 + up && yLeft <= yzlNagr.y2 + up)) || ((xLeft <= yzlNagr.x1 + h && xLeft >= yzlNagr.x2 - h) && (yLeft <= yzlNagr.y1 + up && yLeft >= yzlNagr.y2 + up))) {
            if (previousSelected != null) previousSelected.isSelected = false;
            previousSelected = yzlNagr;
            yzlNagr.isSelected = true;
            document.getElementById("inYzlNagr").value = previousSelected.nagr;
            this.draw();
            isDraggingYzlNagr = true;
            return;
          }
          else {
            if (previousSelected != null) previousSelected.isSelected = false;
            yzlNagr.isSelected = false;
            previousSelected = null;
            this.draw();
            isDraggingYzlNagr = false;
          }
        }
      }
      if (isRaspNagr2 == true) {
        this.isMove = false;
        isRaspNagr = true;
        if (lines.length < 1) alert("Добавьте стержень.");
        for (var i = raspNagrs.length - 1; i >= 0; i--) {
          var raspNagr = raspNagrs[i];
          var h = document.getElementById("inHRaspNagr").value * 50;
          var up;
          if (raspNagr.x2 > raspNagr.x1) {
            up = -(6 * document.getElementById("inHRaspNagr").value * 100 + document.getElementById("inLine").value * 50);
          }
          else {
            up = 6 * document.getElementById("inHRaspNagr").value * 100 + document.getElementById("inLine").value * 50;
          }
          if (((xLeft >= raspNagr.x1 && xLeft <= raspNagr.x2) && (yLeft >= raspNagr.y1 - h + up && yLeft <= raspNagr.y2 + h + up)) || ((xLeft <= raspNagr.x1 && xLeft >= raspNagr.x2) && (yLeft <= raspNagr.y1 + h + up && yLeft >= raspNagr.y2 - h + up))) {
            if (previousSelected != null) previousSelected.isSelected = false;
            previousSelected = raspNagr;
            raspNagr.isSelected = true;
            document.getElementById("inRaspNagr").value = previousSelected.nagr;
            this.draw();
            isDraggingRaspNagr = true;
            return;
          }
          else {
            if (previousSelected != null) previousSelected.isSelected = false;
            raspNagr.isSelected = false;
            previousSelected = null;
            isDraggingRaspNagr = false;
            this.draw();
          }
        }
      }
      if (isSharnir2 == true) {
        this.isMove = false;
        isSharnir = true;
        if (lines.length < 1) alert("Добавьте стержень.");
        for (var i = sharnirs.length - 1; i >= 0; i--) {
          var sharnir = sharnirs[i];
          var h = document.getElementById("inHSharnir").value * 50;
          var distanceCircle1 = Math.sqrt(Math.pow(sharnir.x1 - xLeft, 2) + Math.pow(sharnir.y1 - yLeft, 2));
          var distanceCircle2 = Math.sqrt(Math.pow(sharnir.x2 - xLeft, 2) + Math.pow(sharnir.y2 - yLeft, 2));
          if ((((xLeft >= sharnir.x1 - h && xLeft <= sharnir.x2 + h) && (yLeft >= sharnir.y1 && yLeft <= sharnir.y2)) || ((xLeft <= sharnir.x1 + h && xLeft >= sharnir.x2 - h) && (yLeft <= sharnir.y1 && yLeft >= sharnir.y2))) || (distanceCircle1 <= document.getElementById("inLine").value * 50) || (distanceCircle2 <= document.getElementById("inLine").value * 50)) {
            if (previousSelected != null) previousSelected.isSelected = false;
            previousSelected = sharnir;
            sharnir.isSelected = true;
            this.draw();
            isDraggingSharnir = true;
            return;
          }
          else {
            if (previousSelected != null) previousSelected.isSelected = false;
            sharnir.isSelected = false;
            previousSelected = null;
            isDraggingSharnir = false;
            this.draw();
          }
        }
      }
      if (isCircle2 == true) {
        this.isMove = false;
        isCircle = true;
        if (lines.length < 1) alert("Добавьте стержень.");
        for (var i = circles.length - 1; i >= 0; i--) {
          var circle = circles[i];
          this.draw();
          var distanceFromCenter = Math.sqrt(Math.pow(circle.x - xLeft, 2) + Math.pow(circle.y - yLeft, 2));
          if (distanceFromCenter <= document.getElementById("inCircle").value) {
            if (previousSelected != null) previousSelected.isSelected = false;
            previousSelected = circle;
            circle.isSelected = true;
            this.draw();
            isDraggingCircle = true;
            return;
          }
          else {
            if (previousSelected != null) previousSelected.isSelected = false;
            circle.isSelected = false;
            previousSelected = null;
            isDraggingCircle = false;
            this.draw();
          }
        }
        var radius = document.getElementById("inCircle").value;
        if (lines.length > 0) {
          var perem1 = Math.sqrt(Math.pow((lines[lines.length - 1].x1 - xLeft), 2) + Math.pow((lines[lines.length - 1].y1 - yLeft), 2))
          var perem2 = Math.sqrt(Math.pow((lines[lines.length - 1].x2 - xLeft), 2) + Math.pow((lines[lines.length - 1].y2 - yLeft), 2));
          var dist;
          var xNew, yNew;
          if (perem1 < perem2) {
            dist = perem1;
            xNew = lines[lines.length - 1].x1;
            yNew = lines[lines.length - 1].y1;
          }
          else {
            dist = perem2;
            xNew = lines[lines.length - 1].x2;
            yNew = lines[lines.length - 1].y2;
          }
          for (var i = lines.length - 1; i >= 0; i--) {
            perem1 = Math.sqrt(Math.pow((lines[i].x1 - xLeft), 2) + Math.pow((lines[i].y1 - yLeft), 2));
            perem2 = Math.sqrt(Math.pow((lines[i].x2 - xLeft), 2) + Math.pow((lines[i].y2 - yLeft), 2));
            if (perem1 < dist || perem2 < dist) {
              if (perem1 < perem2) {
                dist = perem1;
                xNew = lines[i].x1;
                yNew = lines[i].y1;
              }
              else {
                dist = perem2;
                xNew = lines[i].x2;
                yNew = lines[i].y2;
              }
            }
          }
          var circle = new Circle(xLeft, yLeft, radius);
          previousSelected = circle;
          circle.isSelected = true;
          isDraggingCircle = true;
          this.draw();
          circles.push(circle);
          for (var m = 0; m < circles.length; m++) {
            for (var i = m + 1; i < circles.length; i++) {
              if (circles[m].x == circles[i].x) {
                for (var k = i; k < circles.length - 1; k++) {
                  circles[k] = circles[k + 1];
                }
                circles.length--;
              }
            }
          }
        }
      }
    }
  }
  forLineMove() {
    var dx = (this.mouseX - this.oldx) / zoom;
    var dy = (this.mouseY - this.oldy) / zoom;
    previousSelected.x1 += dx;
    previousSelected.y1 += dy;
    previousSelected.x2 += dx;
    previousSelected.y2 += dy;
    for (var i = lines.length - 1; i >= 0; i--) {
      if (lines[i].isSelected == false) {
        lines[i].x1 += dx;
        lines[i].y1 += dy;
        lines[i].x2 += dx;
        lines[i].y2 += dy;
      }
    }
    for (var i = consols.length - 1; i >= 0; i--) {
      consols[i].x1 += dx;
      consols[i].y1 += dy;
      consols[i].x2 += dx;
      consols[i].y2 += dy;
    }
    for (var i = circles.length - 1; i >= 0; i--) {
      circles[i].x += dx;
      circles[i].y += dy;
    }
    for (var i = sharnirs.length - 1; i >= 0; i--) {
      sharnirs[i].x1 += dx;
      sharnirs[i].y1 += dy;
      sharnirs[i].x2 += dx;
      sharnirs[i].y2 += dy;
    }
    for (var i = yzlNagrs.length - 1; i >= 0; i--) {
      yzlNagrs[i].x1 += dx;
      yzlNagrs[i].y1 += dy;
      yzlNagrs[i].x2 += dx;
      yzlNagrs[i].y2 += dy;
    }
    for (var i = raspNagrs.length - 1; i >= 0; i--) {
      raspNagrs[i].x1 += dx;
      raspNagrs[i].y1 += dy;
      raspNagrs[i].x2 += dx;
      raspNagrs[i].y2 += dy;
    }
    this.draw();
    this.oldx = this.mouseX;
    this.oldy = this.mouseY;
  }

  forLikeLineMove() {
    var dx = (this.mouseX - this.oldx) / zoom;
    var dy = (this.mouseY - this.oldy) / zoom;
    previousSelected.x1 += dx;
    previousSelected.y1 += dy;
    previousSelected.x2 += dx;
    previousSelected.y2 += dy;
    this.draw();
    this.oldx = this.mouseX;
    this.oldy = this.mouseY;
  }

  forCircleMove() {
    var dx = (this.mouseX - this.oldx) / zoom;
    var dy = (this.mouseY - this.oldy) / zoom;
    previousSelected.x += dx;
    previousSelected.y += dy;
    this.draw();
    this.oldx = this.mouseX;
    this.oldy = this.mouseY;
  }

  forMouseMove() {
    var dx = this.mouseX - this.oldx;
    this.x1 += dx;
    var dy = this.mouseY - this.oldy;
    this.y1 += dy;
    this.draw();
    this.oldx = this.mouseX;
    this.oldy = this.mouseY;
  }

  mousemovelistener(event) {
    if (event.which != 3) {
      this.mouse(event);
      var xLeft = (this.oldx - lX) / zoom;
      var yLeft = (this.oldy - lY) / zoom;
      if (isDragging == true) {
        if (previousSelected != null) {
          this.forLineMove();
        }
      }
      else if (isDraggingConsol == true) {
        if (previousSelected != null) {
          this.forLikeLineMove();
        }
      }
      else if (isDraggingSharnir == true) {
        if (previousSelected != null) {
          this.forLikeLineMove();
        }
      }
      else if (isDraggingYzlNagr == true) {
        if (previousSelected != null) {
          this.forLikeLineMove();
        }
      }
      else if (isDraggingRaspNagr == true) {
        if (previousSelected != null) {
          this.forLikeLineMove();
        }
      }
      else if (isDraggingCircle == true) {
        if (previousSelected != null) {
          this.forCircleMove();
        }
      }
      else if (this.isMove) {
        this.forMouseMove();
      }
      else if (isLine) {
        var line, len, het, xNew, yNew;
        if (lines.length > 0 && proverkaLine > 0) lines.pop();
        if (lines.length > 0) {
          xNew = lines[lines.length - 1].x2;
          yNew = lines[lines.length - 1].y2;
        }
        var dx = (this.mouseX - this.oldx) / zoom;
        var dy = (this.mouseY - this.oldy) / zoom;
        if (lines.length == 0 && dx >= 0 || lines.length > 0 && xLeft >= xNew) {
          xLeft += dx;
          yLeft += dy;
        }
        het = document.getElementById("inLine").value * 100 / 100;
        len = Math.sqrt(Math.pow(x1 - xLeft, 2)) / 100;
        document.getElementById("inLineL").value = len;
        if (lines.length > 0 && xLeft >= xNew) {
          len = Math.sqrt(Math.pow(xNew - xLeft, 2)) / 100;
          line = new Line(xNew, yNew, xLeft, yLeft, len, het);
        }
        else {
          line = new Line(x1, y1, xLeft, yLeft, len, het);
        }
        if (lines.length == 0 && dx >= 0 || lines.length > 0 && xLeft >= xNew) {
          document.getElementById("inLineL").value = len;
          lines.push(line);
          previousSelected = line;
          line.isSelected = true;
          this.draw();
          proverkaLine++;
        }
        else {
          document.getElementById("inLineL").value = 0;
          proverkaLine = 0;
        }
      }
      else if (isConsol) {
        if (consols.length > 0 && proverkaConsol > 0) consols.pop();
        var dx = (this.mouseX - this.oldx) / zoom;
        var dy = (this.mouseY - this.oldy) / zoom;
        var consol = new Consol(x1, y1, xLeft += dx, yLeft += dy);
        consols.push(consol);
        previousSelected = consol;
        consol.isSelected = true;
        this.draw();
        proverkaConsol++;

      }
      else if (isSharnir) {
        if (sharnirs.length > 0 && proverkaSharnir > 0) sharnirs.pop();
        var dx = (this.mouseX - this.oldx) / zoom;
        var dy = (this.mouseY - this.oldy) / zoom;
        var sharnir = new Sharnir(x1, y1, xLeft += dx, yLeft += dy);
        sharnirs.push(sharnir);
        previousSelected = sharnir;
        sharnir.isSelected = true;
        this.draw();
        proverkaSharnir++;
      }
      else if (isYzlNagr) {
        var n = document.getElementById("inYzlNagr").value;
        if (yzlNagrs.length > 0 && proverkaYzlNagr > 0) yzlNagrs.pop();
        var dx = (this.mouseX - this.oldx) / zoom;
        var dy = (this.mouseY - this.oldy) / zoom;
        var yzlNagr = new YzlNagr(x1, y1, xLeft += dx, yLeft += dy, n);
        yzlNagrs.push(yzlNagr);
        previousSelected = yzlNagr;
        yzlNagr.isSelected = true;
        this.draw();
        proverkaYzlNagr++;
      }
      else if (isRaspNagr) {
        var n = document.getElementById("inRaspNagr").value;
        if (raspNagrs.length > 0 && proverkaRaspNagr > 0) raspNagrs.pop();
        var dx = (this.mouseX - this.oldx) / zoom;
        var dy = (this.mouseY - this.oldy) / zoom;
        var raspNagr = new RaspNagr(x1, y1, xLeft += dx, yLeft += dy, n);
        raspNagrs.push(raspNagr);
        previousSelected = raspNagr;
        raspNagr.isSelected = true;
        this.draw();
        proverkaRaspNagr++;
      }
      else if (isCircle) {
        if (circles.length > 0) circles.pop();
        var circle = new Circle(xLeft, yLeft, document.getElementById("inCircle").value);
        circles.push(circle);
        this.draw();
      }
    }
  }

  binddingCircle() {
    this.mouse(event);
    var xLeft = (this.oldx - lX) / zoom;
    var yLeft = (this.oldy - lY) / zoom;
    if (lines.length > 0 || circles.length > 0) {
      var perem1 = Math.sqrt(Math.pow((lines[lines.length - 1].x1 - previousSelected.x), 2) + Math.pow((lines[lines.length - 1].y1 - previousSelected.y), 2));
      var perem2 = Math.sqrt(Math.pow((lines[lines.length - 1].x2 - previousSelected.x), 2) + Math.pow((lines[lines.length - 1].y2 - previousSelected.y), 2));
      var dist;
      var xNew, yNew;
      if (perem1 < perem2) {
        dist = perem1;
        xNew = lines[lines.length - 1].x1;
        yNew = lines[lines.length - 1].y1;
      }
      else {
        dist = perem2;
        xNew = lines[lines.length - 1].x2;
        yNew = lines[lines.length - 1].y2;
      }
      for (var i = lines.length - 1; i >= 0; i--) {
        perem1 = Math.sqrt(Math.pow((lines[i].x1 - previousSelected.x), 2) + Math.pow((lines[i].y1 - previousSelected.y), 2));
        perem2 = Math.sqrt(Math.pow((lines[i].x2 - previousSelected.x), 2) + Math.pow((lines[i].y2 - previousSelected.y), 2));
        if (perem1 < dist || perem2 < dist) {
          if (perem1 < perem2) {
            dist = perem1;
            xNew = lines[i].x1;
            yNew = lines[i].y1;
          }
          else {
            dist = perem2;
            xNew = lines[i].x2;
            yNew = lines[i].y2;
          }
        }
      }
      previousSelected.x = xNew;
      previousSelected.y = yNew;
      this.draw();
    }
    else {
      previousSelected.x = xLeft;
      previousSelected.y = yLeft;
      this.draw();
    }
  }
  binddingSharnirConsol() {
    this.mouse(event);
    if (lines.length > 0 && sharnirs.length > 0 && previousSelected != null || lines.length > 0 && consols.length > 0 && previousSelected != null) {
      var perem1 = Math.sqrt(Math.pow((lines[lines.length - 1].x1 - previousSelected.x1), 2) + Math.pow((lines[lines.length - 1].y1 - previousSelected.y1), 2));
      var perem2 = Math.sqrt(Math.pow((lines[lines.length - 1].x2 - previousSelected.x1), 2) + Math.pow((lines[lines.length - 1].y2 - previousSelected.y1), 2));
      var dist;
      var xNew, yNew;
      if (perem1 < perem2) {
        dist = perem1;
        xNew = lines[lines.length - 1].x1;
        yNew = lines[lines.length - 1].y1;
      }
      else {
        dist = perem2;
        xNew = lines[lines.length - 1].x2;
        yNew = lines[lines.length - 1].y2;
      }
      for (var i = lines.length - 1; i >= 0; i--) {
        perem1 = Math.sqrt(Math.pow((lines[i].x1 - previousSelected.x1), 2) + Math.pow((lines[i].y1 - previousSelected.y1), 2));
        perem2 = Math.sqrt(Math.pow((lines[i].x2 - previousSelected.x1), 2) + Math.pow((lines[i].y2 - previousSelected.y1), 2));
        if (perem1 < dist || perem2 < dist) {
          if (perem1 < perem2) {
            dist = perem1;
            xNew = lines[i].x1;
            yNew = lines[i].y1;
          }
          else {
            dist = perem2;
            xNew = lines[i].x2;
            yNew = lines[i].y2;
          }
        }
      }
      var moveX, moveY;
      moveX = xNew - previousSelected.x1;
      moveY = yNew - previousSelected.y1;
      previousSelected.x1 = xNew;
      previousSelected.y1 = yNew;
      previousSelected.x2 += moveX;
      previousSelected.y2 += moveY;
      this.draw();
    }
  }

  binddingYzlNagr() {
    this.mouse(event);
    if (lines.length > 0 && yzlNagrs.length > 0 && previousSelected != null) {
      var perem1 = Math.sqrt(Math.pow((lines[lines.length - 1].x1 - previousSelected.x1), 2) + Math.pow((lines[lines.length - 1].y1 - previousSelected.y1), 2));
      var perem2 = Math.sqrt(Math.pow((lines[lines.length - 1].x2 - previousSelected.x1), 2) + Math.pow((lines[lines.length - 1].y2 - previousSelected.y1), 2));
      var dist;
      var xNew, yNew;
      if (perem1 < perem2) {
        dist = perem1;
        xNew = lines[lines.length - 1].x1;
        yNew = lines[lines.length - 1].y1;
      }
      else {
        dist = perem2;
        xNew = lines[lines.length - 1].x2;
        yNew = lines[lines.length - 1].y2;
      }
      for (var i = lines.length - 1; i >= 0; i--) {
        perem1 = Math.sqrt(Math.pow((lines[i].x1 - previousSelected.x1), 2) + Math.pow((lines[i].y1 - previousSelected.y1), 2));
        perem2 = Math.sqrt(Math.pow((lines[i].x2 - previousSelected.x1), 2) + Math.pow((lines[i].y2 - previousSelected.y1), 2));
        if (perem1 < dist || perem2 < dist) {
          if (perem1 < perem2) {
            dist = perem1;
            xNew = lines[i].x1;
            yNew = lines[i].y1;
          }
          else {
            dist = perem2;
            xNew = lines[i].x2;
            yNew = lines[i].y2;
          }
        }
      }
      var moveX, moveY;
      moveX = xNew - previousSelected.x2;
      moveY = yNew - previousSelected.y2;
      previousSelected.x2 = xNew;
      previousSelected.y2 = yNew;
      previousSelected.x1 += moveX;
      previousSelected.y1 += moveY;
      this.draw();
    }
  }

  binddingRaspNagr() {
    this.mouse(event);
    if (lines.length > 0 && raspNagrs.length > 0 && previousSelected != null) {
      var perem1 = Math.sqrt(Math.pow((lines[lines.length - 1].x1 - previousSelected.x1), 2) + Math.pow((lines[lines.length - 1].y1 - previousSelected.y1), 2));
      var perem2 = Math.sqrt(Math.pow((lines[lines.length - 1].x1 - previousSelected.x2), 2) + Math.pow((lines[lines.length - 1].y1 - previousSelected.y2), 2));
      var dist;
      var xNew, yNew, xNew2, yNew2;
      if (previousSelected.x2 > previousSelected.x1) {
        dist = perem1;
        xNew = lines[lines.length - 1].x1;
        yNew = lines[lines.length - 1].y1;
        xNew2 = lines[lines.length - 1].x2;
        yNew2 = lines[lines.length - 1].y2;
      }
      else {
        dist = perem2;
        xNew2 = lines[lines.length - 1].x1;
        yNew2 = lines[lines.length - 1].y1;
        xNew = lines[lines.length - 1].x2;
        yNew = lines[lines.length - 1].y2;
      }
      for (var i = lines.length - 1; i >= 0; i--) {
        perem1 = Math.sqrt(Math.pow((lines[i].x1 - previousSelected.x1), 2) + Math.pow((lines[i].y1 - previousSelected.y1), 2));
        perem2 = Math.sqrt(Math.pow((lines[i].x1 - previousSelected.x2), 2) + Math.pow((lines[i].y1 - previousSelected.y2), 2));
        if (perem1 < dist || perem2 < dist) {
          if (previousSelected.x2 > previousSelected.x1) {
            dist = perem1;
            xNew = lines[i].x1;
            yNew = lines[i].y1;
            xNew2 = lines[i].x2;
            yNew2 = lines[i].y2;
          }
          else {
            dist = perem2;
            xNew2 = lines[i].x1;
            yNew2 = lines[i].y1;
            xNew = lines[i].x2;
            yNew = lines[i].y2;
          }
        }
      }
      previousSelected.x1 = xNew;
      previousSelected.y1 = yNew;
      previousSelected.x2 = xNew2;
      previousSelected.y2 = yNew2;
      this.draw();
    }
  }

  mouseuplistener(event) {
    if (event.which != 3) {
      this.mouse(event);
      if (isYzlNagr == true) {
        isYzlNagr = false;
        this.binddingYzlNagr();
        for (var m = 0; m < yzlNagrs.length; m++) {
          for (var i = m + 1; i < yzlNagrs.length; i++) {
            if (yzlNagrs[m].x1 == yzlNagrs[i].x1) {
              for (var k = i; k < yzlNagrs.length - 1; k++) {
                yzlNagrs[k] = yzlNagrs[k + 1];
              }
              yzlNagrs.length--;
            }
          }
        }
        for (var m = 0; m < yzlNagrs.length; m++) {
          for (var i = 0; i < raspNagrs.length; i++) {
            if (yzlNagrs[m].x1 == raspNagrs[i].x1 || yzlNagrs[m].x1 == raspNagrs[i].x2) {
              raspNagrs.splice(i, 1);
              i--;
            }
          }
        }
        this.draw();
      }
      if (isRaspNagr == true) {
        isRaspNagr = false;
        this.binddingRaspNagr();
        for (var m = 0; m < raspNagrs.length; m++) {
          for (var i = m + 1; i < raspNagrs.length; i++) {
            if (raspNagrs[m].x1 == raspNagrs[i].x1 && raspNagrs[m].x2 == raspNagrs[i].x2 || raspNagrs[m].x1 == raspNagrs[i].x2 && raspNagrs[m].x2 == raspNagrs[i].x1) {
              for (var k = i; k < raspNagrs.length - 1; k++) {
                raspNagrs[k] = raspNagrs[k + 1];
              }
              raspNagrs.length--;
            }
          }
        }
        for (var m = 0; m < raspNagrs.length; m++) {
          for (var i = 0; i < yzlNagrs.length; i++) {
            if (raspNagrs[m].x1 == yzlNagrs[i].x1 || raspNagrs[m].x2 == yzlNagrs[i].x1) {
              yzlNagrs.splice(i, 1);
              i--;
            }
          }
        }
        this.draw();
      }
      if (isLine == true) {
        isLine = false;
        this.draw();
      }
      if (isSharnir == true) {
        isSharnir = false;
        this.binddingSharnirConsol();
        for (var m = 0; m < sharnirs.length; m++) {
          for (var i = m + 1; i < sharnirs.length; i++) {
            if (sharnirs[m].x1 == sharnirs[i].x1) {
              for (var k = i; k < sharnirs.length - 1; k++) {
                sharnirs[k] = sharnirs[k + 1];
              }
              sharnirs.length--;
            }
          }
        }
        for (var m = 0; m < sharnirs.length; m++) {
          for (var i = 0; i < circles.length; i++) {
            if (sharnirs[m].x1 == circles[i].x) {
              circles.splice(i, 1);
            }
          }
        }
        for (var m = 0; m < sharnirs.length; m++) {
          for (var i = 0; i < consols.length; i++) {
            if (sharnirs[m].x1 == consols[i].x1) {
              consols.splice(i, 1);
            }
          }
        }
        this.draw();
      }
      isCircle = false;
      if (isConsol == true) {
        isConsol = false;
        this.binddingSharnirConsol();
        for (var m = 0; m < consols.length; m++) {
          for (var i = m + 1; i < consols.length; i++) {
            if (consols[m].x1 == consols[i].x1) {
              for (var k = i; k < consols.length - 1; k++) {
                consols[k] = consols[k + 1];
              }
              consols.length--;
            }
          }
        }
        for (var m = 0; m < consols.length; m++) {
          for (var i = 0; i < circles.length; i++) {
            if (consols[m].x1 == circles[i].x) {
              circles.splice(i, 1);
            }
          }
        }
        for (var m = 0; m < consols.length; m++) {
          for (var i = 0; i < sharnirs.length; i++) {
            if (consols[m].x1 == sharnirs[i].x1) {
              sharnirs.splice(i, 1);
            }
          }
        }
        this.draw();
      }
      isDragging = false;
      if (isDraggingConsol == true) {
        isDraggingConsol = false;
        this.binddingSharnirConsol();
        for (var m = 0; m < consols.length; m++) {
          for (var i = m + 1; i < consols.length; i++) {
            if (consols[m].x1 == consols[i].x1) {
              for (var k = i; k < consols.length - 1; k++) {
                consols[k] = consols[k + 1];
              }
              consols.length--;
            }
          }
        }
        for (var m = 0; m < consols.length; m++) {
          for (var i = 0; i < circles.length; i++) {
            if (consols[m].x1 == circles[i].x) {
              circles.splice(i, 1);
            }
          }
        }
        for (var m = 0; m < consols.length; m++) {
          for (var i = 0; i < sharnirs.length; i++) {
            if (consols[m].x1 == sharnirs[i].x1) {
              sharnirs.splice(i, 1);
            }
          }
        }
        this.draw();
      }
      if (isDraggingCircle == true) {
        this.binddingCircle();
        for (var m = 0; m < circles.length; m++) {
          for (var i = m + 1; i < circles.length; i++) {
            if (circles[m].x == circles[i].x) {
              for (var k = i; k < circles.length - 1; k++) {
                circles[k] = circles[k + 1];
              }
              circles.length--;
            }
          }
        }
        for (var m = 0; m < circles.length; m++) {
          for (var i = 0; i < consols.length; i++) {
            if (circles[m].x == consols[i].x1) {
              consols.splice(i, 1);
            }
          }
        }
        for (var m = 0; m < circles.length; m++) {
          for (var i = 0; i < sharnirs.length; i++) {
            if (circles[m].x == sharnirs[i].x1) {
              sharnirs.splice(i, 1);
            }
          }
        }
        this.draw();
        isDraggingCircle = false;
      }
      if (isDraggingYzlNagr == true) {
        this.binddingYzlNagr();
        for (var m = 0; m < yzlNagrs.length; m++) {
          for (var i = m + 1; i < yzlNagrs.length; i++) {
            if (yzlNagrs[m].x1 == yzlNagrs[i].x1) {
              for (var k = i; k < yzlNagrs.length - 1; k++) {
                yzlNagrs[k] = yzlNagrs[k + 1];
              }
              yzlNagrs.length--;
            }
          }
        }
        for (var m = 0; m < yzlNagrs.length; m++) {
          for (var i = 0; i < raspNagrs.length; i++) {
            if (yzlNagrs[m].x1 == raspNagrs[i].x1 || yzlNagrs[m].x1 == raspNagrs[i].x2) {
              raspNagrs.splice(i, 1);
              i--;
            }
          }
        }
        this.draw();
        isDraggingYzlNagr = false;
      }
      if (isDraggingRaspNagr == true) {
        isDraggingRaspNagr = false;
        this.binddingRaspNagr();
        for (var m = 0; m < raspNagrs.length; m++) {
          for (var i = m + 1; i < raspNagrs.length; i++) {
            if (raspNagrs[m].x1 == raspNagrs[i].x1) {
              for (var k = i; k < raspNagrs.length - 1; k++) {
                raspNagrs[k] = raspNagrs[k + 1];
              }
              raspNagrs.length--;
            }
          }
        }
        for (var m = 0; m < raspNagrs.length; m++) {
          for (var i = 0; i < yzlNagrs.length; i++) {
            if (raspNagrs[m].x1 == yzlNagrs[i].x1 || raspNagrs[m].x2 == yzlNagrs[i].x1) {
              yzlNagrs.splice(i, 1);
              i--;
            }
          }
        }
        this.draw();
      }
      if (isDraggingSharnir == true) {
        this.binddingSharnirConsol();
        for (var m = 0; m < sharnirs.length; m++) {
          for (var i = m + 1; i < sharnirs.length; i++) {
            if (sharnirs[m].x1 == sharnirs[i].x1) {
              for (var k = i; k < sharnirs.length - 1; k++) {
                sharnirs[k] = sharnirs[k + 1];
              }
              sharnirs.length--;
            }
          }
        }
        for (var m = 0; m < sharnirs.length; m++) {
          for (var i = 0; i < circles.length; i++) {
            if (sharnirs[m].x1 == circles[i].x) {
              circles.splice(i, 1);
            }
          }
        }
        for (var m = 0; m < sharnirs.length; m++) {
          for (var i = 0; i < consols.length; i++) {
            if (sharnirs[m].x1 == consols[i].x1 || sharnirs[m].x1 == consols[i].x2) {
              consols.splice(i, 1);
            }
          }
        }
        this.draw();
        isDraggingSharnir = false;
      }
      this.isMove = false;
    }
  }

  wheellistener(e) {
    this.mouse(e);
    if (!this.isMove) {
      var delta = e.deltaY || e.detail || e.wheelDelta;
      if (delta < 0) {
        this.x1 = this.mouseX - (this.mouseX - this.x1) * 1.2;
        this.y1 = this.mouseY - (this.mouseY - this.y1) * 1.2;
        this.w1 *= 1.2;
        this.h1 *= 1.2;
        zoom *= 1.2;
        this.draw();
      }
      else {
        this.x1 = this.mouseX - (this.mouseX - this.x1) / 1.2;
        this.y1 = this.mouseY - (this.mouseY - this.y1) / 1.2;
        this.w1 /= 1.2;
        this.h1 /= 1.2;
        zoom /= 1.2;
        this.draw();
      }
    }
  }

  mouse(e) {
    var boundings = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - boundings.left;
    this.mouseY = e.clientY - boundings.top;
  }

  drawLines() {
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      ctx.beginPath();
      ctx.lineWidth = line.h * 100;
      ctx.lineCap = 'butt';
      ctx.fillStyle = 'green';
      if (line.isSelected) {
        ctx.strokeStyle = 'green';
      }
      else {
        ctx.strokeStyle = 'black';
      }
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      var k = Math.atan((line.y2 - line.y1) / (line.x2 - line.x1));
      ctx.font = line.h * 100 + "px Arial";
      ctx.fillStyle = 'black';
      ctx.save();
      ctx.translate((line.x1 + line.x2) / 2, (line.y1 + line.y2) / 2);
      ctx.rotate(k);
      ctx.fillText(i + 1 + ')' + line.l.toFixed(2) + "x" + line.h, -line.h * 220, ctx.lineWidth * 1.4);
      ctx.restore();
      ctx.stroke();
    }
  }

  drawConsol() {
    for (var i = 0; i < consols.length; i++) {
      var consol = consols[i];
      var x, y;
      ctx.beginPath();
      ctx.lineCap = "butt";
      ctx.lineWidth = document.getElementById("inConsol").value * 100;
      if (consol.isSelected) {
        ctx.strokeStyle = "green";
      }
      else {
        ctx.strokeStyle = 'black';
      }
      var k = Math.atan((consol.y2 - consol.y1) / (consol.x2 - consol.x1));
      var halfLen = Math.sqrt(Math.pow(consol.y2 - consol.y1, 2)) / 2;
      if (k > 0) {
        x = Math.cos(k - Math.PI / 4);
        y = Math.sin(k - Math.PI / 4);
      }
      else {
        x = -Math.cos(k - Math.PI / 4);
        y = -Math.sin(k - Math.PI / 4);
      }
      if ((consol.y1 > consol.y2) || (k == 0 && consol.x2 > consol.x1)) {
        ctx.moveTo(consol.x1, consol.y1 + halfLen);
        ctx.lineTo(consol.x2, consol.y2 + halfLen);
        ctx.lineTo(consol.x2 - x * 4 * ctx.lineWidth, consol.y2 - y * 4 * ctx.lineWidth + halfLen);
        ctx.moveTo(consol.x1, consol.y1 + halfLen);
        ctx.lineTo(consol.x1 - x * 4 * ctx.lineWidth, consol.y1 - y * 4 * ctx.lineWidth + halfLen);
        ctx.moveTo((consol.x1 + consol.x2) / 2, (consol.y1 + consol.y2) / 2 + halfLen);
        ctx.lineTo((consol.x1 + consol.x2) / 2 - x * 4 * ctx.lineWidth, (consol.y1 + consol.y2) / 2 - y * 4 * ctx.lineWidth + halfLen);
      }
      else {
        ctx.moveTo(consol.x1, consol.y1 - halfLen);
        ctx.lineTo(consol.x2, consol.y2 - halfLen);
        ctx.lineTo(consol.x2 + x * 4 * ctx.lineWidth, consol.y2 + y * 4 * ctx.lineWidth - halfLen);
        ctx.moveTo(consol.x1, consol.y1 - halfLen);
        ctx.lineTo(consol.x1 + x * 4 * ctx.lineWidth, consol.y1 + y * 4 * ctx.lineWidth - halfLen);
        ctx.moveTo((consol.x1 + consol.x2) / 2, (consol.y1 + consol.y2) / 2 - halfLen);
        ctx.lineTo((consol.x1 + consol.x2) / 2 + x * 4 * ctx.lineWidth, (consol.y1 + consol.y2) / 2 + y * 4 * ctx.lineWidth - halfLen);
      }
      ctx.stroke();
    }
  }

  drawYzlNagr() {
    for (var i = 0; i < yzlNagrs.length; i++) {
      var yzlNagr = yzlNagrs[i];
      var x, y, x1, y1;
      ctx.beginPath();
      ctx.lineWidth = document.getElementById("inHYzlNagr").value * 100;
      var up;
      ctx.lineCap = "butt";
      if (yzlNagr.isSelected) {
        ctx.strokeStyle = "green";
      }
      else {
        ctx.strokeStyle = 'black';
      }
      var k = Math.atan((yzlNagr.y2 - yzlNagr.y1) / (yzlNagr.x2 - yzlNagr.x1));
      if (k > 0) {
        up = -(document.getElementById("inHYzlNagr").value * 100 + document.getElementById("inLine").value * 50);
        x = Math.cos(k - Math.PI / 5);
        y = Math.sin(k - Math.PI / 5);
        x1 = Math.cos(k + Math.PI / 5);
        y1 = Math.sin(k + Math.PI / 5);
      }
      else {
        up = (document.getElementById("inHYzlNagr").value * 100 + document.getElementById("inLine").value * 50);
        x = -Math.cos(k - Math.PI / 5);
        y = -Math.sin(k - Math.PI / 5);
        x1 = -Math.cos(k + Math.PI / 5);
        y1 = -Math.sin(k + Math.PI / 5);
      }
      ctx.moveTo(yzlNagr.x1, yzlNagr.y1 + up);
      ctx.font = document.getElementById("inHYzlNagr").value * 300 + "px Arial";
      ctx.fillStyle = 'black';
      ctx.lineTo(yzlNagr.x2, yzlNagr.y2 + up);
      ctx.save();
      ctx.translate(yzlNagr.x1, yzlNagr.y1 + up);
      if (k <= 0) {
        ctx.rotate(k - Math.PI / 2 + Math.PI);
      }
      else {
        ctx.rotate(k - Math.PI / 2);
      }
      ctx.fillText(yzlNagr.nagr + "кН", +10, 0);
      ctx.restore();
      if ((yzlNagr.y1 > yzlNagr.y2) || (k == 0 && yzlNagr.x2 > yzlNagr.x1)) {
        ctx.moveTo(yzlNagr.x2 + x * 4 * ctx.lineWidth, yzlNagr.y2 + y * 4 * ctx.lineWidth + up);
      }
      else {
        ctx.moveTo(yzlNagr.x2 - x * 4 * ctx.lineWidth, yzlNagr.y2 - y * 4 * ctx.lineWidth + up);
      }
      ctx.lineTo(yzlNagr.x2, yzlNagr.y2 + up);
      if ((yzlNagr.y1 > yzlNagr.y2) || (k == 0 && yzlNagr.x2 > yzlNagr.x1)) {
        ctx.lineTo(yzlNagr.x2 + x1 * 4 * ctx.lineWidth, yzlNagr.y2 + y1 * 4 * ctx.lineWidth + up);
      }
      else {
        ctx.lineTo(yzlNagr.x2 - x1 * 4 * ctx.lineWidth, yzlNagr.y2 - y1 * 4 * ctx.lineWidth + up);
      }
      ctx.stroke();
    }
  }

  drawRaspNagr() {
    for (var i = 0; i < raspNagrs.length; i++) {
      var raspNagr = raspNagrs[i];
      var x, y, x1, y1, x2, y2;
      ctx.beginPath();
      ctx.lineCap = "butt";
      ctx.lineWidth = document.getElementById("inHRaspNagr").value * 100;
      var up;
      if (raspNagr.isSelected) {
        ctx.strokeStyle = "green";
      }
      else {
        ctx.strokeStyle = 'black';
      }
      var k = Math.atan((raspNagr.y2 - raspNagr.y1) / (raspNagr.x2 - raspNagr.x1));
      if (raspNagr.x2 > raspNagr.x1) {
        up = -(6 * document.getElementById("inHRaspNagr").value * 100 + document.getElementById("inLine").value * 50);
      }
      else {
        up = 6 * document.getElementById("inHRaspNagr").value * 100 + document.getElementById("inLine").value * 50;
      }
      x = -Math.cos(k - Math.PI / 2);
      y = -Math.sin(k - Math.PI / 2);
      x1 = -Math.cos(k + Math.PI / 5);
      y1 = -Math.sin(k + Math.PI / 5);
      x2 = Math.cos(k - Math.PI / 5);
      y2 = Math.sin(k - Math.PI / 5);
      ctx.moveTo(raspNagr.x1, raspNagr.y1 + up);
      ctx.font = document.getElementById("inHRaspNagr").value * 300 + "px Arial";
      ctx.fillStyle = 'black';
      if (raspNagr.x1 <= raspNagr.x2) {
        ctx.save();
        ctx.translate((raspNagr.x1 + raspNagr.x2) / 2, (raspNagr.y1 + up + raspNagr.y2 + up) / 2);
        ctx.rotate(k);
        ctx.fillText(raspNagr.nagr + "кН/м", -document.getElementById("inHRaspNagr").value * 300, -document.getElementById("inHRaspNagr").value * 300 * 1.2);
        ctx.restore();
      }
      else {
        ctx.save();
        ctx.translate((raspNagr.x1 + raspNagr.x2) / 2, (raspNagr.y1 + up + raspNagr.y2 + up) / 2);
        ctx.rotate(k);
        ctx.fillText(raspNagr.nagr + "кН/м", -document.getElementById("inHRaspNagr").value * 300, +document.getElementById("inHRaspNagr").value * 300 * 1.2);
        ctx.restore();
      }

      ctx.lineTo(raspNagr.x2, raspNagr.y2 + up);
      if (raspNagr.x2 > raspNagr.x1) {
        ctx.moveTo(raspNagr.x2 + x * 6 * ctx.lineWidth, raspNagr.y2 + y * 6 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x2, raspNagr.y2 + up);
        ctx.moveTo(raspNagr.x2 + x * 6 * ctx.lineWidth + x1 * 3 * ctx.lineWidth, raspNagr.y2 + y * 6 * ctx.lineWidth + y1 * 3 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x2 + x * 6 * ctx.lineWidth, raspNagr.y2 + y * 6 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x2 + x * 6 * ctx.lineWidth + x2 * 3 * ctx.lineWidth, raspNagr.y2 + y * 6 * ctx.lineWidth + y2 * 3 * ctx.lineWidth + up);
      }
      else {
        ctx.moveTo(raspNagr.x2 - x * 6 * ctx.lineWidth, raspNagr.y2 - y * 6 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x2, raspNagr.y2 + up);
        ctx.moveTo(raspNagr.x2 - x * 6 * ctx.lineWidth - x1 * 3 * ctx.lineWidth, raspNagr.y2 - y * 6 * ctx.lineWidth - y1 * 3 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x2 - x * 6 * ctx.lineWidth, raspNagr.y2 - y * 6 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x2 - x * 6 * ctx.lineWidth - x2 * 3 * ctx.lineWidth, raspNagr.y2 - y * 6 * ctx.lineWidth - y2 * 3 * ctx.lineWidth + up);
      }
      if (raspNagr.x2 > raspNagr.x1) {
        ctx.moveTo((raspNagr.x1 + raspNagr.x2) / 2 + x * 6 * ctx.lineWidth, (raspNagr.y1 + raspNagr.y2) / 2 + y * 6 * ctx.lineWidth + up);
        ctx.lineTo((raspNagr.x1 + raspNagr.x2) / 2, (raspNagr.y1 + raspNagr.y2) / 2 + up);
        ctx.moveTo((raspNagr.x1 + raspNagr.x2) / 2 + x * 6 * ctx.lineWidth + x1 * 3 * ctx.lineWidth, (raspNagr.y1 + raspNagr.y2) / 2 + y * 6 * ctx.lineWidth + y1 * 3 * ctx.lineWidth + up);
        ctx.lineTo((raspNagr.x1 + raspNagr.x2) / 2 + x * 6 * ctx.lineWidth, (raspNagr.y1 + raspNagr.y2) / 2 + y * 6 * ctx.lineWidth + up);
        ctx.lineTo((raspNagr.x1 + raspNagr.x2) / 2 + x * 6 * ctx.lineWidth + x2 * 3 * ctx.lineWidth, (raspNagr.y1 + raspNagr.y2) / 2 + y * 6 * ctx.lineWidth + y2 * 3 * ctx.lineWidth + up);
      }
      else {
        ctx.moveTo((raspNagr.x1 + raspNagr.x2) / 2 - x * 6 * ctx.lineWidth, (raspNagr.y1 + raspNagr.y2) / 2 - y * 6 * ctx.lineWidth + up);
        ctx.lineTo((raspNagr.x1 + raspNagr.x2) / 2, (raspNagr.y1 + raspNagr.y2) / 2 + up);
        ctx.moveTo((raspNagr.x1 + raspNagr.x2) / 2 - x * 6 * ctx.lineWidth - x1 * 3 * ctx.lineWidth, (raspNagr.y1 + raspNagr.y2) / 2 - y * 6 * ctx.lineWidth - y1 * 3 * ctx.lineWidth + up);
        ctx.lineTo((raspNagr.x1 + raspNagr.x2) / 2 - x * 6 * ctx.lineWidth, (raspNagr.y1 + raspNagr.y2) / 2 - y * 6 * ctx.lineWidth + up);
        ctx.lineTo((raspNagr.x1 + raspNagr.x2) / 2 - x * 6 * ctx.lineWidth - x2 * 3 * ctx.lineWidth, (raspNagr.y1 + raspNagr.y2) / 2 - y * 6 * ctx.lineWidth - y2 * 3 * ctx.lineWidth + up);
      }
      if (raspNagr.x2 > raspNagr.x1) {
        ctx.moveTo(raspNagr.x1 + x * 6 * ctx.lineWidth, raspNagr.y1 + y * 6 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x1, raspNagr.y1 + up);
        ctx.moveTo(raspNagr.x1 + x * 6 * ctx.lineWidth + x1 * 3 * ctx.lineWidth, raspNagr.y1 + y * 6 * ctx.lineWidth + y1 * 3 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x1 + x * 6 * ctx.lineWidth, raspNagr.y1 + y * 6 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x1 + x * 6 * ctx.lineWidth + x2 * 3 * ctx.lineWidth, raspNagr.y1 + y * 6 * ctx.lineWidth + y2 * 3 * ctx.lineWidth + up);
      }
      else {
        ctx.moveTo(raspNagr.x1 - x * 6 * ctx.lineWidth, raspNagr.y1 - y * 6 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x1, raspNagr.y1 + up);
        ctx.moveTo(raspNagr.x1 - x * 6 * ctx.lineWidth - x1 * 3 * ctx.lineWidth, raspNagr.y1 - y * 6 * ctx.lineWidth - y1 * 3 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x1 - x * 6 * ctx.lineWidth, raspNagr.y1 - y * 6 * ctx.lineWidth + up);
        ctx.lineTo(raspNagr.x1 - x * 6 * ctx.lineWidth - x2 * 3 * ctx.lineWidth, raspNagr.y1 - y * 6 * ctx.lineWidth - y2 * 3 * ctx.lineWidth + up);
      }
      ctx.stroke();
    }
  }

  drawSharnirs() {
    for (var i = 0; i < sharnirs.length; i++) {
      var sharnir = sharnirs[i];
      ctx.beginPath();
      ctx.lineCap = "butt";
      var radius = document.getElementById("inCircleSharnir").value;
      ctx.lineWidth = document.getElementById("inHSharnir").value * 100;
      ctx.fillStyle = 'white';
      if (sharnir.isSelected) {
        ctx.strokeStyle = 'green';
      }
      else {
        ctx.strokeStyle = 'black';
      }
      var k = Math.atan((sharnir.y2 - sharnir.y1) / (sharnir.x2 - sharnir.x1));
      ctx.arc(sharnir.x1, sharnir.y1, radius, 0, Math.PI * 2);
      var x, y, x2, y2, x3, y3;
      if (k > 0) {
        x = radius * Math.cos(k);
        y = radius * Math.sin(k);
        x2 = Math.cos(k + Math.PI / 2);
        y2 = Math.sin(k + Math.PI / 2);
        x3 = Math.cos(k + Math.PI / 6);
        y3 = Math.sin(k + Math.PI / 6);
      }
      if (k < 0) {
        x = -radius * Math.cos(k);
        y = -radius * Math.sin(k);
        x2 = -Math.cos(k + Math.PI / 2);
        y2 = -Math.sin(k + Math.PI / 2);
        x3 = -Math.cos(k + Math.PI / 6);
        y3 = -Math.sin(k + Math.PI / 6);
      }
      if (sharnir.y1 > sharnir.y2) {
        ctx.moveTo(sharnir.x1 - x, sharnir.y1 - y);
      }
      else { ctx.moveTo(sharnir.x1 + x, sharnir.y1 + y); }
      ctx.lineTo(sharnir.x2, sharnir.y2);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(sharnir.x2, sharnir.y2, radius, 0, Math.PI * 2);
      if (sharnir.y1 < sharnir.y2) {
        ctx.moveTo(sharnir.x2 + x, sharnir.y2 + y);
        ctx.lineTo(sharnir.x2 + x + radius * x2 * 2, sharnir.y2 + y + radius * y2 * 2);
        ctx.lineTo(sharnir.x2 + x - radius * x2 * 2, sharnir.y2 + y - radius * y2 * 2);
        ctx.lineTo(sharnir.x2 + x - radius * x2 * 2 + x3 * radius, sharnir.y2 + y - radius * y2 * 2 + y3 * radius);
        ctx.moveTo(sharnir.x2 + x, sharnir.y2 + y);
        ctx.lineTo(sharnir.x2 + x + x3 * radius, sharnir.y2 + y + y3 * radius);
        ctx.moveTo(sharnir.x2 + x + radius * x2 * 2, sharnir.y2 + y + radius * y2 * 2);
        ctx.lineTo(sharnir.x2 + x + radius * x2 * 2 + x3 * radius, sharnir.y2 + y + radius * y2 * 2 + y3 * radius);
      }
      else {
        ctx.moveTo(sharnir.x2 - x, sharnir.y2 - y);
        ctx.lineTo(sharnir.x2 - x - radius * x2 * 2, sharnir.y2 - y - radius * y2 * 2);
        ctx.lineTo(sharnir.x2 - x + radius * x2 * 2, sharnir.y2 - y + radius * y2 * 2);
        ctx.lineTo(sharnir.x2 - x + radius * x2 * 2 - x3 * radius, sharnir.y2 - y + radius * y2 * 2 - y3 * radius);
        ctx.moveTo(sharnir.x2 - x, sharnir.y2 - y);
        ctx.lineTo(sharnir.x2 - x - x3 * radius, sharnir.y2 - y - y3 * radius);
        ctx.moveTo(sharnir.x2 - x - radius * x2 * 2, sharnir.y2 - y - radius * y2 * 2);
        ctx.lineTo(sharnir.x2 - x - radius * x2 * 2 - x3 * radius, sharnir.y2 - y - radius * y2 * 2 - y3 * radius);
      }
      ctx.fill();
      ctx.stroke();
    }
  }

  drawCircles() {
    for (var i = 0; i < circles.length; i++) {
      var circle = circles[i];
      ctx.beginPath();
      ctx.fillStyle = 'white';
      if (circle.isSelected) {
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'green';
      }
      else {
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'black';
      }
      ctx.font = document.getElementById("inLine").value + "px Arial";
      ctx.arc(circle.x, circle.y, document.getElementById("inCircle").value, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.clearRect(0, 0, image.width, image.height);
    ctx.drawImage(image, 0, 0);
    this.drawLines();
    this.drawSharnirs();
    this.drawCircles();
    this.drawYzlNagr();
    this.drawRaspNagr();
    this.drawConsol();
    this.context.drawImage(this.image, this.x1, this.y1, this.w1, this.h1);
    lX = this.x1;
    lY = this.y1;
    rX = this.w1;
    rY = this.h1;
  }
};

var image = document.getElementById("source");
var source = document.getElementById("can");
source.width = image.width;
source.height = image.height;
var ctx = source.getContext("2d");
ctx.drawImage(image, 0, 0);
var canvas = document.getElementById("paint-can");
var viewer = new canvasView(canvas, source);

window.addEventListener('keydown', keyDownListener, false);
window.addEventListener('keyup', keyUpListener, false);

function keyUpListener(event) { }

function keyDownListener(event) {
  if (event.keyCode == 46) {
    for (var i = lines.length - 1; i >= 0; i--) {
      if (lines[i].isSelected == true) {
        for (var j = circles.length - 1; j >= 0; j--) {
          if ((circles[j].x == lines[i].x2 || circles[j].x == lines[i].x1)) {
            circles[j].isSelected = true;
            isDraggingCircle = true;
          }
          if (circles[j].x > lines[i].x2) {
            circles[j].x -= lines[i].l * 100;
          }
        }
        for (var j = sharnirs.length - 1; j >= 0; j--) {
          if ((sharnirs[j].x1 == lines[i].x2 || sharnirs[j].x1 == lines[i].x1)) {
            sharnirs[j].isSelected = true;
            isDraggingSharnir = true;
          }
          if (sharnirs[j].x1 > lines[i].x2) {
            sharnirs[j].x1 -= lines[i].l * 100;
            sharnirs[j].x2 -= lines[i].l * 100;
          }
        }
        for (var j = consols.length - 1; j >= 0; j--) {
          if ((consols[j].x1 == lines[i].x2 || consols[j].x1 == lines[i].x1)) {
            consols[j].isSelected = true;
            isDraggingConsol = true;
          }
          if (consols[j].x1 > lines[i].x2) {
            consols[j].x1 -= lines[i].l * 100;
            consols[j].x2 -= lines[i].l * 100;
          }
        }
        for (var j = yzlNagrs.length - 1; j >= 0; j--) {
          if ((yzlNagrs[j].x2 == lines[i].x2 || yzlNagrs[j].x2 == lines[i].x1)) {
            yzlNagrs[j].isSelected = true;
            isDraggingYzlNagr = true;
          }
          if (yzlNagrs[j].x1 > lines[i].x2) {
            yzlNagrs[j].x1 -= lines[i].l * 100;
            yzlNagrs[j].x2 -= lines[i].l * 100;
          }
        }
        for (var j = raspNagrs.length - 1; j >= 0; j--) {
          if ((raspNagrs[j].x1 == lines[i].x1 && raspNagrs[j].x2 == lines[i].x2) || (raspNagrs[j].x1 == lines[i].x2 && raspNagrs[j].x2 == lines[i].x1)) {
            raspNagrs[j].isSelected = true;
            isDraggingRaspNagr = true;
          }
          if (raspNagrs[j].x1 >= lines[i].x2 && raspNagrs[j].x2 > raspNagrs[j].x1 || raspNagrs[j].x2 >= lines[i].x2 && raspNagrs[j].x2 <= raspNagrs[j].x1) {
            raspNagrs[j].x1 -= lines[i].l * 100;
            raspNagrs[j].x2 -= lines[i].l * 100;
          }
        }
        for (var k = i + 1; k <= lines.length - 1; k++) {
          lines[k].x1 -= lines[i].l * 100;
          lines[k].x2 -= lines[i].l * 100;
        }
        lines.splice(i, 1);
        viewer.draw();
      }
    }
    for (var i = consols.length - 1; i >= 0; i--) {
      if (consols[i].isSelected == true) {
        consols.splice(i, 1);
        viewer.draw();
      }
    }
    for (var i = circles.length - 1; i >= 0; i--) {
      if (circles[i].isSelected == true) {
        circles.splice(i, 1);
        viewer.draw();
      }
    }
    for (var i = sharnirs.length - 1; i >= 0; i--) {
      if (sharnirs[i].isSelected == true) {
        sharnirs.splice(i, 1);
        viewer.draw();
      }
    }
    for (var i = yzlNagrs.length - 1; i >= 0; i--) {
      if (yzlNagrs[i].isSelected == true) {
        yzlNagrs.splice(i, 1);
        viewer.draw();
      }
    }
    for (var i = raspNagrs.length - 1; i >= 0; i--) {
      if (raspNagrs[i].isSelected == true) {
        raspNagrs.splice(i, 1);
        viewer.draw();
      }
    }
  }
}

document.getElementById("li-2").addEventListener("click", () => {
  for (var i = lines.length - 1; i >= 0; i--) {
    if (lines[i].isSelected == true) {
      for (var j = circles.length - 1; j >= 0; j--) {
        if ((circles[j].x == lines[i].x2 || circles[j].x == lines[i].x1)) {
          circles[j].isSelected = true;
          isDraggingCircle = true;
        }
        if (circles[j].x > lines[i].x2) {
          circles[j].x -= lines[i].l * 100;
        }
      }
      for (var j = sharnirs.length - 1; j >= 0; j--) {
        if ((sharnirs[j].x1 == lines[i].x2 || sharnirs[j].x1 == lines[i].x1)) {
          sharnirs[j].isSelected = true;
          isDraggingSharnir = true;
        }
        if (sharnirs[j].x1 > lines[i].x2) {
          sharnirs[j].x1 -= lines[i].l * 100;
          sharnirs[j].x2 -= lines[i].l * 100;
        }
      }
      for (var j = consols.length - 1; j >= 0; j--) {
        if ((consols[j].x1 == lines[i].x2 || consols[j].x1 == lines[i].x1)) {
          consols[j].isSelected = true;
          isDraggingConsol = true;
        }
        if (consols[j].x1 > lines[i].x2) {
          consols[j].x1 -= lines[i].l * 100;
          consols[j].x2 -= lines[i].l * 100;
        }
      }
      for (var j = yzlNagrs.length - 1; j >= 0; j--) {
        if ((yzlNagrs[j].x2 == lines[i].x2 || yzlNagrs[j].x2 == lines[i].x1)) {
          yzlNagrs[j].isSelected = true;
          isDraggingYzlNagr = true;
        }
        if (yzlNagrs[j].x1 > lines[i].x2) {
          yzlNagrs[j].x1 -= lines[i].l * 100;
          yzlNagrs[j].x2 -= lines[i].l * 100;
        }
      }
      for (var j = raspNagrs.length - 1; j >= 0; j--) {
        if ((raspNagrs[j].x1 == lines[i].x1 && raspNagrs[j].x2 == lines[i].x2) || (raspNagrs[j].x1 == lines[i].x2 && raspNagrs[j].x2 == lines[i].x1)) {
          raspNagrs[j].isSelected = true;
          isDraggingRaspNagr = true;
        }
        if (raspNagrs[j].x1 >= lines[i].x2 && raspNagrs[j].x2 > raspNagrs[j].x1 || raspNagrs[j].x2 >= lines[i].x2 && raspNagrs[j].x2 <= raspNagrs[j].x1) {
          raspNagrs[j].x1 -= lines[i].l * 100;
          raspNagrs[j].x2 -= lines[i].l * 100;
        }
      }
      for (var k = i + 1; k <= lines.length - 1; k++) {
        lines[k].x1 -= lines[i].l * 100;
        lines[k].x2 -= lines[i].l * 100;
      }
      lines.splice(i, 1);
      viewer.draw();
    }
  }
  for (var i = raspNagrs.length - 1; i >= 0; i--) {
    if (raspNagrs[i].isSelected == true) {
      raspNagrs.splice(i, 1);
      viewer.draw();
    }
  }
  for (var i = consols.length - 1; i >= 0; i--) {
    if (consols[i].isSelected == true) {
      consols.splice(i, 1);
      viewer.draw();
    }
  }
  for (var i = circles.length - 1; i >= 0; i--) {
    if (circles[i].isSelected == true) {
      circles.splice(i, 1);
      viewer.draw();
    }
  }
  for (var i = sharnirs.length - 1; i >= 0; i--) {
    if (sharnirs[i].isSelected == true) {
      sharnirs.splice(i, 1);
      viewer.draw();
    }
  }
  for (var i = yzlNagrs.length - 1; i >= 0; i--) {
    if (yzlNagrs[i].isSelected == true) {
      yzlNagrs.splice(i, 1);
      viewer.draw();
    }
  }
}, false);

document.getElementById('inLine').onchange = function () {
  if (previousSelected != null) {
    previousSelected.h = document.getElementById("inLine").value * 100 / 100;
  }
  viewer.draw();
}

document.getElementById('inLineL').onchange = function () {
  if (previousSelected != null) {
    previousSelected.l = document.getElementById("inLineL").value * 100 / 100;
    var perem = document.getElementById("inLineL").value * 100 - Math.abs(previousSelected.x2 - previousSelected.x1, 2);
    previousSelected.x2 += perem;
    for (var i = lines.length - 1; i >= 0; i--) {
      if (lines[i] != previousSelected && lines[i].x2 >= previousSelected.x2) {
        lines[i].x1 += perem;
        lines[i].x2 += perem;
      }
    }
    for (var i = circles.length - 1; i >= 0; i--) {
      if (circles[i].x > previousSelected.x1) {
        circles[i].x += perem;
      }
    }
    for (var i = sharnirs.length - 1; i >= 0; i--) {
      if (sharnirs[i].x1 > previousSelected.x1) {
        sharnirs[i].x1 += perem;
        sharnirs[i].x2 += perem;
      }
    }
    for (var i = yzlNagrs.length - 1; i >= 0; i--) {
      if (yzlNagrs[i].x1 > previousSelected.x1) {
        yzlNagrs[i].x1 += perem;
        yzlNagrs[i].x2 += perem;
      }
    }
    for (var i = raspNagrs.length - 1; i >= 0; i--) {
      if (raspNagrs[i].x2 > raspNagrs[i].x1) {
        if (raspNagrs[i].x1 == previousSelected.x1) {
          raspNagrs[i].x2 += perem;
        }
        if (raspNagrs[i].x1 > previousSelected.x1) {
          raspNagrs[i].x1 += perem;
          raspNagrs[i].x2 += perem;
        }
      }
      else {
        if (raspNagrs[i].x2 == previousSelected.x1) {
          raspNagrs[i].x1 += perem;
        }
        if (raspNagrs[i].x2 > previousSelected.x1) {
          raspNagrs[i].x1 += perem;
          raspNagrs[i].x2 += perem;
        }
      }
    }
    for (var i = consols.length - 1; i >= 0; i--) {
      if (consols[i].x1 > previousSelected.x1) {
        consols[i].x1 += perem;
        consols[i].x2 += perem;
      }
    }
  }
  viewer.draw();
}
document.getElementById('inCircle').onchange = function () {
  viewer.draw();
}
document.getElementById('inCircleSharnir').onchange = function () {
  viewer.draw();
}
document.getElementById('inHSharnir').onchange = function () {
  viewer.draw();
}
document.getElementById('inHYzlNagr').onchange = function () {
  viewer.draw();
}
document.getElementById('inYzlNagr').onchange = function () {
  if (previousSelected != null) {
    previousSelected.nagr = document.getElementById("inYzlNagr").value;
  }
  viewer.draw();
}
document.getElementById('inRaspNagr').onchange = function () {
  if (previousSelected != null) {
    previousSelected.nagr = document.getElementById("inRaspNagr").value;
  }
  viewer.draw();
}
document.getElementById('inHRaspNagr').onchange = function () {
  viewer.draw();
}
document.getElementById('inConsol').onchange = function () {
  viewer.draw();
}

function closeButt1() {
  isLine2 = false;
  document.getElementById('lineButt').classList.remove("activeButton");
  document.getElementById('paint-can').classList.remove("cursorStyle");
  for (var i = lines.length - 1; i >= 0; i--) {
    lines[i].isSelected = false;
  }
  if (previousSelected != null) previousSelected.isSelected = false;
  viewer.draw();
}

function closeButt3() {
  isCircle2 = false;
  document.getElementById('circleButt').classList.remove("activeButton");
  document.getElementById('paint-can').classList.remove("cursorStyle");
  for (var i = circles.length - 1; i >= 0; i--) {
    circles[i].isSelected = false;
  }
  if (previousSelected != null) previousSelected.isSelected = false;
  viewer.draw();
}

function closeButt4() {
  isSharnir2 = false;
  document.getElementById('sharnirButt').classList.remove("activeButton");
  document.getElementById('paint-can').classList.remove("cursorStyle");
  for (var i = sharnirs.length - 1; i >= 0; i--) {
    sharnirs[i].isSelected = false;
  }
  if (previousSelected != null) previousSelected.isSelected = false;
  viewer.draw();
}

function closeButt6() {
  isRaspNagr2 = false;
  document.getElementById('raspNagrButt').classList.remove("activeButton");
  document.getElementById('paint-can').classList.remove("cursorStyle");
  for (var i = raspNagrs.length - 1; i >= 0; i--) {
    raspNagrs[i].isSelected = false;
  }
  if (previousSelected != null) previousSelected.isSelected = false;
  viewer.draw();
}

function closeButt7() {
  isYzlNagr2 = false;
  document.getElementById('yzlNagrButt').classList.remove("activeButton");
  document.getElementById('paint-can').classList.remove("cursorStyle");
  for (var i = yzlNagrs.length - 1; i >= 0; i--) {
    yzlNagrs[i].isSelected = false;
  }
  if (previousSelected != null) previousSelected.isSelected = false;
  viewer.draw();
}

function closeButt8() {
  isConsol2 = false;
  document.getElementById('consolButt').classList.remove("activeButton");
  document.getElementById('paint-can').classList.remove("cursorStyle");
  for (var i = consols.length - 1; i >= 0; i--) {
    consols[i].isSelected = false;
  }
  if (previousSelected != null) previousSelected.isSelected = false;
  viewer.draw();
}

document.getElementById('inButt1').onclick = function () {
  if (isLine2 == false) {
    if (previousSelected != null) previousSelected.isSelected = false;
    viewer.draw();
    document.getElementById('lineButt').classList.add("activeButton");
    document.getElementById('paint-can').classList.add("cursorStyle");
    document.getElementById('circleButt').classList.remove("activeButton");
    document.getElementById('sharnirButt').classList.remove("activeButton");
    document.getElementById('yzlNagrButt').classList.remove("activeButton");
    document.getElementById('consolButt').classList.remove("activeButton");
    document.getElementById('raspNagrButt').classList.remove("activeButton");
    isLine2 = true;
    isCircle2 = false;
    isSharnir2 = false;
    isYzlNagr2 = false;
    isConsol2 = false;
    isRaspNagr2 = false;
  }
  else {
    closeButt1();
  }
}

document.getElementById('inButt3').onclick = function () {
  if (isCircle2 == false) {
    if (previousSelected != null) previousSelected.isSelected = false;
    viewer.draw();
    document.getElementById('circleButt').classList.add("activeButton");
    document.getElementById('paint-can').classList.add("cursorStyle");
    document.getElementById('lineButt').classList.remove("activeButton");
    document.getElementById('sharnirButt').classList.remove("activeButton");
    document.getElementById('yzlNagrButt').classList.remove("activeButton");
    document.getElementById('consolButt').classList.remove("activeButton");
    document.getElementById('raspNagrButt').classList.remove("activeButton");
    isCircle2 = true;
    isLine2 = false;
    isSharnir2 = false;
    isYzlNagr2 = false;
    isConsol2 = false;
    isRaspNagr2 = false;
  }
  else {
    closeButt3();
  }
}

document.getElementById('inButt4').onclick = function () {
  if (isSharnir2 == false) {
    if (previousSelected != null) previousSelected.isSelected = false;
    viewer.draw();
    document.getElementById('sharnirButt').classList.add("activeButton");
    document.getElementById('paint-can').classList.add("cursorStyle");
    document.getElementById('lineButt').classList.remove("activeButton");
    document.getElementById('circleButt').classList.remove("activeButton");
    document.getElementById('yzlNagrButt').classList.remove("activeButton");
    document.getElementById('consolButt').classList.remove("activeButton");
    document.getElementById('raspNagrButt').classList.remove("activeButton");
    isSharnir2 = true;
    isLine2 = false;
    isCircle2 = false;
    isYzlNagr2 = false;
    isConsol2 = false;
    isRaspNagr2 = false;
  }
  else {
    closeButt4();
  }
}

document.getElementById('inButt6').onclick = function () {
  if (isRaspNagr2 == false) {
    if (previousSelected != null) previousSelected.isSelected = false;
    viewer.draw();
    document.getElementById('raspNagrButt').classList.add("activeButton");
    document.getElementById('paint-can').classList.add("cursorStyle");
    document.getElementById('yzlNagrButt').classList.remove("activeButton");
    document.getElementById('sharnirButt').classList.remove("activeButton");
    document.getElementById('lineButt').classList.remove("activeButton");
    document.getElementById('circleButt').classList.remove("activeButton");
    document.getElementById('consolButt').classList.remove("activeButton");
    isRaspNagr2 = true;
    isYzlNagr2 = false;
    isSharnir2 = false;
    isLine2 = false;
    isCircle2 = false;
    isConsol2 = false
  }
  else {
    closeButt6();
  }
}

document.getElementById('inButt7').onclick = function () {
  if (isYzlNagr2 == false) {
    if (previousSelected != null) previousSelected.isSelected = false;
    viewer.draw();
    document.getElementById('yzlNagrButt').classList.add("activeButton");
    document.getElementById('paint-can').classList.add("cursorStyle");
    document.getElementById('sharnirButt').classList.remove("activeButton");
    document.getElementById('lineButt').classList.remove("activeButton");
    document.getElementById('circleButt').classList.remove("activeButton");
    document.getElementById('consolButt').classList.remove("activeButton");
    document.getElementById('raspNagrButt').classList.remove("activeButton");
    isYzlNagr2 = true;
    isSharnir2 = false;
    isLine2 = false;
    isCircle2 = false;
    isConsol2 = false;
    isRaspNagr2 = false;
  }
  else {
    closeButt7();
  }
}

document.getElementById('inButt8').onclick = function () {
  if (isConsol2 == false) {
    if (previousSelected != null) previousSelected.isSelected = false;
    viewer.draw();
    document.getElementById('consolButt').classList.add("activeButton");
    document.getElementById('paint-can').classList.add("cursorStyle");
    document.getElementById('sharnirButt').classList.remove("activeButton");
    document.getElementById('lineButt').classList.remove("activeButton");
    document.getElementById('circleButt').classList.remove("activeButton");
    document.getElementById('yzlNagrButt').classList.remove("activeButton");
    document.getElementById('raspNagrButt').classList.remove("activeButton");
    isConsol2 = true;
    isSharnir2 = false;
    isLine2 = false;
    isCircle2 = false;
    isYzlNagr2 = false;
    isRaspNagr2 = false;
  }
  else {
    closeButt8();
  }
}

function tableView() {
  document.getElementById('podMenu').hidden = true;
  document.getElementById('podMenu2').hidden = true;
  document.getElementById('podMenu5').hidden = true;
  document.getElementById('podFile').hidden = true;
  document.getElementById('inputTable1').hidden = true;
  document.getElementById('inputTable3').hidden = true;
  document.getElementById('inputTable4').hidden = true;
  document.getElementById('inputTable6').hidden = true;
  document.getElementById('inputTable7').hidden = true;
  document.getElementById('inputTable8').hidden = true;
  document.getElementById('save').hidden = true;
  document.getElementById('load').hidden = true;

  document.getElementById('red').onclick = function () {
    if (document.getElementById('podMenu').hidden != true) {
      document.getElementById('podMenu').hidden = true;
      document.getElementById('podFile').hidden = true;
      closeButt1();
      closeButt3();
      closeButt4();
      closeButt6();
      closeButt7();
      closeButt8();
    }
    else {
      document.getElementById('podMenu').hidden = false;
      document.getElementById('podFile').hidden = true;
    }
  }

  document.getElementById('file').onclick = function () {
    if (document.getElementById('podFile').hidden != true) {
      document.getElementById('podFile').hidden = true;
      document.getElementById('save').hidden = true;
      document.getElementById('load').hidden = true;
    }
    else {
      document.getElementById('podFile').hidden = false;
      document.getElementById('podMenu').hidden = true;
      closeButt1();
      closeButt3();
      closeButt4();
      closeButt6();
      closeButt7();
      closeButt8();
    }
  }

  document.getElementById('1').onclick = function () {
    if (document.getElementById('inputTable1').hidden != true) {
      document.getElementById('inputTable1').hidden = true;
      closeButt1();
    }
    else {
      document.getElementById('inputTable1').hidden = false;
    }
  }

  document.getElementById('2').onclick = function () {
    if (document.getElementById('podMenu2').hidden != true) {
      document.getElementById('podMenu2').hidden = true;
      closeButt3();
      closeButt4();
    }
    else {
      document.getElementById('podMenu2').hidden = false;
      document.getElementById('inputTable3').hidden = true;
      document.getElementById('inputTable4').hidden = true;
    }
  }

  document.getElementById('3').onclick = function () {
    if (document.getElementById('inputTable3').hidden != true) {
      document.getElementById('inputTable3').hidden = true;
      closeButt3();
    }
    else {
      document.getElementById('inputTable3').hidden = false;
    }
  }

  document.getElementById('4').onclick = function () {
    if (document.getElementById('inputTable4').hidden != true) {
      document.getElementById('inputTable4').hidden = true;
      closeButt4();
    }
    else {
      document.getElementById('inputTable4').hidden = false;
    }
  }

  document.getElementById('5').onclick = function () {
    if (document.getElementById('podMenu5').hidden != true) {
      document.getElementById('podMenu5').hidden = true;
      closeButt6();
      closeButt7();
    }
    else {
      document.getElementById('podMenu5').hidden = false;
      document.getElementById('inputTable6').hidden = true;
      document.getElementById('inputTable7').hidden = true;
    }
  }

  document.getElementById('6').onclick = function () {
    if (document.getElementById('inputTable6').hidden != true) {
      document.getElementById('inputTable6').hidden = true;
      closeButt6();
    }
    else {
      document.getElementById('inputTable6').hidden = false;
    }
  }

  document.getElementById('7').onclick = function () {
    if (document.getElementById('inputTable7').hidden != true) {
      document.getElementById('inputTable7').hidden = true;
      closeButt7();
    }
    else {
      document.getElementById('inputTable7').hidden = false;
    }
  }

  document.getElementById('8').onclick = function () {
    if (document.getElementById('inputTable8').hidden != true) {
      document.getElementById('inputTable8').hidden = true;
      closeButt8();
    }
    else {
      document.getElementById('inputTable8').hidden = false;
    }
  }

  document.getElementById('11').onclick = function () {
    if (document.getElementById('save').hidden != true) {
      document.getElementById('save').hidden = true;
    }
    else {
      document.getElementById('save').hidden = false;
    }
  }

  document.getElementById('12').onclick = function () {
    if (document.getElementById('load').hidden != true) {
      document.getElementById('load').hidden = true;
    }
    else {
      document.getElementById('load').hidden = false;
    }
  }

  document.getElementById('13').onclick = function (e) {
    if (!confirm('Хотите очистить схему?')) {
      e.preventDefault();
    }
    else {
      lines = [];
      circles = [];
      sharnirs = [];
      raspNagrs = [];
      yzlNagrs = [];
      consols = [];
      viewer.draw();
    }
  }
}

document.getElementById('buttonSave').onclick = function () {
  var all = [lines, circles, sharnirs, raspNagrs, yzlNagrs, consols];
  var data = JSON.stringify(all);
  var file = new Blob([data], { type: 'text/plain' });
  if (window.navigator.msSaveOrOpenBlob)
    window.navigator.msSaveOrOpenBlob(file, document.getElementById('nameFile').value);
  else {
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = document.getElementById('nameFile').value;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

document.getElementById('buttonLoad').onclick = function () {
  var file = document.getElementById("myFile").files[0];
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    var data = reader.result;
    try {
      data = JSON.parse(data);
      lines = data[0];
      circles = data[1];
      sharnirs = data[2];
      raspNagrs = data[3];
      yzlNagrs = data[4];
      consols = data[5];
      viewer.draw();
    }
    catch (e) { alert(e); }
  };
}