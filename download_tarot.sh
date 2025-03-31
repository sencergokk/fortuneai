#!/bin/bash

mkdir -p public/tarot

# Rider-Waite tarot kartları
# Major Arcana (0-21)
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg" -o "public/tarot/fool.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg" -o "public/tarot/magician.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg" -o "public/tarot/high-priestess.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg" -o "public/tarot/empress.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg" -o "public/tarot/emperor.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg" -o "public/tarot/hierophant.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg" -o "public/tarot/lovers.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg" -o "public/tarot/chariot.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg" -o "public/tarot/strength.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg" -o "public/tarot/hermit.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg" -o "public/tarot/wheel-of-fortune.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg" -o "public/tarot/justice.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg" -o "public/tarot/hanged-man.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg" -o "public/tarot/death.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg" -o "public/tarot/temperance.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg" -o "public/tarot/devil.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg" -o "public/tarot/tower.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg" -o "public/tarot/star.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg" -o "public/tarot/moon.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg" -o "public/tarot/sun.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg" -o "public/tarot/judgment.jpg"
curl -L "https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg" -o "public/tarot/world.jpg"

# Card back image
curl -L "https://www.sacred-texts.com/tarot/pkt/img/back.jpg" -o "public/tarot/back.jpg"

echo "All tarot card images downloaded successfully!" 