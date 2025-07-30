// TreeAnimation.tsx - Versión Ultra Frondosa
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Ellipse, G } from 'react-native-svg';

interface TreeAnimationProps {
  percentage: number;
  width?: number;
  height?: number;
}

const TreeAnimation: React.FC<TreeAnimationProps> = ({ 
  percentage, 
  width = 300, 
  height = 400 
}) => {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPercentage(prev => {
        if (Math.abs(prev - percentage) < 1) {
          clearInterval(interval);
          return percentage;
        }
        return prev + (percentage - prev) * 0.08;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [percentage]);

  // Función para determinar opacidad según el porcentaje
  const getOpacity = (threshold: number, endThreshold: number): number => {
    if (currentPercentage < threshold) return 0;
    if (currentPercentage >= endThreshold) return 1;
    return (currentPercentage - threshold) / (endThreshold - threshold);
  };

  const getSeedOpacity = (): number => {
    if (currentPercentage <= 3) return 1;
    if (currentPercentage >= 12) return 0;
    return 1 - (currentPercentage - 3) / 9;
  };

  return (
    <View style={{ 
      alignItems: 'center', 
      justifyContent: 'center',
      width: width,
      height: height
    }}>
      <Svg width={width} height={height} viewBox="0 0 300 400">
        {/* Semilla (0-12%) */}
        <Circle
          cx="150"
          cy="300"
          r="6"
          fill="#8B4513"
          opacity={getSeedOpacity()}
        />

        {/* Sistema de raíces ultra expandido (8-25%) */}
        <G opacity={getOpacity(8, 25)}>
          {/* Raíces principales gruesas */}
          <Path
            d="M150,300 Q120,330 100,360 M150,300 Q180,330 200,360 M150,300 Q130,325 110,350 M150,300 Q170,325 190,350"
            stroke="#654321"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Raíces secundarias */}
          <Path
            d="M150,300 Q135,320 120,340 M150,300 Q165,320 180,340 M150,300 Q125,315 105,335 M150,300 Q175,315 195,335 M150,300 Q140,335 125,355 M150,300 Q160,335 175,355"
            stroke="#654321"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Red de raíces finas */}
          <Path
            d="M120,340 Q115,350 110,360 M180,340 Q185,350 190,360 M125,355 Q120,365 115,375 M175,355 Q180,365 185,375 M100,360 Q95,370 90,380 M200,360 Q205,370 210,380 M105,335 Q100,345 95,355 M195,335 Q200,345 205,355"
            stroke="#8B4513"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Raicillas muy finas */}
          <Path
            d="M110,360 Q105,365 100,370 M190,360 Q195,365 200,370 M115,375 Q110,380 105,385 M185,375 Q190,380 195,385 M95,355 Q90,360 85,365 M205,355 Q210,360 215,365"
            stroke="#8B4513"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
        </G>

        {/* Tronco ultra robusto (20-45%) */}
        <G opacity={getOpacity(20, 45)}>
          {/* Tronco principal más ancho */}
          <Path
            d="M140,300 L160,300 L158,130 L142,130 Z"
            fill="#8B4513"
            stroke="#654321"
            strokeWidth="1"
          />
          {/* Textura detallada del tronco */}
          <Path
            d="M142,295 Q145,290 142,285 M158,300 Q155,295 158,290 M143,280 Q146,275 143,270 M157,285 Q154,280 157,275 M144,265 Q147,260 144,255 M156,270 Q153,265 156,260 M145,250 Q148,245 145,240 M155,255 Q152,250 155,245 M146,235 Q149,230 146,225 M154,240 Q151,235 154,230 M147,220 Q150,215 147,210 M153,225 Q150,220 153,215 M148,205 Q151,200 148,195 M152,210 Q149,205 152,200 M149,190 Q152,185 149,180 M151,195 Q148,190 151,185 M150,175 Q153,170 150,165 M150,160 Q147,155 150,150 M148,145 Q151,140 148,135"
            stroke="#654321"
            strokeWidth="1"
            fill="none"
            opacity="0.8"
          />
          {/* Nudos y marcas del tronco */}
          <Ellipse cx="146" cy="270" rx="4" ry="2.5" fill="#654321" opacity="0.9" />
          <Ellipse cx="154" cy="240" rx="3.5" ry="2" fill="#654321" opacity="0.9" />
          <Ellipse cx="148" cy="210" rx="3" ry="1.5" fill="#654321" opacity="0.9" />
          <Ellipse cx="152" cy="180" rx="2.5" ry="1.5" fill="#654321" opacity="0.9" />
          <Ellipse cx="149" cy="150" rx="2" ry="1" fill="#654321" opacity="0.9" />
        </G>

        {/* Sistema de ramas ultra extenso (40-65%) */}
        <G opacity={getOpacity(40, 65)}>
          {/* Ramas principales súper gruesas */}
          <Path
            d="M150,150 Q110,130 80,110 M150,170 Q190,150 220,130 M150,190 Q120,170 95,150 M150,130 Q185,115 210,95 M150,210 Q125,190 100,170"
            stroke="#8B4513"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          {/* Ramas medias abundantes */}
          <Path
            d="M150,230 Q175,210 200,190 M150,160 Q180,145 205,125 M150,180 Q120,165 95,150 M150,200 Q185,185 210,170 M150,140 Q115,125 90,110"
            stroke="#8B4513"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Ramas secundarias del tronco */}
          <Path
            d="M148,250 Q135,235 125,220 M152,260 Q165,245 175,230 M146,220 Q133,205 120,190 M154,240 Q167,225 180,210"
            stroke="#8B4513"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </G>

        {/* Ramas terciarias y secundarias súper densas (55-75%) */}
        <G opacity={getOpacity(55, 75)}>
          {/* Desde ramas principales */}
          <Path
            d="M110,130 Q100,115 90,100 M110,130 Q115,115 125,105 M190,150 Q200,135 210,120 M190,150 Q185,135 175,125 M120,170 Q115,155 110,140 M120,170 Q125,155 135,145 M210,95 Q220,85 230,75 M210,95 Q205,85 195,80 M100,170 Q95,155 90,140 M100,170 Q105,155 115,150"
            stroke="#654321"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Más ramas desde puntos medios */}
          <Path
            d="M175,210 Q180,195 185,180 M175,210 Q170,195 160,185 M205,125 Q210,110 215,95 M205,125 Q200,110 190,105 M95,150 Q90,135 85,120 M95,150 Q100,135 110,130 M210,170 Q215,155 220,140 M210,170 Q205,155 195,150"
            stroke="#654321"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Ramas desde el tronco medio */}
          <Path
            d="M125,220 Q120,205 115,190 M175,230 Q180,215 185,200 M120,190 Q115,175 110,160 M180,210 Q185,195 190,180"
            stroke="#654321"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </G>

        {/* PRIMERA APARICIÓN DE HOJAS - Brotes iniciales (50-65%) */}
        <G opacity={getOpacity(45, 65)}>
          {/* Primeras hojas pequeñas en las puntas */}
          <Ellipse cx="90" cy="100" rx="6" ry="9" fill="#228B22" />
          <Ellipse cx="125" cy="105" rx="7" ry="10" fill="#32CD32" />
          <Ellipse cx="210" cy="120" rx="6" ry="8" fill="#228B22" />
          <Ellipse cx="175" cy="125" rx="7" ry="9" fill="#32CD32" />
          <Ellipse cx="110" cy="140" rx="5" ry="8" fill="#228B22" />
          <Ellipse cx="135" cy="145" rx="6" ry="9" fill="#32CD32" />
          <Ellipse cx="230" cy="75" rx="5" ry="7" fill="#228B22" />
          <Ellipse cx="195" cy="80" rx="6" ry="8" fill="#32CD32" />
          <Ellipse cx="85" cy="120" rx="5" ry="7" fill="#228B22" />
          <Ellipse cx="115" cy="150" rx="6" ry="9" fill="#32CD32" />
        </G>

        {/* Ramitas finales súper densas (70-80%) */}
        <G opacity={getOpacity(70, 80)}>
          <Path
            d="M90,100 Q85,90 80,80 M125,105 Q130,95 135,85 M210,120 Q215,110 220,100 M175,125 Q170,115 165,105 M110,140 Q105,130 100,120 M135,145 Q140,135 145,125 M185,180 Q190,170 195,160 M160,185 Q155,175 150,165 M215,95 Q220,85 225,75 M190,105 Q185,95 180,85 M85,120 Q80,110 75,100 M115,150 Q120,140 125,130"
            stroke="#654321"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Ramitas muy finas */}
          <Path
            d="M80,80 Q75,75 70,70 M135,85 Q140,80 145,75 M220,100 Q225,95 230,90 M165,105 Q160,100 155,95 M100,120 Q95,115 90,110 M145,125 Q150,120 155,115 M195,160 Q200,155 205,150 M150,165 Q145,160 140,155"
            stroke="#654321"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </G>

        {/* Hojas abundantes - Nivel 1 (60-75%) */}
        <G opacity={getOpacity(50, 65)}>
          {/* Hojas en ramas principales */}
          <Ellipse cx="80" cy="80" rx="10" ry="14" fill="#228B22" />
          <Ellipse cx="135" cy="85" rx="11" ry="16" fill="#32CD32" />
          <Ellipse cx="220" cy="100" rx="10" ry="13" fill="#228B22" />
          <Ellipse cx="165" cy="105" rx="9" ry="12" fill="#32CD32" />
          <Ellipse cx="100" cy="120" rx="11" ry="15" fill="#228B22" />
          <Ellipse cx="145" cy="125" rx="12" ry="17" fill="#32CD32" />
          <Ellipse cx="195" cy="160" rx="10" ry="14" fill="#228B22" />
          <Ellipse cx="150" cy="165" rx="11" ry="15" fill="#32CD32" />
          <Ellipse cx="225" cy="75" rx="8" ry="11" fill="#228B22" />
          <Ellipse cx="180" cy="85" rx="9" ry="13" fill="#32CD32" />
          <Ellipse cx="75" cy="100" rx="9" ry="12" fill="#228B22" />
          <Ellipse cx="125" cy="130" rx="10" ry="14" fill="#32CD32" />
          <Ellipse cx="205" cy="150" rx="9" ry="12" fill="#228B22" />
          <Ellipse cx="140" cy="155" rx="8" ry="11" fill="#32CD32" />
        </G>

        {/* Hojas densas - Nivel 2 (70-85%) */}
        <G opacity={getOpacity(70, 85)}>
          {/* Grupos de hojas medianas */}
          <Ellipse cx="85" cy="95" rx="15" ry="20" fill="#228B22" opacity="0.9" />
          <Ellipse cx="140" cy="100" rx="18" ry="25" fill="#32CD32" opacity="0.9" />
          <Ellipse cx="215" cy="115" rx="16" ry="22" fill="#228B22" opacity="0.9" />
          <Ellipse cx="170" cy="120" rx="17" ry="24" fill="#32CD32" opacity="0.9" />
          <Ellipse cx="105" cy="135" rx="15" ry="21" fill="#228B22" opacity="0.9" />
          <Ellipse cx="150" cy="140" rx="19" ry="26" fill="#32CD32" opacity="0.9" />
          <Ellipse cx="190" cy="175" rx="16" ry="23" fill="#228B22" opacity="0.9" />
          <Ellipse cx="155" cy="180" rx="17" ry="24" fill="#32CD32" opacity="0.9" />
          <Ellipse cx="75" cy="115" rx="14" ry="19" fill="#228B22" opacity="0.9" />
          <Ellipse cx="225" cy="95" rx="13" ry="18" fill="#32CD32" opacity="0.9" />
          <Ellipse cx="120" cy="160" rx="15" ry="20" fill="#228B22" opacity="0.9" />
          <Ellipse cx="180" cy="165" rx="16" ry="22" fill="#32CD32" opacity="0.9" />
        </G>

        {/* Follaje súper denso - Nivel 3 (80-90%) */}
        <G opacity={getOpacity(80, 90)}>
          {/* Copa principal masiva */}
          <Ellipse cx="150" cy="90" rx="70" ry="50" fill="#228B22" opacity="0.7" />
          <Ellipse cx="110" cy="110" rx="50" ry="40" fill="#32CD32" opacity="0.8" />
          <Ellipse cx="190" cy="110" rx="50" ry="40" fill="#228B22" opacity="0.7" />
          <Ellipse cx="150" cy="130" rx="65" ry="45" fill="#32CD32" opacity="0.8" />
          <Ellipse cx="80" cy="125" rx="40" ry="32" fill="#228B22" opacity="0.8" />
          <Ellipse cx="220" cy="125" rx="40" ry="32" fill="#32CD32" opacity="0.8" />
          <Ellipse cx="150" cy="155" rx="60" ry="35" fill="#228B22" opacity="0.7" />
          <Ellipse cx="125" cy="175" rx="45" ry="30" fill="#32CD32" opacity="0.8" />
          <Ellipse cx="175" cy="175" rx="45" ry="30" fill="#228B22" opacity="0.8" />
        </G>

        {/* Follaje ultra masivo - Nivel 4 (85-95%) */}
        <G opacity={getOpacity(85, 95)}>
          {/* Extensiones laterales máximas */}
          <Ellipse cx="150" cy="70" rx="50" ry="35" fill="#32CD32" opacity="0.9" />
          <Ellipse cx="95" cy="85" rx="35" ry="28" fill="#228B22" opacity="0.9" />
          <Ellipse cx="205" cy="85" rx="35" ry="28" fill="#32CD32" opacity="0.9" />
          <Ellipse cx="60" cy="115" rx="30" ry="25" fill="#228B22" opacity="0.8" />
          <Ellipse cx="240" cy="115" rx="30" ry="25" fill="#32CD32" opacity="0.8" />
          <Ellipse cx="70" cy="145" rx="32" ry="26" fill="#228B22" opacity="0.8" />
          <Ellipse cx="230" cy="145" rx="32" ry="26" fill="#32CD32" opacity="0.8" />
          <Ellipse cx="150" cy="190" rx="55" ry="30" fill="#228B22" opacity="0.7" />
          <Ellipse cx="105" cy="195" rx="35" ry="22" fill="#32CD32" opacity="0.8" />
          <Ellipse cx="195" cy="195" rx="35" ry="22" fill="#228B22" opacity="0.8" />
          
          {/* Hojas de detalle */}
          <Ellipse cx="115" cy="75" rx="12" ry="18" fill="#228B22" />
          <Ellipse cx="185" cy="75" rx="12" ry="18" fill="#32CD32" />
          <Ellipse cx="130" cy="60" rx="10" ry="15" fill="#228B22" />
          <Ellipse cx="170" cy="60" rx="10" ry="15" fill="#32CD32" />
          <Ellipse cx="50" cy="125" rx="15" ry="20" fill="#228B22" />
          <Ellipse cx="250" cy="125" rx="15" ry="20" fill="#32CD32" />
        </G>

        {/* Follaje completo ULTRA frondoso (90-100%) */}
        <G opacity={getOpacity(90, 100)}>
          {/* Capa final súper densa */}
          <Ellipse cx="150" cy="55" rx="35" ry="25" fill="#32CD32" opacity="0.95" />
          <Ellipse cx="120" cy="65" rx="25" ry="20" fill="#228B22" opacity="0.95" />
          <Ellipse cx="180" cy="65" rx="25" ry="20" fill="#32CD32" opacity="0.95" />
          <Ellipse cx="40" cy="135" rx="25" ry="20" fill="#228B22" opacity="0.9" />
          <Ellipse cx="260" cy="135" rx="25" ry="20" fill="#32CD32" opacity="0.9" />
          <Ellipse cx="55" cy="165" rx="28" ry="22" fill="#228B22" opacity="0.9" />
          <Ellipse cx="245" cy="165" rx="28" ry="22" fill="#32CD32" opacity="0.9" />
          <Ellipse cx="150" cy="200" rx="50" ry="25" fill="#228B22" opacity="0.8" />
          
          {/* Hojas en extremos */}
          <Ellipse cx="105" cy="50" rx="8" ry="12" fill="#228B22" />
          <Ellipse cx="195" cy="50" rx="8" ry="12" fill="#32CD32" />
          <Ellipse cx="135" cy="45" rx="6" ry="9" fill="#228B22" />
          <Ellipse cx="165" cy="45" rx="6" ry="9" fill="#32CD32" />
          <Ellipse cx="150" cy="40" rx="10" ry="8" fill="#32CD32" />
          <Ellipse cx="35" cy="145" rx="12" ry="18" fill="#228B22" />
          <Ellipse cx="265" cy="145" rx="12" ry="18" fill="#32CD32" />
          <Ellipse cx="50" cy="175" rx="15" ry="22" fill="#228B22" />
          <Ellipse cx="250" cy="175" rx="15" ry="22" fill="#32CD32" />
        </G>

        {/* Flores y frutos súper abundantes (95-100%) */}
        <G opacity={getOpacity(95, 100)}>
          {/* Flores por todo el árbol */}
          <Circle cx="120" cy="60" r="4" fill="#FF69B4" />
          <Circle cx="180" cy="65" r="4" fill="#FF69B4" />
          <Circle cx="150" cy="50" r="4" fill="#FF1493" />
          <Circle cx="135" cy="70" r="3" fill="#FF69B4" />
          <Circle cx="165" cy="70" r="3" fill="#FF69B4" />
          <Circle cx="95" cy="90" r="3" fill="#FF1493" />
          <Circle cx="205" cy="90" r="3" fill="#FF1493" />
          <Circle cx="110" cy="100" r="3" fill="#FF69B4" />
          <Circle cx="190" cy="100" r="3" fill="#FF69B4" />
          <Circle cx="150" cy="85" r="4" fill="#FF1493" />
          <Circle cx="80" cy="120" r="3" fill="#FF69B4" />
          <Circle cx="220" cy="120" r="3" fill="#FF69B4" />
          <Circle cx="125" cy="125" r="3" fill="#FF1493" />
          <Circle cx="175" cy="125" r="3" fill="#FF1493" />
          <Circle cx="150" cy="110" r="3" fill="#FF69B4" />
          <Circle cx="105" cy="140" r="3" fill="#FF69B4" />
          <Circle cx="195" cy="140" r="3" fill="#FF69B4" />
          <Circle cx="60" cy="130" r="3" fill="#FF1493" />
          <Circle cx="240" cy="130" r="3" fill="#FF1493" />
          
          {/* Frutos abundantes */}
          <Circle cx="90" cy="85" r="2.5" fill="#DC143C" />
          <Circle cx="210" cy="85" r="2.5" fill="#DC143C" />
          <Circle cx="130" cy="75" r="2" fill="#DC143C" />
          <Circle cx="170" cy="75" r="2" fill="#DC143C" />
          <Circle cx="115" cy="115" r="2.5" fill="#DC143C" />
          <Circle cx="185" cy="115" r="2.5" fill="#DC143C" />
          <Circle cx="75" cy="135" r="2" fill="#DC143C" />
          <Circle cx="225" cy="135" r="2" fill="#DC143C" />
          <Circle cx="150" cy="95" r="2.5" fill="#DC143C" />
          <Circle cx="140" cy="130" r="2" fill="#DC143C" />
          <Circle cx="160" cy="130" r="2" fill="#DC143C" />
        </G>
      </Svg>
    </View>
  );
};

export default TreeAnimation;