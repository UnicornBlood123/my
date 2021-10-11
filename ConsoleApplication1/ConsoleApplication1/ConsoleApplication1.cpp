#include <iostream>
#include <math.h>
#include <SFML/Graphics.hpp>
#include <fstream>

using namespace sf;
using namespace std;

void updateWindow();
int sizePoints, sizeChip, sizeLines;

class Point {
public:
	Point(float x = 0, float y = 0)
	{
		this->x = x;
		this->y = y;
		haveChip = false;
	}
	void setX(float x) {
		this->x = x;
	}
	void setY(float y) {
		this->y = y;
	}
	float getX() {
		return x;
	}
	float getY() {
		return y;
	}
	void setHaveChip(bool a) {
		haveChip = a;
	}
	bool getHaveChip() {
		return haveChip;
	}
private:
	float x, y;
	bool haveChip;
};

bool operator ==(Point p1, Point p2) {
	if (p1.getX() == p2.getX() && p1.getY() == p2.getY()) return 1;
	return 0;
}
bool operator !=(Point p1, Point p2) {
	if (p1 == p2) return 0;
}

class Line {
public:
	Line() {}
	Line(Point &p1, Point &p2) :point1(p1), point2(p2) {
		x1 = p1.getX();
		y1 = p1.getY();
		x2 = p2.getX();
		y2 = p2.getY();
		r[0] = Vertex(Vector2f(x1, y1));
		r[0].color = (Color::Black);
		r[1] = Vertex(Vector2f(x2, y2));
		r[1].color = (Color::Black);
	}
	void setX1(float x) {
		x1 = x;
	}
	void setY1(float y) {
		y1 = y;
	}
	void setX2(float x) {
		x2 = x;
	}
	void setY2(float y) {
		y2 = y;
	}
	float getX1() {
		return x1;
	}
	float getY1() {
		return y1;
	}
	float getX2() {
		return x2;
	}
	float getY2() {
		return y2;
	}
	Vertex *getLine() {
		return r;
	}
	Point &getPoint1() {
		return point1;
	}
	Point &getPoint2() {
		return point2;
	}
	void setColor(Color c) {
		r[0].color = c;
		r[1].color = c;
	}
private:
	float x1, y1, x2, y2;
	Point point1, point2;
	Vertex r[2];
};

bool operator ==(Line l1, Line l2) {
	if (l1.getX1() == l2.getX1() && l1.getY1() == l2.getY1()&& l1.getX2() == l2.getX2() && l1.getY2() == l2.getY2()) return 1;
	return 0;
}

bool operator !=(Line l1, Line l2) {
	if (l1 == l2)return 0;
}


class Chip {
public:
	Chip() {}
	Chip(Point &p, Color c) :color(c) {
		x1 = p.getX() - 20;
		y1 = p.getY() - 20;
		x2 = p.getX() + 20;
		y2 = p.getY() + 20;
		isMove = false;
		p.setHaveChip(true);
		curPoint = p;
		r.setPosition(x1, y1);
		r.setSize(Vector2f(x2 - x1, y2 - y1));
		r.setFillColor(color);
	}
	void update(Point *point) {
		x2 = x1 + 40;
		y2 = y1 + 40;
		r.setPosition(x1, y1);
	}
	void move(Vector2f pos, Line *line, Point *point) {
		int t = sizePoints-1;
		float distanceX, distanceY, distance = 1000, curDistance;
		int pointNumber = 0;
		while (t--) {
			for (int i = 0; i < sizePoints; i++) {
				curDistance = sqrt(pow((pos.x - point[i].getX()), 2) + pow((pos.y - point[i].getY()), 2));
				if (point[i].getHaveChip() == 0) {
					for (int j = 0; j < sizeLines; j++) {
						if ((curPoint == line[j].getPoint1() || curPoint == line[j].getPoint2()) && (point[i] == line[j].getPoint1() || point[i] == line[j].getPoint2())) {
							if (curDistance < distance) {
								distance = curDistance;
								pointNumber = i;
							}
						}
					}
				}
			}
			distanceX = (x1 - point[pointNumber].getX() + 20) / 100;
			distanceY = (y1 - point[pointNumber].getY() + 20) / 100;
			for (int i = 0; i < sizePoints; i++) {
				if (curPoint == point[i])point[i].setHaveChip(0);
			}	
			point[pointNumber].setHaveChip(1);
			curPoint = point[pointNumber];
		};
		int a = 100;
		while (a--) {
			x1 -= distanceX;
			y1 -= distanceY;
			x2 -= distanceX;
			y2 -= distanceY;
			r.setPosition(x1, y1);
			updateWindow();
			sleep(seconds(0.001));
		}
		r.setPosition(x1, y1);
	}
	void setX1(float x) {
		x1 = x;
	}
	void setY1(float y) {
		y1 = y;
	}
	void setX2(float x) {
		x2 = x;
	}
	void setY2(float y) {
		y2 = y;
	}
	float getX1() {
		return x1;
	}
	float getY1() {
		return y1;
	}
	float getX2() {
		return x2;
	}
	float getY2() {
		return y2;
	}
	RectangleShape &getRect() {
		return r;
	}
	void setIsMove(bool a) {
		isMove = a;
	}
	bool getIsMove() {
		return isMove;
	}
	void setCurPoint(Point p) {
		curPoint = p;
	}
	Point getCurPoint() {
		return curPoint;
	}

private:
	float x1, y1, x2, y2;
	Color color;
	bool isMove;
	RectangleShape r;
	Point curPoint;
};

RenderWindow window(VideoMode(600, 360), "Game");
Point *point;
Chip *chip;
Line *line;
Color color[] = {Color(173, 255, 47),Color(205, 92, 92),Color(220, 20, 60),Color(255, 255, 0),Color(0, 0, 255),Color(0, 128, 0),Color(186, 85, 211),Color(221, 160, 221),Color(25, 25, 112),Color(0, 128, 128) };
int *victory;
Image img;
Texture victoryImg;
Sprite sprite;

void updateWindow() {
	window.clear(Color::White);
	for (int i = 0; i < sizeChip; i++) {
		window.draw(chip[i].getRect());
	}
	for (int i = 0; i < sizeLines; i++) {
		window.draw(line[i].getLine(),2, Lines);
	}
	window.draw(sprite);
	window.display();
}

void loadFromFile(const char *name,int num) {
	char buff[50];
	ifstream fin(name);
	if (!fin.is_open())
		cout << "Eror load file!\n";
	else {
		fin >> buff;
		sizeChip = atoi(buff);
		fin >> buff;
		sizePoints = atoi(buff);
		int coordPoints[2];
		point = new Point[sizePoints];
		int j, c;
		for (int i = 0; i < sizePoints; i++) {
			fin >> buff;
			char a[10];
			j = 0;
			while (buff[j] != ',') {
				a[j] = buff[j];
				j++;
			}
			coordPoints[0] = atoi(a);
			a[0] = '\0';
			c = 0;
			while (buff[++j]) {
				a[c++] = buff[j];
			}
			coordPoints[1] = atoi(a);
			point[i] = Point(coordPoints[0], coordPoints[1]);
		}
		fin >> buff;
		int coordChips;
		chip = new Chip[sizeChip];
		j = 0;
		for (int i = 0; i < sizeChip; i++) {
			char a[2];
			c = 0;
			while (buff[j] != '\0' && buff[j] != ',') {
				a[c] = buff[j];
				j++;
			}
			coordChips = atoi(a);
			chip[i] = Chip(point[coordChips - 1], color[i]);
			if (buff[j] == ',')j++;
		}
		fin >> buff;
		j = 0;
		victory = new int[sizeChip];
		for (int i = 0; i < sizeChip; i++) {
			char a[2];
			c = 0;
			while (buff[j] != '\0' && buff[j] != ',') {
				a[c] = buff[j];
				j++;
			}
			coordChips = atoi(a);
			victory[i] = coordChips;
			if (buff[j] == ',')j++;
		}
		fin >> buff;
		sizeLines = atoi(buff);
		line = new Line[sizeLines];
		String path = "images/";
		String endPath = "lvl.png";
		path += to_string(num) + endPath;
		img.loadFromFile(path);
		victoryImg.loadFromImage(img);
		sprite.setTexture(victoryImg);
		sprite.setPosition(400, 200);
		
		int coordLines[2];
		for (int i = 0; i < sizeLines; i++) {
			fin >> buff;
			char a[10];
			j = 0;
			while (buff[j] != ',') {
				a[j] = buff[j];
				j++;
			}
			coordLines[0] = atoi(a);
			a[0] = '\0';
			c = 0;
			while (buff[++j]) {
				a[c++] = buff[j];
			}
			coordLines[1] = atoi(a);
			line[i] = Line(point[coordLines[0] - 1], point[coordLines[1] - 1]);
		}
	}
}
bool lvlSelect() {
	RenderWindow lvlWindow(VideoMode(190, 200), "lvl");
	int menuNum = 0;
	while (lvlWindow.isOpen())
	{
		Event event;
		while (lvlWindow.pollEvent(event))
		{
			if (event.type == Event::Closed) {
				lvlWindow.close();
			}
		}
		Vector2i pixelPos = Mouse::getPosition(lvlWindow);
		RectangleShape lvl1, lvl2, lvl3, out;
		Font font;
		font.loadFromFile("CyrilicOld.ttf");
		Text t1("lvl 1", font, 30);
		t1.setPosition(65, 15);
		Text t2("lvl 2", font, 30);
		t2.setPosition(65, 55);
		Text t3("lvl 3", font, 30);
		t3.setPosition(65, 95);
		Text t4(" out", font, 30);
		t4.setPosition(65, 135);
		lvl1.setPosition(50, 20);
		lvl1.setSize(Vector2f(80, 30));
		lvl1.setOutlineThickness(2);
		lvl2.setPosition(50, 60);
		lvl2.setSize(Vector2f(80, 30));
		lvl2.setOutlineThickness(2);
		lvl3.setPosition(50, 100);
		lvl3.setSize(Vector2f(80, 30));
		lvl3.setOutlineThickness(2);
		out.setPosition(50, 140);
		out.setSize(Vector2f(80, 30));
		out.setOutlineThickness(2);
		menuNum = 0;
		if (IntRect(50, 20, 80, 30).contains(pixelPos)) {
			t1.setFillColor(Color::Green);
			lvl1.setOutlineColor(Color::Green);
			menuNum = 1;
		}
		else {
			t1.setFillColor(Color::Black);
			lvl1.setOutlineColor(Color::Black);
		}
		if (IntRect(50, 60, 80, 30).contains(pixelPos)) {
			t2.setFillColor(Color::Green);
			lvl2.setOutlineColor(Color::Green);
			menuNum = 2;
		}
		else {
			t2.setFillColor(Color::Black);
			lvl2.setOutlineColor(Color::Black);
		}
		if (IntRect(50, 100, 80, 30).contains(pixelPos)) {
			t3.setFillColor(Color::Green);
			lvl3.setOutlineColor(Color::Green);
			menuNum = 3;
		}
		else {
			t3.setFillColor(Color::Black);
			lvl3.setOutlineColor(Color::Black);
		}
		if (IntRect(50, 140, 80, 30).contains(pixelPos)) {
			t4.setFillColor(Color::Green);
			out.setOutlineColor(Color::Green);
			menuNum = 4;
		}
		else {
			t4.setFillColor(Color::Black);
			out.setOutlineColor(Color::Black);
		}
		if (Mouse::isButtonPressed(Mouse::Left))
		{
			if (menuNum == 1) {
				lvlWindow.close();
				loadFromFile("lvl/1.txt", menuNum);
			}
			if (menuNum == 2) {
				lvlWindow.close();
				loadFromFile("lvl/2.txt", menuNum);
			}
			if (menuNum == 3) {
				lvlWindow.close();
				loadFromFile("lvl/3.txt", menuNum);
			}
			if (menuNum == 4) {
				lvlWindow.close();
				return 1;
			}
		}
		lvlWindow.clear(Color::White);
		lvlWindow.draw(lvl1);
		lvlWindow.draw(t1);
		lvlWindow.draw(lvl2);
		lvlWindow.draw(t2);
		lvlWindow.draw(lvl3);
		lvlWindow.draw(t3);
		lvlWindow.draw(out);
		lvlWindow.draw(t4);
		lvlWindow.display();
	}
	return 0;
}
int main()
{
	if(lvlSelect()==1)window.close();
	for (int i = 0; i < sizePoints; i++) {
		cout << i + 1 << "point:" << point[i].getX() << ' ' << point[i].getY() << endl;
	}
	cout << endl;
	for (int i = 0; i < sizeChip; i++) {
		cout << i + 1 << "chip:" << chip[i].getX1() << ' ' << chip[i].getY1() << endl;
	}
	cout << endl;
	for (int i = 0; i < sizeLines; i++) {
		cout << i + 1 << "line:" << line[i].getX1() << ' ' << line[i].getY1() << " - " << line[i].getX2() << ' ' << line[i].getY2() << endl;
	}
	Clock clock;
	float dx = 0, dy = 0;
	while (window.isOpen())
	{
		float time = clock.getElapsedTime().asMicroseconds();
		clock.restart();
		time = time / 800;
		Vector2i pixelPos = Mouse::getPosition(window);
		Vector2f pos = window.mapPixelToCoords(pixelPos);
		Event event;
		while (window.pollEvent(event))
		{
			if (event.type == Event::Closed)
				window.close();
		}
		int vict = 0;
		for (int i = 0; i < sizeChip; i++) {
			if (chip[i].getCurPoint() == point[victory[i]-1])vict++;
			if (vict == sizeChip) {
				if (lvlSelect() == 1)window.close();
			}
		}
		for (int i = 0; i < sizeChip; i++) {
			if (event.type == Event::MouseButtonPressed)
				if (event.key.code == Mouse::Left)
					if (pos.x >= chip[i].getX1() && pos.y >= chip[i].getY1() && pos.x <= chip[i].getX2() && pos.y <= chip[i].getY2())
					{
						dx = pos.x - chip[i].getX1();
						dy = pos.y - chip[i].getY1();
						chip[i].setIsMove(true);
						chip[i].getRect().setOutlineColor(Color::Yellow);
						chip[i].getRect().setOutlineThickness(4);
						for (int j = 0; j < sizePoints; j++) {
							if (chip[i].getCurPoint() == point[j]) {
								point[j].setHaveChip(0);
							}
						}
					}
			if (event.type == Event::MouseButtonReleased)
				if (event.key.code == Mouse::Left) {
					if (chip[i].getIsMove() == true) {
						chip[i].getRect().setOutlineThickness(0);
						chip[i].move(pos, line, point);
						cout << endl;
						for (int i = 0; i < sizePoints; i++) {
							cout << i + 1 << "point:" << point[i].getHaveChip() << endl;
						}
					}
					for (int j = 0; j < sizeLines; j++) {
						line[j].setColor(Color::Black);
					}
					chip[i].setIsMove(false);
				}

			if (chip[i].getIsMove()) {
				chip[i].setX1(pos.x - dx);
				chip[i].setY1(pos.y - dy);
				chip[i].update(point);
			}
		}
		updateWindow();
	}
	delete [] point;
	delete [] chip;
	delete [] line ;
	return 0;
}