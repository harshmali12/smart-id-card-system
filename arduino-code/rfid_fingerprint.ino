#include <Adafruit_Fingerprint.h>
#include <MFRC522.h>
#include <SPI.h>
#include <SoftwareSerial.h>

#define RST_PIN 9
#define SS_PIN 10

SoftwareSerial mySerial(2, 3); // RX, TX for fingerprint sensor
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
MFRC522 rfid(SS_PIN, RST_PIN);

String rfidUID = "";

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();

  finger.begin(57600);
  if (finger.verifyPassword()) {
    Serial.println("Fingerprint sensor found!");
  } else {
    Serial.println("Fingerprint sensor not found :(");
    while (1);
  }
}

void loop() {
  // Check RFID
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    rfidUID = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      rfidUID += String(rfid.uid.uidByte[i], HEX);
    }
    rfidUID.toUpperCase();

    // Check fingerprint
    int id = getFingerprintID();
    if (id >= 0) {
      // Send data to Node.js via Serial
      Serial.print(rfidUID);
      Serial.print(",");
      Serial.println(id);
    }
    rfid.PICC_HaltA();
  }
}

int getFingerprintID() {
  finger.getImage();
  if (finger.image2Tz() != FINGERPRINT_OK) return -1;
  if (finger.fingerSearch() != FINGERPRINT_OK) return -1;
  return finger.fingerID;
}
