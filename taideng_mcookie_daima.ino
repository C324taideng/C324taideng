#define val_max 255
#define val_min 0
#include <ESP8266.h>
#ifdef ESP32
#error "This code is not recommended to run on the ESP32 platform! Please check your Tools->Board setting."
#endif
#if defined(__AVR_ATmega32U4__) || defined(__AVR_ATmega1284P__) || defined (__AVR_ATmega644P__) || defined(__AVR_ATmega128RFA1__)
#define EspSerial Serial1
#define UARTSPEED  115200
#endif
#if defined (__AVR_ATmega168__) || defined (__AVR_ATmega328__) || defined (__AVR_ATmega328P__)
#include <SoftwareSerial.h>
SoftwareSerial mySerial(2, 3); 
#define EspSerial mySerial
#define UARTSPEED  9600
#endif
#define SSID        F("vivo")//WIFI名
#define PASSWORD    F("00741888")//WIFI密码
#define HOST_NAME   F("api.heclouds.com")//域名
#define HOST_PORT   (80)
static const byte  GETDATA[]  PROGMEM = {
  "GET https://api.heclouds.com/devices/500214167/datapoints?datastream_id=ah,am,status,lx&limit=1 HTTP/1.1\r\nHost:api.heclouds.com\r\napi-key:M=kmt2Vjk=xkh09cRf=6TrZ6GjY=\r\nConnection: close\r\n\r\n"
};//关键头文件

ESP8266 wifi(&EspSerial);
//wifi

#include <U8glib.h>
//OLED
#include <Microduino_RTC.h>
//RTC时钟模块
int AL=1;
RTC rtc;
//short RECV_PIN = 10;//遥控//_________________________________________________________________________________________________int RECV_PIN = 10;//遥控
short pin3 = 2;//触摸      //_________________________________________________________________________________________________int pin3 = 2;//触摸
short pin2 = A0;//光敏     //_________________________________________________________________________________________________int pin2 = A0;//光敏
#define POUT 5   //led灯控制引脚   //led灯控制引脚
int sensorValue;
int up=23,down=21,rh=0,rm=0;
//#include <IRremote.h>
//IRrecv irrecv(RECV_PIN);
//decode_results results;
//遥控 内存不够
#include "audio.h"
//#include <SoftwareSerial.h>
int music_vol = 1; //初始音量0~30


DateTime dateTime = {2017, 12, 5, 23,14, 47, 0};//时间初值
char lx[10]="receive";//______________________________________________________________short temp1,Rstatus=0,lx=0;
short ah=19,am=40,ch=0,wd=0,sd=0;
bool Rstatus=0,ws=0,tcp=0,ala=0,touch=1;
String rstatus,wstatus,astatus;

uint16_t tYear;
uint8_t tMonth, tWeekday, tDay, tHour, tMinute, tSecond; 
#define INTERVAL_LCD             1000             //定义OLED刷新时间间隔  
 long lcd_time = millis();                 //OLED刷新时间计时器
U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_NONE);     //设置OLED型号
//-------字体设置，大、中、小
#define setFont_H u8g.setFont(u8g_font_timB18)
#define setFont_M u8g.setFont(u8g_font_timB10)
#define setFont_S u8g.setFont(u8g_font_fixed_v0r)
//#define setFont_S u8g.setFont(u8g_font_chikitar)
long previousMillis = 0;        // 存储LED最后一次的更新
long interval = 20000;           // 闪烁的时间间隔（毫秒）
unsigned long currentMillis = 0;


void setup() {
  Serial.begin(9600);

 audio_init(DEVICE_Flash,4,music_vol); 
  pinMode(pin2, INPUT);//光敏
  pinMode(pin3, INPUT);//触摸
  pinMode(POUT, OUTPUT);
  //                 pinMode(9,OUTPUT);
  //               pinMode(11,OUTPUT);
 // irrecv.enableIRIn(); // 启动红外解码
  rtc.begin();
  rtc.clearAll();//设置启动时间
//rtc.setDateTime(dateTime);//第一次是校准，之后注释掉的话能实现每次不初始化时间，也就是RTC模块独立，顺便一提RTC断电一段时间也螚继续走至少三天（别被core 格式化就可以）
 //  Serial.begin(115200);
 // while (!Serial);
 // delay(100);
  WifiInit(EspSerial, UARTSPEED);
  if (wifi.setOprToStationSoftAP()) {} else {}
if (wifi.joinAP(SSID, PASSWORD)) {ws=1;} else {ws=0;}
  if (wifi.disableMUX()) {} else {}
}

void online()
{

 //if(!tcp)
wifi.createTCP(HOST_NAME, HOST_PORT);

 
 wifi.sendFromFlash(GETDATA, sizeof(GETDATA));
//从Flash读取发送内容，节约内存
  uint8_t buffer[512] = {0};
  uint32_t len = wifi.recv(buffer, sizeof(buffer), 20000);
  if (len > 0)
  {
     short k=0,temp=0,tax[3];
     char mm[10] ={0};
 tax[0]=ah;
 tax[1]=am;
    for (uint32_t i = 0; i < len-12; i++) {

      if((char)buffer[i]=='v'&&(char)buffer[i+1]=='a'&&(char)buffer[i+2]=='l'&&(char)buffer[i+3]=='u'&&(char)buffer[i+4]=='e')
      {
            /*  for (uint32_t m  = 0; m<512;m++){
         Serial.print((char)buffer[m]);
        }*/
          for (uint32_t j = 0; j<4;j++)
              if((char)buffer[i+j+7]>='0'&&(char)buffer[i+j+7]<='9')
              {temp=((short)buffer[i+j+7]-48)+temp*10;
              //Serial.print(temp);
              }else if((char)buffer[i+j+7]>='A'&&(char)buffer[i+j+7]<='z'){
                for(int z=i+j+7-2,k=0;k<10;k++,z++){
                  if((char)buffer[i+j+7]>='A'&&(char)buffer[i+j+7]<='z'){
                  mm[k]=(char)buffer[z];}else{
                  mm[k]=" ";
                  }
                }
              }
              // Serial.print('\n');
              //Serial.println(temp);

       
           if(k==0)
           {//Serial.println(temp);
           ah=temp;}
           else if(k==1) 
           {//Serial.println(temp);
           am=temp;}
           else if(k==2)
           {
                     for(int l=0, p=0;(l<10)&(p==0);l++){
                      if((mm[l]>=65)&(mm[l]<=90)|(mm[l]>=97)&(mm[l]<=122)){
                                    lx[l]=mm[l];
                        }else{
                          lx[l]=32;
                          }
                          if(mm[l]==44){
                            p=p+1;}
            }
            }
            
            else if(k==3)
           {//Serial.println(temp);
          AL=temp;
          }
           k++;
           temp=0;     
    }
    for(int n=0;n<10;n++){
    Serial.print(mm[n]);
    }
    
    }
  if(ah!=tax[0]||am!=tax[1]){
  Rstatus=1;
  previousMillis = currentMillis;
  }

  //Serial.println(currentMillis - previousMillis);
  }
  else
 {if(!tSecond%2) ws=0;}
 //wifi.releaseTCP();
}

//*******************************************************************************************************************************************

void loop() {
    rtc.getTime(&tHour, &tMinute, &tSecond);
  rtc.getDate(&tYear, &tMonth, &tWeekday, &tDay);
    
  sensorValue = analogRead(pin2);
 //_______________________________________________________________________________________________________________________   
  if(digitalRead(pin3))
  {
  if(tMinute==ch)
   touch=1;
   }
   else
   {
    tMinute+2<60?ch=tMinute+2:ch=tMinute-58;
   touch=0;
    }
  
    //_______________________________________________________________________________________________________________________   
    Serial.println(digitalRead(pin3));
  currentMillis = millis();

//_______________________________________________________________________________________________________________________   //红外控制 
//  if (irrecv.decode(&results)) {
 //   remotecontrol(results.value);
 //   irrecv.resume(); // 接收下一个值
 //   previousMillis = currentMillis; 
//  } 
//_______________________________________________________________________________________________________________________   //光强控制 

   
   if(tSecond==0&&ws==0&&ala==0)
     {
      if (wifi.joinAP(SSID, PASSWORD)) {ws=1;} else {ws=0;}
     }
  Rstatus?rstatus="ON":rstatus="OFF";
  ws?wstatus="ON":wstatus="OFF";
  AL==1?astatus="ON":astatus="OFF";
 //_______________________________________________________________________________________________________________________   //OLED  
       u8g.firstPage();
      do {
      u8g.drawLine(0, 20, 120, 20);
      u8g.drawLine(0, 48, 120, 48);
      u8g.drawLine(104, 20, 104, 48);
        setFont_M;
        u8g.setPrintPos(0, 15);
        u8g.print(tHour);                
        u8g.setPrintPos(20, 15);
        u8g.print(":");
        u8g.setPrintPos(30, 15);
        u8g.print(tMinute);
        u8g.setPrintPos(86, 15);
        u8g.print(tMonth);
        u8g.setPrintPos(92, 15);
        u8g.print("/");
        u8g.setPrintPos(98, 15);
        u8g.print(tDay);
      
        u8g.setPrintPos(60, 15);
        u8g.print(tSecond);
          setFont_S;
        u8g.setPrintPos(105, 28);
        u8g.print(rstatus);
        u8g.setPrintPos(105, 38);
        u8g.print(wstatus);
        u8g.setPrintPos(105, 48);
        u8g.print(astatus);
         setFont_M;
        for(int i=0;i<10;i++){
          u8g.setPrintPos(i*8, 40);
        u8g.print(lx[i]);
          }
                u8g.setPrintPos(0, 64);
        u8g.print(sensorValue);
        u8g.setPrintPos(50, 64);
        u8g.print((currentMillis - previousMillis)/1000);
                u8g.setPrintPos(80, 64);
        u8g.print(wd);

      } while ( u8g.nextPage() );
 //_______________________________________________________________________________________________________________________   //抹除      
     if(ws&&ala==0)
     {online();}
     if(((currentMillis - previousMillis)/1000>3600)&&sensorValue>800||((currentMillis - previousMillis)/1000>10800))//一小时
      Rstatus=0;

}
